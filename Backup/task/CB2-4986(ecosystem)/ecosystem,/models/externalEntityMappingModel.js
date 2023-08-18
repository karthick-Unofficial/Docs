"use strict";
const EXTERNAL_ENTITY_MAPPING_TABLE = "sys_externalEntityMapping";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/externalEntityMapping.json"));

module.exports = ExternalEntityMappingModel;

function ExternalEntityMappingModel(options) {
	if (!(this instanceof ExternalEntityMappingModel)) return new ExternalEntityMappingModel(options);
	this.options = options;
}

/**
 * getAll- Return external mapping by sourceId
 * @param sourceId
 */
ExternalEntityMappingModel.prototype.getAll = async () => {
	try {
		const result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE);

		return result;
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * getBySourceId - Return external mapping by sourceId
 * @param sourceId
 */
ExternalEntityMappingModel.prototype.getBySourceId = async (sourceId, type) => {
	try {
		let result = "";
		if (type) {
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("sourceId").eq(sourceId)
						.and(
							r.row("targetType").eq(type)
						)
				)(0)
				.default("");
		} else {
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("sourceId").eq(sourceId)
				)(0)
				.default("");
		}
		return result;
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * getByTargetId - Return external mapping based on the targetId
 * @param targetId
 */
ExternalEntityMappingModel.prototype.getByTargetId = async (targetId, type) => {
	try {
		let result = "";
		if (type) {
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("targetId").eq(targetId)
						.and(
							r.row("targetType").eq(type)
						)
				)(0)
				.default("");
		} else {
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("targetId").eq(targetId)
				)(0)
				.default("");
		}
		return result;
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * upsert - update or create new External Entity mapping
 */
ExternalEntityMappingModel.prototype.upsert = async (sourceId, targetId, update) => {
 
	try {
		let result = {};
		let check = undefined;
		if (sourceId) {
			check = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("sourceId").eq(sourceId)
				)(0)
				.default("")
				.run();
		} else if (targetId) {
			check = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.filter(
					r.row("targetId").eq(targetId)
				)(0)
				.default("")
				.run();
		}
		if (check) {
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.get(check.id)
				.update(update, {
					returnChanges: true
				})
				.run();
		} else {
			const newMapping = {
				targetId: targetId,
				targetType: null,
				sourceId: sourceId,
				additionalProperties: {},
				...update
			};
			result = await r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
				.insert(newMapping, {
					returnChanges: true
				})
				.run();
		}
		let created = result;
		if (result.changes.length > 0) {
			created = result.changes[0].new_val;
		}
		return created;
	} catch (error) {
		console.log(error);
		return error;
	}
};