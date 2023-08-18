const ENTITY_TYPE_TABLE = "sys_entityType";

const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/entityTypeCache.js");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const entityTypeCache = {};

async function getEntityTypes() {
	try {
		const types = await r.table(ENTITY_TYPE_TABLE).run();
		types.forEach((type) => {
			entityTypeCache[type.name] = type;
		});
		logger.info("getEntityTypes", "EntityType cache established.", { entityTypeCache: entityTypeCache });
	}
	catch(err) {
		logger.error("getEntityTypes", "Unexpected exception attempting to establish EntityType cache", { err: { message: err.message, stack: err.stack } }, provider.isReqlError(err) ? SYSTEM_CODES.RETHINKDB : SYSTEM_CODES.UNSPECIFIED);
	}
}

getEntityTypes();

module.exports = entityTypeCache;