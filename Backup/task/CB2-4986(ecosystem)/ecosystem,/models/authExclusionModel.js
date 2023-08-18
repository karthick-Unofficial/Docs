"use strict";
const ENTITY_TYPE_TABLE = "sys_entityType";
const AUTH_EXCLUSION_TABLE = "sys_authExclusion";
const EXTERNAL_ENTITY_MAPPING_TABLE = "sys_externalEntityMapping";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const eventModel = require("./eventModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/exclusionModel.js");

module.exports = ExclusionModel;

function ExclusionModel(options) {
	if (!(this instanceof ExclusionModel)) return new ExclusionModel(options);
	this.options = options;
}

/**
 * Add an entity to the authExclusion table to ensure it is filtered from a user's streams and rest calls
 * Returns an object with that specific entities batch types to remove it from local state on the front end
 * @param {string} userId -- User's ID
 * @param {string} entityId -- Entity's ID
 * @param {string} entityType -- Entity's type
 */
ExclusionModel.prototype.create = async (userId, entityId, entityType, feedId) => {
	try {
		const sourceTable = await r.table(ENTITY_TYPE_TABLE)
			.filter({ "name": entityType })(0)("sourceTable")
			.run();

		if (!sourceTable) {
			logger.error(
				"create",
				{ err: { message: `Source table not found for entityType ${entityType}`, stack: "/models/authExclusionModel.js" } }
			);
			return { msg: `Source table not found for entityType ${entityType}` };
		}

		// Grab correct type to display icons
		const data = await r.table(sourceTable)
			.filter({ "id": entityId })
			.map(
				r.branch(
					r.expr(entityType).eq("event"),
					{
						"iconType": r.branch(
							r.row.hasFields("endDate"),
							"Planned",
							"Emergent"
						),
						"name": r.row("name")
					},
					{
						"iconType": r.branch(
							r.row("entityData")("properties").hasFields("subtype"),
							r.row("entityData")("properties")("subtype"),
							r.row("entityData")("properties")("type")
						),
						"name": r.branch(
							r.row("entityData")("properties").hasFields("name"),
							r.row("entityData")("properties")("name"),
							r.row("entityData")("properties")("mmsi")
						)
					}
				)
			)(0)
			.run();

		const result = await r.table(AUTH_EXCLUSION_TABLE)
			.insert({
				userId,
				entityId,
				entityType,
				iconType: data.iconType,
				name: data.name,
				feedId,
				created: new Date()
			})
			.run();

		const returnVal = {
			"result": result,
			"entityType": entityType,
			"feedId": feedId,
			"entityId": entityId
		};

		return returnVal;
	} catch (ex) {
		logger.error(
			"create",
			{ err: { message: ex.message, code: ex.code, stack: "/models/authExclusionModel.js" } }
		);
		throw ex;
	}
};

/**
 * Remove an entry from the authExclusion table to allow it to be streamed or retrieved via rest call for a user
 * @param {string} userId -- User's id
 * @param {array} entityIds -- Entity's id
 */
ExclusionModel.prototype.delete = async (userId, entityIds) => {
	try {
		const entityTypes = await r.table(ENTITY_TYPE_TABLE).run();
		const exclusions = await r.table(AUTH_EXCLUSION_TABLE)
			.filter((doc) => {
				return r.and(
					doc("userId").eq(userId),
					r.expr(entityIds).contains(doc("entityId"))
				);
			})
			.run();

		// Delete exclusion entries
		const result = await r.table(AUTH_EXCLUSION_TABLE)
			.filter((doc) => {
				return r.and(
					doc("userId").eq(userId),
					r.expr(entityIds).contains(doc("entityId"))
				);
			})
			.delete()
			.run();

		const data = exclusions.map(exclusion => {
			const sourceTableDoc = entityTypes.find((type) => type.name === exclusion.entityType);
			return {
				id: exclusion.id,
				entityId: exclusion.entityId,
				entityType: exclusion.entityType,
				sourceTable: sourceTableDoc.sourceTable
			};
		});

		const results = [];

		for (let i = 0; i < data.length; i++) {
			const exclusion = data[i];

			try {
				let result;

				// Events need additional data when displaying in apps, such as pinned items. 
				// Here we can leverage eventModel.getByIdWithAllData to return most of that and can 
				// build the response with the data the front end would expect to repopulate the state there
				if (exclusion.entityType === "event") {
					const additionalProperties = await r
						.table(EXTERNAL_ENTITY_MAPPING_TABLE)
						.filter({
							targetId: exclusion.entityId
						})(0)
						.default({})
						.pluck("additionalProperties")("additionalProperties")
						.default({});

					try {
						const res = await eventModel.getByIdWithAllData(userId, exclusion.entityId);
						const { event, activities, pinnedItems } = res;

						result = ({
							...event,
							"pinnedItems": pinnedItems,
							"commentCount": activities.length,
							"additionalProperties": additionalProperties
						});

					} catch (err) {
						logger.error(
							"delete",
							{ err: { message: err.message, code: err.code, stack: "/models/authExclusionModel.js" } }
						);
					}
				}
				// If it's not an event, just query for the data from its source table
				else {
					result = await r.table(exclusion.sourceTable)
						.get(exclusion.entityId)
						.run();
				}

				if (result) {

					// Ensure ID exists on properties for loading profiles
					if (result.entityData && result.entityData.properties) {
						result.entityData.properties.id = result.id;
					}

					results.push(result);
				}
			} catch (ex) {
				logger.error(
					"delete",
					{ err: { message: ex.message, code: ex.code, stack: "/models/authExclusionModel.js" } }
				);
			}
		}

		return { entities: results };
	} catch (ex) {
		logger.error(
			"delete",
			{ err: { message: ex.message, code: ex.code, stack: "/models/authExclusionModel.js" } }
		);
		throw ex;
	}
};

ExclusionModel.prototype.streamExclusionsByUser = async (userId, handler) => {
	try {
		const query = r.table(AUTH_EXCLUSION_TABLE)
			.filter({ "userId": userId })
			.changes({ "includeInitial": true, "includeTypes": true });

		const onFeedItem = (change) => {
			handler(null, change);
		};

		const onError = (err) => {
			logger.error(
				"streamExclusionsByUser",
				{ err: { message: err.message, code: err.code, stack: "/models/authExclusionModel.js" } }
			);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("authExclusionModel.streamExclusionsByUser", query, onFeedItem, onError);

		return cancelFn;
	} catch (ex) {
		throw ex;
	}
};