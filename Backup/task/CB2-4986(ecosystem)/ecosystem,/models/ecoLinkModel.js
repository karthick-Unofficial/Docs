"use strict";
const ECO_LINK_TABLE = "sys_ecoLink";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db

module.exports = EcoLinkModel;

function EcoLinkModel(options) {
	if (!(this instanceof EcoLinkModel)) return new EcoLinkModel(options);
	this.options = options;
}

/**
 *  getAllActive:
 */
EcoLinkModel.prototype.getAllActive = async function() {
	try {

		const result = await r.table(ECO_LINK_TABLE)
			.filter({ "enabled": true })
			.run();

		return result;

	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 *  getLinkedFeeds:
 */
EcoLinkModel.prototype.getAllActive = async function() {
	try {

		const result = await r.table(ECO_LINK_TABLE)
			.filter({ "enabled": true })
			.run();

		return result;

	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};
