const model = require("../../models/userModel")({});
const userAppStateModel = require("../../models/userAppStateModel")({});
const encryptionProvider = require("../../lib/encryptionProvider")({});
const sessionHelper = require("../../lib/session");
const { canAdminUser, isAdminUser } = require("../../lib/authorize");
const crypto = require("crypto");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");


module.exports = function (app) {

	const restServer = app.rest;

	// -- todo limit access to admin
	// -- todo implement authorization as "middleware" in node-app-core - pass auth functions that know how to authorize
	// -- this could be done by examining roles in token
	restServer.get("/users/:userId/sessions", async function (req, res) {
		// -- need to validate requester is orgadmin for org of userId
		// -- currently authorizeAdminUser will return false if user not authorized and will handle sending 401 response
		// -- future hope to support similar to Express in middleware, concept is similar, implementation is different
		// -- Is self or isAdminUser in same org as target user
		if (await canAdminUser(req, res)) {
			let sessions = [];
			try {
				sessions = await sessionHelper.getUserActiveSessions(req.routeVars.userId);
			}
			catch (ex) {
				res.err({ err: { message: "Error getting user sessions", code: 500 } });
			}
			res.send(sessions);
		}
	});

	restServer.delete("/users/:userId/sessions", async function (req, res) {
		// -- need to validate requester is orgadmin for org of userId
		if (await canAdminUser(req, res)) {
			try {
				const result = await sessionHelper.dropUserAllSessions(req.routeVars.userId);
				res.send(result);
			}
			catch (ex) {
				res.err({ err: { message: ex.message, code: 500 } });
			}
		}
	});

	restServer.delete("/users/:userId/sessions/:sid", async function (req, res) {
		// -- need to validate requester is orgadmin for org of userId
		if (await canAdminUser(req, res)) {
			try {
				const result = await sessionHelper.dropUserSession(req.routeVars.userId, req.routeVars.sid);
				res.send(result);
			}
			catch (ex) {
				res.err({ err: { message: ex.message, code: 500 } });
			}
		}
	});

	restServer.get("/users/sessions", async function (req, res) {
		if (await isAdminUser(req, res)) {
			let sessions = [];
			try {
				sessions = await sessionHelper.getAllActiveSessions();
			}
			catch (ex) {
				res.err({ err: { message: "Error getting user sessions", code: 500 } });
			}
			res.send(sessions);
		}
	});

	restServer.get("/users/sessionsByUser", async function (req, res) {
		if (await isAdminUser(req, res)) {
			let userSessions = [];
			try {
				userSessions = await sessionHelper.getAllActiveSessionsByUser();
			}
			catch (ex) {
				res.err({ err: { message: "Error getting sessions by user", code: 500 } });
			}
			res.send(userSessions);
		}
	});

	restServer.get("/users/activeUsers", async function (req, res) {
		if (await isAdminUser(req, res)) {
			let activeUserIds = [];
			try {
				activeUserIds = await sessionHelper.getAllActiveUsers();
			}
			catch (ex) {
				res.err({ err: { message: "Error getting active users", code: 500 } });
			}
			res.send(activeUserIds);
		}
	});


	restServer.get("/users/myProfile", async function (req, res) {
		try {
			const result = await model.getProfile(req.identity.userId);
			res.send(result);
		}
		catch (reason) {
			res.send(reason);
		}
	});

	restServer.get("/users/process/checkExpiringPasswords", async function (req, res) {
		if (await isAdminUser(req, res)) {
			try {
				const locale = config.environment.locale;
				const translations = await geti18n(app.appRequest, locale);
				const { passwordExpiringSoon } = translations.ecosystem.email;
				const days = req.query && req.query.days ? Number.parseInt(req.query.days) : 7;
				const expiringUsers = await model.checkExpiringPasswords(days, passwordExpiringSoon);
				res.send({ success: true, expiringUsers });
			}
			catch (ex) {
				res.err({ err: { message: "Error checking expiring passwords", code: 500 } });
			}
		}
		else {
			res.err({ err: { message: "Insufficient permissions", code: 401 } });
		}
	});

	restServer.get("/users/:userId/profile", async function (req, res) {
		try {
			const result = await model.getProfile(req.routeVars.userId);
			res.send(result);
		}
		catch (reason) {
			res.send(reason);
		}
	});

	restServer.get("/users/:userId/profile_light", async function (req, res) {
		try {
			const result = await model.getLightProfile(req.routeVars.userId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/users/:userId", async function (req, res) {
		try {
			const { userId } = req.routeVars;
			const result = await model.getByUserId(userId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});


	restServer.get("/users", async function (req, res) {
		const query = req.query ? req.query : {};
		const { orgId } = req.identity;
		try {
			const result = await model.getAll(orgId, query.fromOrg || false);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.post("/users", async function (req, res) {
		// -- todo: don't allow assigned apps or integrations property to go here
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { setEmail } = translations.ecosystem.email;
		const user = req.body.user;
		const token = crypto.randomBytes(20).toString("hex");
		try {
			const result = await model.create(user, token);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.put("/users/:userId", async function (req, res) {
		// -- todo: don't allow assigned apps or integrations property to go here
		try {
			const user = req.body.user;
			const result = await model.update(req.routeVars.userId, user);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.delete("/users/:userId", async function (req, res) {
		if (req.routeVars.userId === req.identity.userId) {
			res.send({ err: { message: "can't delete own user", code: 500 } });
		}
		else {
			try {
				const result = await model.delete(req.routeVars.userId);
				res.send(result);
			}
			catch (err) {
				res.send(err);
			}
		}
	});

	restServer.put("/users/:userId/set-password", async function (req, res) {
		// -- todo: don't allow assigned apps or integrations property to go here
		const currentPassword = req.body.currentPassword;
		const newPassword = req.body.newPassword;
		if (currentPassword != "P@ssw0rd") {
			res.send({ "error": "Invalid current password" });
		}
		else {
			try {
				const result = await model.setPassword(req.routeVars.userId, newPassword);
				res.send(result);
			}
			catch (ex) {
				res.err(ex.message, ex);
			}
		}
	});

	restServer.put("/users/:userId/change-password", async function (req, res) {
		const currentPassword = req.body.currentPassword;
		const newPassword = req.body.newPassword;
		const userId = req.routeVars.userId;
		try {
			const user = await model.getById(userId);
			const result = encryptionProvider.compareSync(currentPassword, user.password);
			if (result) {
				try {
					const result = await model.setPassword(req.routeVars.userId, newPassword);
					res.send(result);
				}
				catch (ex) {
					res.err(ex.message, ex);
				}
			}
			else {
				res.err("The old password is incorrect", result);
			}
		} catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.put("/users/:userId/admin-change-password", async function (req, res) {
		const newPassword = req.body.newPassword;
		const userId = req.routeVars.userId;
		const currentUserId = req.identity.userId;

		if (currentUserId === userId) {
			return res.err("User IDs match and old password not provided.",
				{ "message": "User IDs match and old password not provided." });
		}

		try {
			const currentUser = await model.getById(currentUserId);
			try {
				try {
					const user = await model.getById(userId);
					try {
						if (currentUser.admin && !user.admin && currentUser.orgId === user.orgId) {
							const result = await model.setPassword(userId, newPassword);
							res.send(result);
						}
						else {
							return res.err("Current user does not have permissions to change password.",
								{ "message": "Current user does not have permissions to change password." });
						}
					}
					catch (ex) {
						res.err(ex.message, ex);
					}
				} catch (err) {
					res.err(err.message, err);
				}
			}
			catch (ex) {
				res.err(ex.message, ex);
			}
		} catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.post("/users/:userId/applications/:appId", async function (req, res) {
		try {
			const result = await model.upsertApplication(
				req.routeVars.userId,
				req.routeVars.appId,
				req.body.config);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.put("/users/:userId/applications/:appId", async function (req, res) {
		try {
			const result = await model.upsertApplication(
				req.routeVars.userId,
				req.routeVars.appId,
				req.body.config);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.delete("/users/:userId/applications/:appId", async function (req, res) {
		try {
			const result = await model.removeApplication(
				req.routeVars.userId,
				req.routeVars.appId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});


	restServer.post("/users/:userId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.upsertIntegration(
				req.routeVars.userId,
				req.routeVars.intId,
				req.body.config);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.put("/users/:userId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.upsertIntegration(
				req.routeVars.userId,
				req.routeVars.intId,
				req.body.config,
				req.body.orgIntId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.delete("/users/:userId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.removeIntegration(
				req.routeVars.userId,
				req.routeVars.intId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/users/user/integrations", async function (req, res) {
		try {
			const result = await model.getIntegrations(req.identity.userId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/users/user/integrations/:appId", async function (req, res) {
		try {
			const result = await model.getAppIntegrations(req.identity.userId, req.routeVars.appId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	// -- Until dock state is an official thing going to keep this to a simple state object
	// -- For dock state that either means and array that will need to be completely replaced on each dock state
	// -- change or an object which would allow for partial.
	// -- get a particular state key for user/app
	restServer.get("/users/:userId/applications/:appId/state", async function (req, res) {
		const userId = req.routeVars.userId;
		const appId = req.routeVars.appId;
		try {
			const result = await userAppStateModel.getAppState(userId, appId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	// -- set a state key for user/app
	restServer.put("/users/:userId/applications/:appId/state", async function (req, res) {
		try {
			const userId = req.routeVars.userId;
			const appId = req.routeVars.appId;
			const state = req.body;
			const result = await userAppStateModel.setAppState(userId, appId, state);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.post("/users/:userId/image", async function (req, res) {
		const self = this;
		const userId = req.routeVars.userId;
		const fileHandle = req.body.fileHandle;
		try {
			const result = await model.setProfileImage(userId, fileHandle);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/users/:userId/appSettings", async function (req, res) {
		const userId = req.routeVars.userId;
		try {
			const result = await model.getAppSettings(userId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/users/:userId/appSettings", async function (req, res) {
		const userId = req.routeVars.userId;
		const update = req.body.update;

		try {
			const result = await model.updateAppSettings(userId, update);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.put("/users/:userId/role", async function (req, res) {
		const self = this;
		const userId = req.routeVars.userId;
		const role = req.body.role;
		try {
			const result = await model.updateRole(userId, role);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/users/:appId/access", async function (req, res) {
		const userId = req.identity.userId;
		const appId = req.routeVars.appId;
		try {
			const result = await model.hasAccessToApp(userId, appId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});
};