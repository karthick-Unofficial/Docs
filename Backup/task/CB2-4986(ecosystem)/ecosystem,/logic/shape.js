const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/attachment.js");
const shapeModel = require("../models/shapeModel")({});
const feedModel = require("../models/feedModel")({});
const _ = require("lodash");

class Shape {
	constructor() {
		this._ecoLinkManager = null;
	} 
	
	ecoLinkManager() {
		if(!this._ecoLinkManager) {
			const global = require("../app-global.js");
			this._ecoLinkManager = global.ecoLinkManager;
		}
		return this._ecoLinkManager;
	}
    
	async getAllShapesForUser(req) {
		try {
			let result = await feedModel.getEntitiesByTypeWithAuthorization(req.identity.userId, "shapes", true, null, true);
			if(!req.query.remote && this.ecoLinkManager().isActive()) {
				req.query["remote"] = true;
				const remoteResult = await this.ecoLinkManager().execReqAll(
					req.method,
					req.route,
					req,
					"ecosystem",
					true
				);
				result = [...result, ...remoteResult];
			}
			return result;
		}
		catch(err) {
			throw { message: err.message, code: 500 };
		}
	}

	async getAllShapes() {
		try {
			const result = await shapeModel.getAllInternal();
			return result;
		}
		catch(err) {
			throw err;
		}

	}

	async getSingleSegmentLines(req) {
		try {
			let result = await shapeModel.getSingleSegmentLines(req.identity.userId);
			if(!req.query.remote && this.ecoLinkManager().isActive()) {
				req.query["remote"] = true;
				const remoteResult = await this.ecoLinkManager().execReqAll(
					req.method,
					req.route,
					req,
					"ecosystem",
					true
				);
				result = [...result, ...remoteResult];
			}
			return result;
		}
		catch(err) {
			throw { message: err.message, code: 500 };
		}
	}

	async getShapesByGeoType(req) {
		try {
			// Ensure proper casing of type
			const type = req.routeVars.type.charAt(0).toUpperCase() + req.routeVars.type.substr(1);
			const isValid = ["Polygon", "LineString", "Point"].indexOf(type) > -1;

			if(!isValid) {
				throw new Error("Invalid geometry type " + type);
			}

			const query = req.query ? req.query : undefined;
			let result = await shapeModel.getByGeometryType(req.identity.userId, type, query);
			if(!req.query.remote && this.ecoLinkManager().isActive()) {
				req.query["remote"] = true;
				const remoteResult = await this.ecoLinkManager().execReqAll(
					req.method,
					req.route,
					req,
					"ecosystem",
					true
				);
				result = [...result, ...remoteResult];
			}
			if (query) {
				// -- clean up remote property so we're not searching entity data for it and getting false for everything
				delete query["remote"];
				if (!_.isEmpty(query)) {
					result = result.filter(shape => {
						if (Object.keys(query).every(key => shape.entityData.properties[key] ? true : false)) {
							return Object.keys(query).every(key => shape.entityData.properties[key].toString().toLowerCase().includes(query[key].toString().toLowerCase()) ? true : false);
						}
						return false;
					});
				}
			}
			return result;
		}
		catch(err) {
			throw { message: err.message, code: 500 };
		}
	}

}

module.exports = Shape;
