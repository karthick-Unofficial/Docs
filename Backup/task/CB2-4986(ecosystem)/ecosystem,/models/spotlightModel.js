"use strict";
const SPOTLIGHT_TABLE = "sys_spotlight";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/spotlightModel.js");

module.exports = SpotlightModel;


function SpotlightModel() {
	if (!(this instanceof SpotlightModel)) return new SpotlightModel();
}

/**
 * Create a spotlight instance
 * @param {string} userId 
 * @param {object} spotlight {geo: {geoJson}, color: "string"}
 */
SpotlightModel.prototype.create = async function(userId, spotlight) {
	try {

		if(spotlight.id) delete spotlight.id;
		const data = {
			...spotlight,
			owner:userId,
			createdDate: new Date(),
			lastUpdated: new Date(),
			isDeleted: false
		};

		const result = await r.table(SPOTLIGHT_TABLE)
			.insert(data, {returnChanges: true})
			.run();

		if (result.inserted) {
			return { success: true, spotlight: result.changes[0].new_val };
		}
		else {
			throw { message: "An error occurred while creating spotlight data", code: "500" };
		}
	} 
	catch (ex) {
		logger.error(
			"create", 
			"Error creating spotlight data", 
			{ err: { message: ex.message, code: ex.code, stack: "/models/spotlightModel.js"}}
		);
		throw ex;
	}
};

/**
 * Update a spotlight instance
 * @param {string} userId 
 * @param {string} spotlightId 
 * @param {object} spotlight {geo: {geoJson}}
 */
SpotlightModel.prototype.update = async function(userId, spotlightId, spotlight) {
	try {
		const existingSpotlight = await r.table(SPOTLIGHT_TABLE)
			.filter({id: spotlightId, owner: userId})(0)
			.default(null)
			.run();
        
		if (!existingSpotlight) {
			throw { message: "User does not have access to spotlight data or spotlight data does not exist", code: "401" };
		}
        
		const update = {
			...existingSpotlight,
			...spotlight,
			lastUpdated: new Date()
		};
        
		const result = await r.table(SPOTLIGHT_TABLE)
			.get(spotlightId)
			.update(update)
			.run();

		if (result.replaced) {
			return { success: true };
		}
		else {
			throw {message: "An error occurred while updating spotlight data", code: "500"};
		}
	} 
	catch (ex) {
		logger.error(
			"update", 
			"Error updating spotlight data", 
			{ err: { message: ex.message, code: ex.code, stack: "/models/spotlightModel.js"}}
		);
		throw ex;
	}
};

/**
 * Delete a spotlight instance (once it is completed)
 * @param {string} userId 
 * @param {string} spotlightId 
 */
SpotlightModel.prototype.delete = async function(userId, spotlightId) {
	try {
		const existingSpotlight = await r.table(SPOTLIGHT_TABLE)
			.filter({id: spotlightId, owner: userId})(0)
			.default(null)
			.run();
        
		if (!existingSpotlight) {
			throw { message: "User does not have access to spotlight data or spotlight data does not exist", code: "401" };
		}
        
		const update = {
			lastUpdated: new Date(),
			isDeleted: true
		};
        
		const result = await r.table(SPOTLIGHT_TABLE)
			.get(spotlightId)
			.update(update)
			.run();

		if (result.replaced) {
			return { success: true };
		}
		else {
			throw {message: "An error occurred while deleting spotlight data", code: "500"};
		}
	} 
	catch (ex) {
		logger.error(
			"delete", 
			"Error deleting spotlight data", 
			{ err: { message: ex.message, code: ex.code, stack: "/models/spotlightModel.js"}}
		);
		throw ex;
	}
};

/**
 * Get all active spotlights for a user
 * @param {string} userId 
 */
SpotlightModel.prototype.getAllActive = async function(userId) {
	try {
		const spotlights = await r.table(SPOTLIGHT_TABLE)
			.filter({
				owner: userId,
				isDeleted: false
			})
			.without("createdDate", "lastUpdated")
			.run();

		return { spotlights };
	} 
	catch (ex) {
		logger.error(
			"getAllActive", 
			"Error getting all active spotlights", 
			{ err: { message: ex.message, code: ex.code, stack: "/models/spotlightModel.js"}}
		);
		throw ex;
	}
};
