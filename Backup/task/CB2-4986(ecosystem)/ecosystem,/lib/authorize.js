const { promisify } = require("util");
const userModel = require("../models/userModel")({});
const getById = promisify(userModel.getById);
const _global = require("../app-global.js");

class Authorize {
	async canAdminUser(req, res) {
		const targetUserId = req.routeVars.userId || req.query.userId;
		let isAuthorized = req.identity.userId === targetUserId;
		if(!isAuthorized) {
			try {
				const reqUser = await getById(req.identity.userId);
				const targetUser = await getById(targetUserId);
				if(reqUser && targetUser) {
					isAuthorized = reqUser.admin && (reqUser.orgId === targetUser.orgId);
				}
			}
			catch(ex) {
				_global.logger.error({
					app: "ecosystem",
					class: "Authorize",
					method: "canAdminUser",
					remoteAddress: req.remoteAddress,
					err: JSON.stringify(ex, null, 4),
					addlInfo: {
						"reqUserId": req.identity.userId,
						"targetUserId": req.routeVars.userId 
					}
				});
				isAuthorized = false;			
			} 
		}
		if(!isAuthorized) {
			_global.logger.audit(
				req.identity.userId, 
				"user", 
				targetUserId,
				"failed authorization", 
				"User attempted to access an unauthorized resource", 
				false,
				{ 
					"identity": req.identity, 
					"route": req.route, 
					"method": req.method 
				}
			);
			res.err({ err: { message: "Unauthorized", code: 401 } });
		}
		return isAuthorized;
	}

	async canAudit(req, res) {
		if(req.identity && req.identity.role === "eco-admin") {
			return true;
		}
		else {
			res.err({ err: { message: "Unauthorized", code: 401 } });
		}
	}

	async isAdminUser(req, res) {
		let isAuthorized = false;
		try {
			const reqUser = await getById(req.identity.userId);
			if(reqUser) {
				isAuthorized = reqUser.admin;
			}
		}
		catch(ex) {
			_global.logger.error({
				app: "ecosystem",
				class: "Authorize",
				method: "isAdminUser",
				remoteAddress: req.remoteAddress,
				err: JSON.stringify(ex, null, 4),
				addlInfo: {
					"reqUserId": req.identity.userId
				}
			});
			isAuthorized = false;
		}

		if(!isAuthorized) {
			_global.logger.audit(
				req.identity.userId,
				"user",
				null,
				"failed authorization",
				"User attempted to access an unauthorized resource",
				false,
				{
					"identity": req.identity,
					"route": req.route,
					"method": req.method
				}
			);
			res.err({ err: { message: "Unauthorized", code: 401 } });
		}
		return isAuthorized;
	}
}

module.exports = new Authorize();