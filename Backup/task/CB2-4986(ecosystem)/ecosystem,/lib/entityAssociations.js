const EVENT_ENTITIES_TABLE = "sys_eventEntities";
const ENTITY_COLLECTIONS_TABLE = "sys_entityCollections";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const _global = require("../app-global.js");


/**
 * Return the number of things (lists, rules, events, etc) an entity is associated with
 * @param {string} entityId -- Id of entity for association checking
 */
exports.entityAssociations = async function (entityId, identity) {
	try {
		const associatedRuleNames = await _global.appRequest.request("rules-app", "GET", `/rules/associations/${entityId}`, null, null, identity);

		return {
			hasAssociations: associatedRuleNames.length,
			rules: associatedRuleNames
		};
	} 
	catch (err) {
		return {
			"error": err
		};
	}
};

/**
 * Remove event (pinned item) and collection associations when an entity is deleted
 * @param {string} entityId -- Entity's id
 */
exports.removeAssociations = async function (entityId) {

	// Remove event entities
	const eventEntityRemovals = await r.table(EVENT_ENTITIES_TABLE)
		.filter({"entityId": entityId})
		.delete()
		.run();

	// Remove from collection items
	const collectionRemovals = await r.table(ENTITY_COLLECTIONS_TABLE)
		.filter((collection) => {
			return collection("entities").contains(entityId);
		})
		.update(function(row) {
			return {
				entities: row("entities")
					.filter(function(item) {
						return item.ne(entityId);
					})
			};
		})
		.run();

	return {
		events: eventEntityRemovals,
		collections: collectionRemovals
	};
};