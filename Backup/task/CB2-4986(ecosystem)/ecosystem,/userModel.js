"use strict";
const USER_TABLE = "sys_user";
const ORGANIZATION_TABLE = "sys_organization";
const AUTH_PROVIDERS_TABLE = "sys_authProviders";
const APPLICATION_TABLE = "sys_application";
const ATTACHMENT_TABLE = "sys_attachment";
const ROLE_APPLICATION_TABLE = "sys_roleApplication";
const ORG_INTEGRATION_TABLE = "sys_orgIntegration";
const ROLE_INTEGRATION_TABLE = "sys_roleIntegration";
const FEED_TYPES_TABLE = "sys_feedTypes";
const APPLICATION_ENTITY_TYPES_TABLE = "sys_applicationEntityType";
const ORG_ROLES_TABLE = "sys_orgRoles";
const ORG_EXTERNAL_SYSTEM_TABLE = "sys_orgExternalSystem";
const EXTERNAL_SYSTEM_TABLE = "sys_externalSystem";
const util = require("util");
const config = require("../config.json");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
//const bluebird = require("bluebird");
const encryptionProvider = require("../lib/encryptionProvider")({});
const emailProvider = require("../lib/emailProvider")();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/user.json"));
const crypto = require("crypto");
const sessionHelper = require("../lib/session");
const user_roles = {
	ecoAdmin: "eco-admin",
	orgAdmin: "org-admin",
	orgMember: "org-member"
};
const roleModel = require("./roleModel")({});
const { Logger } = require("node-app-core/dist/logger");
const UserPolicyCache = require("../lib/userPolicyCache");
const logger = new Logger("ecosystem", "/models/userModel.js");


module.exports = UserModel;

// Errors like this!
// throw ({err: {'message': 'User not found', 'code': 404}})

function UserModel(options) {
	if (!(this instanceof UserModel)) return new UserModel(options);
	const self = this;
	self.options = options;
}

/**
 * findAllUsers  - retrieve all users in the system
 * 
 */
UserModel.prototype.getAll = async function (orgId) {
	try {
		const users = await r
			.table(USER_TABLE)
			.filter(
				r.and(
					r.row("deleted").eq(false).default(true),
					r.row("api").default(false).ne(true),
					r.branch(
						fromOrg,
						r.and(
							r.row("orgId").eq(orgId),
							r.row("disabled").default(false).eq(false)
						),
						true
					)
				)
			)
			.without("password", "passwordHistory")
			.run();
		return users;
	} catch (err) {
		return err;
	}
};



/**
 * streamAll
 * @param handler
 */
