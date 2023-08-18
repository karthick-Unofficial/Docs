"use strict";
const MAP_STYLES_TABLE = "sys_mapStyles";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/mapStylesModel.js");

module.exports = MapStylesModel;

function MapStylesModel(options) {
	if (!(this instanceof MapStylesModel)) return new MapStylesModel(options);
	this.options = options;
}

MapStylesModel.prototype.getAll = async function (orgId) {
	try {
		logger.info("getAll", "orgid in map styles", orgId);
		const result = await r.table(MAP_STYLES_TABLE)
			.filter(
				r.and(
					r.row("enabled").default(true).eq(true),
					r.row("orgFilter").default([orgId]).contains(orgId)
				))
			.run();
		return result;
	} catch (e) {
		logger.error("getlAll mapStyles", "There was an error while getting all mapStyles", {
			err: { message: e.message, stack: e.stack }
		});
	}
};