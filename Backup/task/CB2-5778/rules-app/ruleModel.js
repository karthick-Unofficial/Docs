"use strict";
const RULES_TABLE = "sys_rules";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rethink connection/db
const Ajv = require("ajv");
const ajv = new Ajv({ useDefaults: true });
const validate = ajv.compile(require("./schema/rules.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("rules-app", "/models/ruleModel.js");
const _global = require("node-app-core/dist/app-global.js");
const JWT = require("jsonwebtoken");

module.exports = RuleModel;

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

function RuleModel(options) {
	if (!(this instanceof RuleModel)) return new RuleModel(options);
	this.options = options;
	const self = this;
	self.options = options;
}

const checkTargetsSubjects = async (rule, user, appRequest) => {
	try {
		// If track movement rule, must have a subject or target, if not bail out
		if (rule.type === "track-movement" && !rule.subject.length && !rule.targets.length) {
			throw new Error("Track movement rules must have at least one subject or target");
		}

		const subjects = [];
		const targets = [];

		let externalSystems = await appRequest.request("ecosystem", "GET", "/externalSystem", {}, null, {
			userId: user.id,
			orgId: user.orgId
		});
		if (externalSystems.success === false) {
			logger.error(
				"checkTargetsSubjects",
				"External systems could not be retrieved, subject will fail validation if external system",
				{
					err: {
						message: externalSystems.reason.message,
						code: externalSystems.reason.code
					}
				}
			);
			externalSystems = [];
		}

		// cSpell:ignore ents
		const azEnts = async (ents, azArray) => {
			await asyncForEach(ents, async (ent) => {
				if (ent.externalSystemId) {
					// -- check if the user is authorized to access this externalSystem
					if (externalSystems.length > 0) {
						externalSystems.forEach((externalSystem) => {
							if (externalSystem.type && externalSystem.type === "alarm") {
								if (ent.externalSystemId === externalSystem.externalSystemId) {
									azArray.push(ent);
								}
							}
						});
					}
				} else if (ent.berthGroupId) {
					if (ent.owner === user.id || (ent.isPublic && ent.ownerOrg === user.orgId)) {
						azArray.push(ent);
					}
				} else if (ent.template) {
					// -- check if the user is authorized to access this template
					if (ent.ownerOrg === user.orgId || ent.sharedWith.includes(user.orgId)) {
						azArray.push(ent);
					}
				} else if (ent.eventType) {
					// -- check if the user is authorized to access this event type
					const res = await appRequest.request("ecosystem", "GET", `/eventTypes/${ent.eventType}`, {}, null, {
						userId: user.id
					});
					if (!res || res.success === false) {
						logger.error("checkTargetsSubjects.azEnts", "Event type could not be retrieved", {
							err: {
								message: res.reason.message,
								code: res.reason.code
							}
						});
					} else {
						azArray.push(ent);
					}
				} else if (ent.entityType && ent.entityType === "feed") {
					if (user.integrations.some((int) => int.feedId === ent.feedId)) {
						azArray.push(ent);
					}
				} else {
					// right now it looks like subject will either be a track or an external system - external system is handled in the first case and type is not populated on track
					// which is required for az so adding for sake of az request
					ent.entityType = ent.entityType || "track";
					const azResult = await appRequest.request(
						"ecosystem",
						"GET",
						`/entities/${ent.entityType}/${ent.id}/authorize/view`,
						{},
						null,
						{ userId: user.id }
					);
					if (azResult.isAuth) azArray.push(ent);
				}
			});
		};

		await azEnts(rule.targets, targets);
		if (rule.targets.length !== targets.length) {
			throw new Error("User does not have access to all targets");
		}

		await azEnts(rule.subject, subjects);
		if (rule.subject.length !== subjects.length) {
			throw new Error("User does not have access to all subjects");
		}

		rule.subject = subjects;
		rule.targets = targets;

		return rule;
	} catch (err) {
		logger.error("checkTargetsSubjects", "Unexpected error", {
			errMessage: err.message,
			errStack: err.stack
		});
		return null;
	}
};

/**
 *  create
 * @param rule
 * @param callback
 */
RuleModel.prototype.create = async (rule, identity, appRequest) => {
	try {
		const userProfile = await appRequest.request("ecosystem", "GET", `/users/${identity.userId}/profile`);
		const newRule = await checkTargetsSubjects(rule, userProfile.user, appRequest);
		if (newRule) {
			newRule["owner"] = identity.userId;
			newRule["ownerOrg"] = identity.orgId;

			// check Rule data vs schema with AJV
			if (!validate(newRule)) {
				throw new Error(`Validation Error: ${validate.errors}`);
			}

			const result = await r.table(RULES_TABLE).insert(rule, { returnChanges: true }).run();

			if (result && result.changes[0]) {
				result.changes[0].new_val["entityType"] = "rule";
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}

			return result;
		} else {
			throw new Error("Problem creating rule, check permissions to targets and subjects");
		}
	} catch (err) {
		logger.error("create", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		return err;
	}
};

/**
 *  update
 * @param ruleId, rule
 * @param callback
 */
RuleModel.prototype.update = async (ruleId, ruleUpdate, identity, appRequest) => {
	try {
		const azResult = await appRequest.request(
			"ecosystem",
			"GET",
			"/applications/rules-app/authorize/manage",
			{},
			null,
			{ userId: identity.userId }
		);
		const userProfile = await appRequest.request("ecosystem", "GET", `/users/${identity.userId}/profile`);
		const rule = await r.table(RULES_TABLE).get(ruleId).run();

		if (!rule.isDeleted && (identity.userId === rule.owner || azResult.isAuth === true)) {
			/** TODO: Change how checkTargetsSubjects works. Currently, it builds the rule targets/subjects based on
			 * 	ones you have access to, filtering out those you don't. But it also will throw an exception if you
			 * 	try to edit a rule that contains targets/subjects you don't have access to. There is no point in doing both.
			 * 	It should probably just be something we run that throws an error if the rules contains unauthorized
			 * 	targets/subjects, which will bail out of the method. There's no point building and returning a new
			 * 	object like we're currently doing.
			 */
			const authRule = await checkTargetsSubjects(rule, userProfile.user, appRequest);

			if (authRule) {
				// Build new rule object and replace to allow for the removal of rule.assignments keys
				const updatedRule = {
					...authRule,
					...ruleUpdate
				};
				const ruleQuery = r.table(RULES_TABLE).get(ruleId).replace(updatedRule, { returnChanges: true });

				const durationCondition = rule.conditions.find((condition) => {
					return condition.type === "duration";
				});

				const result = await ruleQuery.run();

				if (result && result.changes[0]) {
					result.changes[0].new_val["entityType"] = "rule";
					result.changes[0].old_val["entityType"] = "rule";
					const change = {
						new_val: result.changes[0].new_val,
						old_val: result.changes[0].old_val,
						rt: true
					};
					_global.globalChangefeed.publish(change);
				}

				return result;
			} else {
				throw new Error("User does not have access to rule or rule not found");
			}
		} else {
			throw new Error("User does not have access to rule or rule not found");
		}
	} catch (err) {
		logger.error("update", "Unexpected error", {
			errMessage: err.message,
			errStack: err.stack
		});
		throw err;
	}
};

/**
 * Remove a user from a rule's 'assignments' object
 * @param {string} ruleId
 * @param {string} userId
 */
RuleModel.prototype.unsubscribe = async (ruleId, userId) => {
	try {
		const result = await r
			.table(RULES_TABLE)
			.get(ruleId)
			.replace(r.row.without({ assignments: { [userId]: true } }))
			.run();

		return result;
	} catch (err) {
		logger.error("unsubscribe", "An error occurred while attempting to unsubscribe user from rule", {
			err: { message: err.message, code: err.code }
		});
		throw err;
	}
};

/**
 *  delete
 * @param ruleId
 * @param callback
 */
RuleModel.prototype.delete = async (ruleId, identity, appRequest) => {
	try {
		const azResult = await appRequest.request(
			"ecosystem",
			"GET",
			"/applications/rules-app/authorize/manage",
			{},
			null,
			{ userId: identity.userId }
		);
		const rule = await r.table(RULES_TABLE).get(ruleId).run();
		if (
			!rule.isDeleted &&
			(rule.owner === identity.userId || (azResult.isAuth === true && rule.ownerOrg === identity.orgId))
		) {
			const ruleQuery = r.table(RULES_TABLE).get(ruleId).update(
				{
					deleted: true
				},
				{ returnChanges: true }
			);

			const result = await ruleQuery.run();

			if (result && result.changes[0]) {
				result.changes[0].new_val["entityType"] = "rule";
				result.changes[0].old_val["entityType"] = "rule";
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}

			return result;
		} else {
			throw new Error("User does not have permission to delete this rule");
		}
	} catch (err) {
		logger.error("delete", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 *  getActive - get all that aren't deleted - internal use only as not authorized
 * @param callback
 */
RuleModel.prototype.getActive = async () => {
	try {
		const result = await r
			.table(RULES_TABLE)
			.filter(
				{
					deleted: false
				},
				{
					default: true
				}
			)
			.run();
		return result;
	} catch (err) {
		logger.error("getActive", "An unexpected error occurred while attempting to get active rules", {
			err: { message: err.message, code: err.code }
		});
		throw err;
	}
};

/**
 *  getById
 * @param ruleId
 * @param callback
 */
RuleModel.prototype.getById = async (ruleId, identity, appRequest) => {
	try {
		const azResult = await appRequest.request(
			"ecosystem",
			"GET",
			"/applications/rules-app/authorize/manage",
			{},
			null,
			{ userId: identity.userId }
		);
		const result = await r.table(RULES_TABLE).get(ruleId).filter({ deleted: false }, { default: true }).run();
		if (
			!result.isDeleted &&
			(result.owner === identity.userId || (azResult.isAuth === true && result.ownerOrg === identity.orgId))
		) {
			return result;
		} else {
			throw new Error("User does not have access to rule");
		}
	} catch (err) {
		logger.error("getById", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 *  getByOrg
 * @param ruleId
 * @param callback
 */
RuleModel.prototype.getByOrg = async (orgId, identity) => {
	try {
		if (identity.orgId === orgId) {
			const result = await r
				.table(RULES_TABLE)
				.filter({
					ownerOrg: orgId
				})
				.filter(
					{
						deleted: false
					},
					{
						default: true
					}
				)
				.run();
			return result;
		} else {
			throw new Error(`User cannot view rules from ${orgId}`);
		}
	} catch (err) {
		logger.error("getByOrg", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		return err;
	}
};

/**
 *  cleanEntity
 * @param entityId
 */
RuleModel.prototype.cleanEntity = async function (entityId) {
	try {
		const result = await r
			.table(RULES_TABLE)
			.forEach(function (item) {
				return r.branch(
					// If it's the only target or the only subject, delete rule
					item("targets")("id")
						.contains(entityId)
						.and(item("targets").count().eq(1))
						.or(item("subject")("id").contains(entityId).and(item("subject").count().eq(1))),
					r.table(RULES_TABLE).get(item("id")).update({
						isDeleted: true
					}),
					// Else if it's one of multiple targets, delete it from targets
					item("targets")("id").contains(entityId).and(item("targets").count().gt(1)),
					r
						.table(RULES_TABLE)
						.get(item("id"))
						.update({
							targets: item("targets").deleteAt(
								item("targets")
									.offsetsOf(function (i) {
										return i("id").eq(entityId);
									})
									.nth(0)
							)
						}),
					// Else if it's one of multiple subjects, delete it from subjects
					item("subject")("id").contains(entityId).and(item("subject").count().gt(1)),
					r
						.table(RULES_TABLE)
						.get(item("id"))
						.update({
							subject: item("subject").deleteAt(
								item("subject")
									.offsetsOf(function (i) {
										return i("id").eq(entityId);
									})
									.nth(0)
							)
						}),
					{
						replaced: 0
					}
				);
			})
			.run();

		return result;
	} catch (err) {
		logger.error("cleanEntity", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

RuleModel.prototype.getAssociations = async function (entityId) {
	try {
		const result = await r
			.table(RULES_TABLE)
			.filter((rule) => {
				return r.branch(
					r.and(
						rule("targets")
							.map((target) => {
								return target("id");
							})
							.contains(entityId),
						rule("deleted").default(false).ne(true)
					),
					true,
					false
				);
			})
			.map((rule) => {
				return rule("title");
			})
			.run();

		return result;
	} catch (err) {
		logger.error("getAssociations", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

RuleModel.prototype.streamUserRules = async function (userId, entityId, handler, callback) {
	try {
		/* IMPORTANT: This method should, ideally, return rule data and append the name of the 
		*  user who created the rule onto the rule record from the DB before sending to the front end.
		*  However, we seem to have issues using appRequest.request (or _executeRequest) to make the
		*  call to the user table that we need. For now, this method only returns rules that a user should
		*  have access to. The code for appending users can be added back by removing code commented out
		*  with //
		/

		/*	IMPORTANT 2: For now, we are just going to add the user's name to a rule when it is created. 
		*   This isn't idea, as a user could change their name and it would not update on the rule.
		*	If this becomes a problem, we can figure out why the rest call doesn't work and implement
		*   it into the changefeed with the code below.
		*/

		/*
		 * Array of objects containing the userId of the user who owns a rule
		 * that you have access to.
		 * example: [{owner: 12345}, {owner: 65734}, {owner: 12345}]
		 */
		// const ruleOwners = await r
		// 	.table(RULES_TABLE)
		// 	.filter((entry) => {
		// 		return entry("assignments").keys().contains(userId);
		// 	})
		// 	.pluck("owner")
		// 	.run();

		/* Filter out duplicates */
		// const uniqueRuleOwners = ruleOwners.reduce((acc, value) => {
		// 	if(!acc.find((object) => object.owner === value.owner)) {
		// 		acc.push(value);
		// 	}
		// 	return acc;
		// }, []);

		// const namesByHash = {};

		/*
		 * Set owners name by hash in object
		 * This is async and needs to make a rest call for each user.
		 */
		// const namesByHash = {};

		// uniqueRuleOwners.forEach(async item => {
		// 	const userData = await makeRequest("ecosystem", "GET", `/users/${item.owner}`, null, null, identity);

		// 	namesByHash[item.id] = userData.name;
		// });

		let query = r.table(RULES_TABLE).filter((entry) => {
			return (
				// Return document if either are true:
				r.or(
					// Logged in user owns the rule
					entry("owner").eq(userId),
					// Logged in user is associated with the rule
					entry("assignments").keys().contains(userId)
				)
			);
		});
		// .map((doc) => {
		// 	return doc.merge({"ownerName": r.expr(namesByHash)(doc("owner"))});
		// })

		/* If you pass in an entity Id, only return rules that the entity is associated with specifically */
		if (entityId) {
			query = query.filter(
				r
					.row("subject")
					.contains((subj) => {
						return subj("id").eq(entityId);
					})
					.or(
						r.row("targets").contains((subj) => {
							return subj("id").eq(entityId);
						})
					)
			);
		}

		/* Run the query */
		query
			.changes({ includeInitial: true, includeTypes: true })
			.run()
			.then(function (feed) {
				if (callback) callback(null, feed);
				feed.each(function (err, change) {
					if (err) {
						handler(err);
					} else {
						handler(null, change);
					}
				});
			});
	} catch (ex) {
		if (callback) callback(ex, null);
	}
};

RuleModel.prototype.unsubscribeEmail = async (ruleUpdate) => {
	try {
		const token = ruleUpdate.token;
		const { ruleId, userId } = JWT.verify(token, "un-subscribe");
		const rule = {
			assignments: {
				[userId]: {
					id: userId,
					notifyEmail: false
				}
			}
		};

		const result = await r
			.table(RULES_TABLE)
			.get(ruleId)
			.update(rule, { returnChanges: true })
			.run();

		if (result && result.changes[0]) {
			result.changes[0].new_val["entityType"] = "rule";
			const change = {
				new_val: result.changes[0].new_val,
				old_val: result.changes[0].old_val,
				rt: true
			};
			_global.globalChangefeed.publish(change);
		}

		return { success: true };
	} catch (err) {
		logger.error("unsubscribe", "An error occurred while attempting to unsubscribe user from rule", {
			err: { message: err.message, code: err.code }
		});
		throw err;
	}
};

RuleModel.prototype.resubscribeEmail = async (ruleUpdate) => {
	try {
		const token = ruleUpdate.token;
		const { ruleId, userId } = JWT.verify(token, "un-subscribe");
		const rule = {
			assignments: {
				[userId]: {
					notifyEmail: true
				}
			}
		};

		const result = await r
			.table(RULES_TABLE)
			.get(ruleId)
			.update(rule)
			.run();

		return { success: true };
	} catch (err) {
		logger.error("resubscribe", "An error occurred while attempting to resubscribe user from rule", {
			err: { message: err.message, code: err.code }
		});
		throw err;
	}
};