UserModel.prototype.streamAll = function (handler) {
	try {
		const changesQuery = r
			.table(USER_TABLE)
			.filter({ deleted: false }, { default: true })
			.without("password")
			.changes({ includeInitial: true, includeTypes: true });

		const onFeedItem = function (change) {
			handler(change);
		};

		const onError = function (err) {
			console.log("users.streamAll changefeed error", err);
		};

		const cancelFn = provider.processChangefeed("UserModel.streamAll", changesQuery, onFeedItem, onError);
		return cancelFn;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

/**
 * getProfile
 * @param userId
 */
UserModel.prototype.getProfile = async userId => {
	try {
		const users = await r
			.table(USER_TABLE)
			.filter({ deleted: false }, { default: true })
			.filter({ id: userId })
			.without("password", "passwordHistory")
			.merge(function (user) {
				return {
					authProviderId: r.table(AUTH_PROVIDERS_TABLE).get(user("authProviderId")).pluck("providerId")("providerId"),
					applications: r
						.table(ROLE_APPLICATION_TABLE)
						.filter({ roleId: user("roleId") })
						.eqJoin("appId", r.table(APPLICATION_TABLE), {
							index: "appId"
						})
						.without([
							{ left: ["id", "appId", "lastModifiedDate", "userId", "roleId"] },
							{ right: ["id", "metadata", "permissionOptions"] }
						])
						.zip()
						.coerceTo("ARRAY"),
					attachments: r
						.table(ATTACHMENT_TABLE)
						.filter({ targetId: user("id") })
						.coerceTo("ARRAY")
				};
			})
			.map(function (user) {
				// If user has null roleId, his/her permissions are custom-defined and already present
				// on the user object
				return r.branch(
					user("roleId").eq(null),
					user,
					user.merge(function (user) {
						return {
							orgRole: r
								.table(ORG_ROLES_TABLE)
								.get(user("roleId"))
								.without("orgId", "lastModified", "id")
						};
					})
				);
			})
			.eqJoin("orgId", r.table(ORGANIZATION_TABLE), { index: "orgId" })
			.map(function (row) {
				return row
					.merge({ user: row("left"), org: row("right") })
					.without("left", "right");
			})
			.run();

		const profile = users[0];
		if (!profile) {
			throw { err: { message: "User not found", code: 404 } };
		}

		const userRoleInts = await roleModel.getRoleIntegrations(profile.user.roleId, profile.org.orgId);
		profile.user["integrations"] = userRoleInts;


		const getOrgExternalSystems = await r.table(ORG_EXTERNAL_SYSTEM_TABLE).filter(r.row("orgId").eq(profile.org.orgId));
		const externalSystemIds = [];
		const externalSystems = await r.table(EXTERNAL_SYSTEM_TABLE).run();
		getOrgExternalSystems.forEach((row) => {
			externalSystems.forEach((externalSystemRow) => {
				if (externalSystemRow.externalSystemId === row.externalSystemId && externalSystemRow.enabled) {
					externalSystemIds.push(externalSystemRow.externalSystemId);
				}
			});

		});

		profile.externalSystems = externalSystemIds;

		profile.user.appSettings.locale = profile.user.appSettings.locale || config.environment.locale || "en";

		return profile;
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.getLightProfile = async (userId) => {
	try {
		const user = await r
			.table(USER_TABLE)
			.filter({ deleted: false }, { default: true })
			.filter({ id: userId })
			.without("password", "passwordHistory")
			.map(function (user) {
				// If user has null roleId, his/her permissions are custom-defined and already present
				// on the user object. This means we do not need to grab the admin-specific permissions
				// from sys_orgRoles
				return r.branch(
					user("roleId").eq(null),
					user,
					user.merge(function (user) { // Otherwise, merge the orgRoles data onto the document
						return {
							orgRole: r
								.table(ORG_ROLES_TABLE)
								.get(user("roleId"))
								// Without keys not needed in pared-down user object
								.without(
									"orgId",
									"lastModifiedDate",
									"id",
									"lastModified",
									"roleId"
								)
						};
					})
				);
			})
			.merge(function (user) { // Adding integrations and applications. In an ideal world, the light profile
				return {			// Would not need these, but for now we do. May change later. 
					applications: r
						.table(ROLE_APPLICATION_TABLE)
						.filter({ roleId: user("roleId") })
						.eqJoin("appId", r.table(APPLICATION_TABLE), {
							index: "appId"
						})
						.without([
							{ left: ["id", "appId", "lastModifiedDate", "userId", "roleId"] },
							{ right: ["id", "metadata"] }
						])
						.zip()
						.coerceTo("ARRAY"),
					integrations: r
						.table(ROLE_INTEGRATION_TABLE)
						.merge((roleInt) => {
							return r.table(ORG_INTEGRATION_TABLE)
								.get(roleInt("orgIntId"))
								.pluck("policy");
						})
						.filter((roleInt) => {
							return roleInt("roleId").eq(user("roleId"))
								.and(
									roleInt.hasFields({ "policy": "term" }).not()
										.or(r.now().during(roleInt("policy")("term")("start"), roleInt("policy")("term")("end"), { leftBound: "closed", rightBound: "closed" }))
								);
						})
						.eqJoin("intId", r.table(FEED_TYPES_TABLE), {
							index: "feedId"
						})
						.without([
							{ left: ["intId", "lastModifiedDate", "userId", "roleId"] },
							{ right: ["id", "metadata", "isShareable"] }
						])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			// Removing more unneeded keys
			.without(
				"contact",
				"disabled",
				"email",
				"lastModifiedDate",
				"resetExpires",
				"resetToken",
				"username",
				"role",
				"roleId"
			)
			.run();

		if (user[0]) {
			return user[0];
		} else {
			return "user not found"
		}
	}
	catch (err) {
		return err;
	}
};

/**
 * getById
 * @param userId
 * 
 */

// With password variant
UserModel.prototype.getById = async function (userId) {
	try {
		const response = await r
			.table(USER_TABLE)
			.filter({ id: userId })
			.filter({ deleted: false }, { default: true })
			.run();

		const user = response[0]; // this returns an array of one record
		if (user) {
			return user;
		} else {
			return "user not found";
		}
	} catch (err) {
		return err;
	}
};

/**
 * getById
 * @param userId
 * 
 */
UserModel.prototype.getByUserId = async function (userId) {
	try {
		const user = await r
			.table(USER_TABLE)
			.get(userId)
			.without("password", "passwordHistory")
			.run();

		if (user && !user.deleted) {
			return user;
		} else {
			return "User not found";
		}
	} catch (err) {
		return err;
	}
};

/**
 * getByUsername
 * @param username
 * 
 * This should not be exposed publicly as password is returned for verifying credentials
 */
UserModel.prototype.getByUsername = async function (username) {
	try {
		const escapedUsername = getRegexSafeEmail(username);
		const response = await r
			.table(USER_TABLE)
			.filter(
				r.row("username").match(`^(?i)${escapedUsername}$`)
			)
			.filter({ deleted: false }, { default: true })
			.run();

		const user = response[0]; // this returns an array of one record
		if (user) {
			return user;
		} else {
			return null;
		}
	} catch (err) {
		return err;
	}
};

UserModel.prototype.create = async (user, token, translations) => {
	// todo: validate caller is org admin and org admin of the org being added to
	// -- todo: do we need to support self registration?
	try {
		user.setPasswordToken = token;
		user.createdDate = new Date();
		user.lastModifiedDate = new Date();
		user.username = user.username || user.email.toLowerCase();
		user.firstUseAck = false;
		user.appSettings = {
			tts: {
				enabled: false,
				type: null
			},
			trackHistory: {
				duration: 30
			}
		};

		if (!user.authProviderId) {
			user.authProviderId = "system";
		}

		const escapedEmail = getRegexSafeEmail(user.email);

		const checkUser = await r
			.table(USER_TABLE)
			.filter(
				r.row("username").eq(user.username)
					.or(
						r.row("email").match(`^(?i)${escapedEmail}$`)
					)
			)
			.filter({ deleted: false }, { default: true })
			.run();
		if (checkUser[0]) {
			throw { err: { message: "The username or email you have provided is already registered.", code: 500 } };
		}
		if (!user.roleId) {
			user.roleId = user.orgId + "_org_user";
		}
		// check User data vs schema with AJV
		if (!validate(user)) {
			throw { "message": "Validation Error ", "err": validate.errors };
		}
		const userResult = await r.table(USER_TABLE).insert(user);
		if (userResult.inserted != 1) {
			throw { err: "user not created" };
		}

		const id = userResult.generated_keys[0];
		if (user.authProviderId === "system") {
			const templateData = {
				name: user.name,
				username: user.username,
				// Changed resetUrl -> generic url prop
				url: process.env.BASE_INSTALLATION_ADDRESS + "/login/set-password/" + token,
				translations: translations
			};
			emailProvider.queueEmail(
				"setEmail",
				process.env.BASE_INSTALLATION_ADDRESS.includes("dev") ? config.environment.fromDev : config.environment.fromEmail,
				user.email,
				templateData
			);
		}
		return { success: true, newId: id };

	} catch (err) {
		throw err;
	}
};

UserModel.prototype.update = async function (userId, user) {
	const self = this;
	// todo: validate caller is self, org admin and org admin of the user's org
	if (user.password) {
		throw new Error("Cannot update password via update user");
	}
	try {
		user.lastModifiedDate = new Date();
		const userResult = await r
			.table(USER_TABLE)
			.filter({ id: userId })
			.filter({ deleted: false }, { default: true })
			.update(user, { returnChanges: true })
			.run()
			.then(function (result) {
				if (result.replaced != 1) {
					throw { err: { code: 500, message: "user not updated" } }
				} else {
					const oldDisabled = result.changes[0].old_val.disabled ? result.changes[0].old_val.disabled : false;
					const newDisabled = result.changes[0].new_val.disabled ? result.changes[0].new_val.disabled : false;
					if (oldDisabled === false && newDisabled === true) {
						console.log(`User ${userId} has been disabled. Dropping users active sessions.`);
						sessionHelper.dropUserAllSessions(userId);
					}
					return result;
				}
			})
			.error(function (err) {
				throw err;
			});
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.failedLoginAttempt = async function (userId, maxAttempts, lockoutPeriod) {
	try {
		const result = await r
			.table(USER_TABLE)
			.get(userId)
			.update({
				failedLoginAttempts: r.row("failedLoginAttempts").add(1).default(1)
			},
				{ returnChanges: true })
			.run();
		if (result.replaced != 1) {
			return { ok: false };
		}
		else {
			const failedAttempts = result.changes[0].new_val.failedLoginAttempts;
			console.log("login attempts=", failedAttempts, "max attempts=", maxAttempts);
			if (failedAttempts >= maxAttempts) {
				const result = await r
					.table(USER_TABLE)
					.get(userId)
					.update({
						lockedUntil: new Date(Date.now() + ((1000 * 60) * lockoutPeriod))
					})
					.run();
			}
		}
	}
	catch (err) {
		return { ok: false, reason: err.message };
	}
};

UserModel.prototype.resetLoginAttempts = async function (userId) {
	try {
		const result = await r
			.table(USER_TABLE)
			.get(userId)
			.update({
				failedLoginAttempts: 0,
				lockedUntil: null
			},
				{ returnChanges: true })
			.run();
		return { ok: result.replaced === 1 };
	}
	catch (err) {
		return { ok: false, reason: err.message };
	}
};

UserModel.prototype.upsertUsers = async function (users) {

	for (let userInc = 0; userInc < users.length; userInc++) {
		const user = users[userInc];

		const checkUser = await r
			.table(USER_TABLE)
			.filter({ username: user.username })
			.filter({ deleted: false }, { default: true })
			.run();
		const dbuser = checkUser[0];

		// Insert user
		if (!dbuser) {
			const token = crypto.randomBytes(20).toString("hex");
			this.create(user, token);
		}
		// Update user
		else {
			this.update(dbuser.id, user);
		}
	}
};

/**
 * Update (if nonexistant, create) users from external systems. 
 * -- This method works similarly to upsertUsers, with the added benefit
 * -- of being able to update deleted external users.
 * @param {array} users -- array of user objects from other systems
 */
UserModel.prototype.upsertExternalUsers = async function (users) {
	try {
		for (let i = 0; i < users.length; i++) {
			const user = users[i];

			const checkUser = await r.table(USER_TABLE)
				.filter({ username: user.username })
				.run();
			const usernameExists = checkUser[0];

			// User that was deleted and is from external system
			if (usernameExists && usernameExists.deleted) {
				this.undeleteExternalUser(user);
			}
			// User that exists
			else if (usernameExists) {
				this.update(usernameExists.id, user);
			}
			// Brand new user
			else {
				// Add necessary information for new user
				const newUser = {
					...user,
					contact: {
						address: null,
						cellPhone: null,
						city: null,
						officePhone: null,
						state: null,
						zip: null
					},
					deleted: false,
					orgRole: {
						ecosystem: {
							canContribute: true,
							canView: true,
							canshare: true
						},
						organization: {
							canContribute: true,
							canEdit: true,
							canShare: true,
							canView: true
						},
						roleId: null,
						title: "Custom"
					},
					admin: false,
					ecoAdmin: false,
					role: "system-user",
					roleId: null
				};

				// Create user with null password token
				this.create(newUser, null);
			}
		}
	}
	catch (err) {
		throw err;
	}
};

/**
 * Undelete an external user and re-create their integrations. This is mainly used by userSyncProcessor to handle
 * -- users who were marked deleted by being removed from external auth then added again
 * @param {object} user -- formatted user object from external auth provider
 * @param {function} callback -- optional callback
 */
UserModel.prototype.undeleteExternalUser = async function (user) {
	try {
		const userExists = await r.table(USER_TABLE)
			.filter({ username: user.username })
			.run();
		const dbUser = userExists[0];

		if (dbUser) {
			const userId = dbUser.id;

			const userUpdate = await r.table(USER_TABLE)
				.get(userId)
				.update({
					deleted: false,
					name: user.name,
					email: user.email,
					authProviderId: user.authProviderId
				})
				.run();
		}
	}
	catch (err) {
		throw err;
	}
};

UserModel.prototype.setPassword = async function (userId, newPassword) {
	try {
		const encryptedPW = encryptionProvider.encryptPassword(newPassword);
		const validateResult = await this.validatePassword(userId, newPassword, encryptedPW);
		if (validateResult.isValid) {
			const op = {
				password: encryptedPW,
				passwordExpires: validateResult.expires,
				passwordHistory: validateResult.passwordHistory,
				passwordChangedDate: new Date(),
				setPasswordToken: null,
				resetToken: null,
				resetExpires: null
			};

			const updateResult = await r
				.table(USER_TABLE)
				.filter({ id: userId })
				.filter({ deleted: false }, { default: true })
				.update(op)
				.run();
			if (updateResult.replaced === 1) {
				return { success: true };
			}
			else {
				throw { "message": "set-password failed", code: 400 };
			}
		}
		else {
			console.log("Password validation failed", validateResult.reason);
			throw { "message": `Password validation failed: ${validateResult.reason}`, code: 422 };
		}
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.validatePassword = async function (userId, password, encryptedPassword) {
	// validation required by default
	const authMode = config.authentication ? config.authentication.mode.toLowerCase() : "advanced";

	if (authMode === "advanced") {
		// -- password ttl default 90 days
		const passwordTTL = config.authentication ? config.authentication.passwordTTL || 90 : 90;
		const blacklistedPasswords = config.authentication ? config.authentication.passwordBlacklist || [] : [];
		const user = await util.promisify(this.getById)(userId);
		// password not same as username
		if (user.username.toLowerCase() === password.toLowerCase()) {
			return {
				isValid: false,
				reason: "password is same as username"
			};
		}

		// min length 8 chars
		if (password.length < 8) {
			return {
				isValid: false,
				reason: "password must be a minimum of 8 characters"
			};
		}

		// in blacklist
		if (blacklistedPasswords.indexOf(password) > -1) {
			return {
				isValid: false,
				reason: "password on blacklist"
			};
		}

		// -- must not contain tokens of 3 alphanumeric characters or more from users name or email
		const nameTokens = user.name.split(/[.\-\s_@]/);
		const emailTokens = user.email.split(/[.\-\s_@]/);
		const allTokens = nameTokens.concat(emailTokens);
		for (const idx in allTokens) {
			const token = allTokens[idx].toLowerCase();
			if (token.length >= 3) {
				if (password.toLowerCase().includes(token)) {
					return {
						isValid: false,
						reason: "tokens from name/email found in password"
					};
				}
			}
		}

		// Must have one number, one lower case char, one upper case char and 1 special char
		const charMatch = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{0,}$/);
		if (!charMatch) {
			return {
				isValid: false,
				reason: "require one number, one lower case char, one upper case char and one special char in password"
			};
		}

		// passwordHistory
		const pwHist = user.passwordHistory || [];
		for (const idx in pwHist) {
			const oldPw = pwHist[idx];
			const oldPwMatch = encryptionProvider.compareSync(password, oldPw);
			if (oldPwMatch) {
				return {
					isValid: false,
					reason: "password has been used within last 10 password changes"
				};
			}
		}
		pwHist.unshift(encryptedPassword);
		if (pwHist.length > 10) pwHist.pop();

		return {
			isValid: true,
			expires: new Date(Date.now() + ((1000 * 60 * 60 * 24) * passwordTTL)),
			passwordHistory: pwHist
		};
	}
	else {
		return {
			isValid: true,
			expires: -1,
			passwordHistory: []
		};
	}

};

UserModel.prototype.delete = async function (userId) {
	const self = this;
	try {
		const result = await r
			.expr([
				r
					.table(USER_TABLE)
					.filter({ id: userId })
					.filter({ deleted: false }, { default: true })
					.update({ deleted: true })
			])
			.run()
			.then(function (result) {
				return result;
			})
			.error(function (err) {
				throw err;
			});
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.addSync = function (_user) {
	const self = this;
	try {
		r
			.table(USER_TABLE)
			.insert(_user)
			.run()
			.then(function (result) {
				if (result.inserted == 1) {
					throw "User was not created";
				} else {
					return "user created successfully";
				}
			})
			.error(function (err) {
				throw err;
			});
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.setProfileImage = async function (userId, fileHandle) {
	const self = this;

	try {
		const updateResult = await r
			.table(USER_TABLE)
			.filter({ id: userId })
			.update({ profileImage: fileHandle })
			.run();

		console.log("UserModel setProfileImage result:", updateResult);

		return updateResult;
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.getAppSettings = async function (userId) {
	try {
		const result = await r.table(USER_TABLE)
			.get(userId)
			.run();

		const data = result.appSettings;

		return data;
	}
	catch (err) {
		throw err;
	}
};

UserModel.prototype.updateAppSettings = async function (userId, update) {
	try {
		let canUpdate = true;
		const allowedProperties = ["trackHistory", "tts", "unitsOfMeasurement", "spotlightProximity", "timeFormat", "locale"];
		const keys = Object.keys(update);

		keys.forEach(key => {
			if (!allowedProperties.includes(key)) {
				canUpdate = false;
			}
		});

		if (canUpdate) {
			const result = await r.table(USER_TABLE)
				.get(userId)
				.update({
					appSettings: update
				})
				.run();

			return result;
		}
		else {
			throw { "err": "Property not allowed" };
		}
	}
	catch (err) {
		return err;
	}
};

UserModel.prototype.updateRole = async function (userId, update) {
	const self = this;

	if (typeof update === "string") {
		// If we're assigning the user to a defined role
		try {
			const updateResult = await r
				.table(USER_TABLE)
				.filter({ id: userId })
				.update({ roleId: update })
				.run();

			console.log("UserModel updateRole result:", updateResult);

			return updateResult;
		} catch (err) {
			throw err;
		}
	} else {
		// else we are giving the user custom positions
		try {
			const updateResult = await r
				.table(USER_TABLE)
				.filter({ id: userId })
				.update(update)
				.run();

			return updateResult;
		} catch (err) {
			throw err;
		}
	}
};

UserModel.prototype.hasAccessToApp = async function (userId, appId) {

	const user = await this.getByUserId(userId);

	try {
		const userConfig = await r
			.table(ROLE_APPLICATION_TABLE)
			.filter({ roleId: user.roleId, appId: appId })
			.pluck("config")
			.run();

		// var result = userConfig[0].config;

		if (!userConfig[0]) {
			throw { err: { message: "access denied", code: 500 } };
		} else {
			return userConfig[0].config;
		}
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.requestReset = async function (email, translations) {
	const resetExpires = new Date();
	const resetToken = crypto.randomBytes(20).toString("hex");
	resetExpires.setMinutes(
		resetExpires.getMinutes() + config.resetExpiresMinutes
	);

	try {
		const escapedEmail = getRegexSafeEmail(email);
		let result = await r
			.table(USER_TABLE)
			.filter(r.row("email").match(`^(?i)${escapedEmail}$`))
			.filter({ deleted: false }, { default: true });

		if (!result[0]) {
			throw { err: { message: "Email does not exist", code: 404 } };
		}

		if (result[0].disabled) {
			throw { err: { message: "Account is deactivated", code: 403 } };
		}

		result = await r
			.table(USER_TABLE)
			.filter(r.row("email").match(`^(?i)${escapedEmail}$`))
			.filter({ deleted: false }, { default: true })
			.update(
				{ resetToken: resetToken, resetExpires: resetExpires },
				{ returnChanges: true }
			)
			.run();

		// Throw error if user does not exist
		if (result.replaced < 1) {
			throw { err: { message: "User not found", code: 404 } };
		}

		const user = result.changes[0].new_val;
		const authProviderId = await r.table(AUTH_PROVIDERS_TABLE).get(user.authProviderId).pluck("providerId")("providerId").run();
		const templateData = {
			name: user.name,
			username: user.email,
			// Changed resetUrl -> generic url prop
			url: process.env.BASE_INSTALLATION_ADDRESS + "/login/reset/" + resetToken,
			translations: translations
		};
		emailProvider.queueEmail(
			authProviderId === "system" ? "passwordReset" : "activeDirectoryPasswordReset",
			config.environment.fromEmail,
			user.email,
			templateData
		);

		return { code: 200, message: "ok" };
	} catch (err) {
		return err;
	}
};

UserModel.prototype.verifyReset = async function (resetToken, callback) {
	const now = new Date();

	try {
		const user = await r
			.table(USER_TABLE)
			.filter({ resetToken: resetToken })
			.run();

		if (!user[0]) {
			throw {
				err: { code: 401, message: "The provided reset link is not valid" }
			};
		}

		const isValid = now <= user[0].resetExpires;

		if (!isValid) {
			throw {
				err: {
					code: 401,
					message: "The provided reset link is no longer valid"
				}
			};
		} else {
			return { code: 200, message: "ok", userId: user[0].id };
		}
	} catch (err) {
		return err;
	}
};

UserModel.prototype.verifyInitialSetPassword = async function (token) {
	const now = new Date();

	try {
		const user = await r
			.table(USER_TABLE)
			.filter({ setPasswordToken: token })
			.run();

		if (!user[0]) {
			throw {
				err: { code: 401, message: "The token provided is not valid" }
			};
		} else {
			return { code: 200, message: "ok", userId: user[0].id };
		}
	} catch (err) {
		throw err;
	}
};

/**
 * getUsersSharingPermissions -- returns sharing permissions for each given userId
 * @param userIds
 */
UserModel.prototype.getUsersSharingPermissions = async function (userIds) {
	try {
		const permissionSets = await r
			.table(USER_TABLE)
			.filter({ deleted: false }, { default: true })
			.filter(user => {
				return r.expr(userIds).contains(user("id"));
			})
			.without("password", "passwordHistory")
			.map(function (user) {
				// If user has null roleId, his/her permissions are custom-defined and already present
				// on the user object
				return r.branch(
					user("roleId").eq(null),
					user,
					user.merge(function (user) {
						return {
							orgRole: r
								.table(ORG_ROLES_TABLE)
								.get(user("roleId"))
								.without("orgId", "lastModified", "id", "title")
						};
					})
				);
			})
			.pluck("orgRole", "id")
			.run();


		return permissionSets;
	} catch (err) {
		throw err;
	}
}

UserModel.prototype.streamDisabled = function (handler) {
	const self = this;

	try {
		const q = r.table(USER_TABLE)
			.filter({ disabled: true })
			.changes({ includeInitial: true, includeTypes: true });


		const onFeedItem = (change) => {
			handler(null, change);
		};

		const onError = (err) => {
			console.log("UserModel.streamDisabled changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("UserModel.streamDisabled", q, onFeedItem, onError);
		return cancelFn;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

UserModel.prototype.checkIntegration = async function (userId, handler) {
	try {
		const result = await this.getById(userId);
			if (result) {
				const roleInts = await roleModel.getRoleIntegrations(result.roleId, result.orgId);
				const q = r.table(ROLE_INTEGRATION_TABLE)
					.filter({ "roleId": result.roleId })
					.changes({ "includeInitial": true, "includeTypes": true, "includeStates": false })
					.merge((row) => {
						return r.table(FEED_TYPES_TABLE)
							.filter((ft) => {
								return ft("feedId").eq(row("new_val")("intId"));
							})(0).default({});
					});

				const onFeedItem = (change) => {
					const roleInt = roleInts.find((roleInt) => roleInt.feedId === change.new_val.intId);
					handler(null, { ...change, ...roleInt });
				};

				const onError = (err) => {
					console.log("UserModel.checkIntegration changefeed error", err);
					handler(err, null);
				};

				const cancelFn = provider.processChangefeed("UserModel.checkIntegration", q, onFeedItem, onError);
				return cancelFn;

			}
	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

UserModel.prototype.checkAppIntegration = function (userId, appId, handler, callback) {
	try {

		this.getById(userId, async function (err, result) {
			if (err) {
				logger.error(
					"getById",
					"Error getting user by ID",
					{ err: { message: err.message, code: err.code } }
				);
				callback(err, null);
			} else if (result) {

				const appInts = await this.getAppIntegrations(userId, appId);

				const q = r.table(ROLE_INTEGRATION_TABLE)
					.filter({ "roleId": result.roleId })
					.changes({ "includeInitial": true, "includeTypes": true, "includeStates": false });

				const onFeedItem = (change) => {
					const appInt = appInts.find((appInt) => change.new_val.intId === appInt.intId);
					if (appInt) {
						const mergeChange = { ...appInt, ...change.new_val };
						change = { ...change, ...mergeChange };
						handler(null, change);
					}
				};

				const onError = (err) => {
					logger.error(
						"checkAppIntegration",
						"UserModel.checkAppIntegration changefeed error",
						{ err: { message: err.message, code: err.code } }
					);
					handler(err, null);
				};

				const cancelFn = provider.processChangefeed("UserModel.checkAppIntegration", q, onFeedItem, onError);
				if (callback) callback(null, cancelFn);

			}
		}.bind(this));
	} catch (err) {
		logger.error(
			"checkAppIntegration",
			"UserModel.checkAppIntegration error",
			{ err: { message: err.message, code: err.code } }
		);
		if (callback) callback(err, null);
	}
};

UserModel.prototype.getIntegrations = async function (userId) {
	try {
		const user = await this.getByUserId(userId);
		const result = await r.table(ROLE_INTEGRATION_TABLE)
			.filter({ "roleId": user.roleId })
			.eqJoin("intId", r.table(FEED_TYPES_TABLE), {
				index: "feedId"
			})
			.without([
				{ left: ["lastModifiedDate", "userId"] },
				{ right: ["id", "metadata", "isShareable"] }
			])
			.zip()
			.coerceTo("ARRAY")
			.run();
		return result;
	} catch (err) {
		throw err;
	}
};

UserModel.prototype.getAppIntegrations = async function (userId, appId) {
	try {
		const user = await this.getByUserId(userId);

		const roleInts = await roleModel.getRoleIntegrations(user.roleId, user.orgId);
		const userAppEntities = await r.table(APPLICATION_ENTITY_TYPES_TABLE)
			.filter({ "appId": appId });

		const appInts = [];

		for (const roleInt of roleInts) {
			const userAppEnt = userAppEntities.find((appEnt) => appEnt.entityType === roleInt.entityType);
			if (userAppEnt) {
				roleInt["appId"] = appId;
				appInts.push(roleInt);
			}
		}

		return appInts;

	} catch (err) {
		throw err;
	}
};

UserModel.prototype.checkEmailAvailability = async (email) => {
	try {
		const result = await r.table(USER_TABLE)
			.filter({ "email": email })
			.run();

		// If a user has the email, return true
		if (result[0]) { return true; }
		// Otherwise, false
		else { return false; }
	}
	catch (err) {
		// If there is an error, don't let them proceed
		return true;
	}
};

UserModel.prototype.userExists = async (username) => {
	try {
		const result = await r.table(USER_TABLE)
			.filter({ username: username })
			.run();

		if (result[0]) {
			return result[0];
		}
		else {
			return false;
		}
	}
	catch (err) {
		// If there's an error, don't proceed
		return true;
	}
};

UserModel.prototype.checkExpiringPasswords = async (days = 7, translations) => {
	try {
		// Build filter
		const notDisabled = r.row("disabled").default(false).eq(false);
		const hasPassword = r.row.hasFields("password");
		const notLocked = r.or(
			r.row.hasFields("lockedUntil").not(),
			r.row("lockedUntil").lt(r.now())
		);
		const pwExpiring = r.and(
			r.row.hasFields("passwordExpires"),
			r.row("passwordExpires").gt(r.now()),
			r.row("passwordExpires").lt(r.now().add(days * 86400))
		);
		const filter = r.and(notDisabled, hasPassword, notLocked, pwExpiring);

		// Get users with expiring passwords
		const expiringUsers = await r.table(USER_TABLE).filter(filter).run();


		const retVal = [];
		if (expiringUsers && expiringUsers.length > 0) {
			//Send email to each user
			expiringUsers.forEach(user => {
				const days = Math.floor((user.passwordExpires.getTime() - Date.now()) / 86400000);
				const templateData = {
					name: user.name,
					days: days == 0 ? 1 : days,
					translations: translations
				};
				retVal.push(templateData);
				emailProvider.queueEmail(
					"passwordExpiringSoon",
					process.env.BASE_INSTALLATION_ADDRESS.includes("dev") ? config.environment.fromDev : config.environment.fromEmail,
					user.email,
					templateData
				);
			});
		}

		return retVal;
	}
	catch (err) {
		throw (err);
	}
};

const getRegexSafeEmail = email => {
	//Regex metacharacters: ^$.|?*+{
	return email.replace("^", "\\^")
		.replace("$", "\\$")
		.replace(".", "\\.")
		.replace("|", "\\|")
		.replace("?", "\\?")
		.replace("*", "\\*")
		.replace("+", "\\+")
		.replace("{", "\\{");
};