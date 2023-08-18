const model = require("../../models/userModel")({});
const orgModel = require("../../models/organizationModel")({});
const JWT = require("jsonwebtoken");
const refreshSecret = "refresh-secret";
const AuthenticationProviderFactory = require("../../lib/authentication/authentication-provider-factory");
const session = require("../../lib/session");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");



let factory = null;
let authProviderId = "system";

module.exports = function (app) {

	const restServer = app.rest;

	// -- todo add support for refresh token
	restServer.post("/auth/token", async function (req, res) {

		if (!req.body.refreshToken) {
			const self = this;
			const username = req.body.username;
			const password = req.body.password;
			try {
				const dbUser = await model.getByUsername(username);
				let user = dbUser;

				if (user.authProviderId !== null) {
					authProviderId = user.authProviderId;
				}

				factory = new AuthenticationProviderFactory();
				const authProvider = await factory.getAuthenticationProvider(authProviderId);

				authProvider.authenticate(username, password, async function (err, authenticated) {
					if (err) {
						app.logger.audit(
							user.id,
							"user",
							user.id,
							"login",
							`login failed - reason: ${err.err.message}`,
							false,
							err
						);
						app.logger.info({
							app: "eocsystem",
							method: "login",
							success: false,
							user: user.id,
							remoteAddress: req.remoteAddress,
							err: err
						});
						if (err.err.message === "Password expired") {
							model.requestReset(user.email, function (err, result) {
								if (err) {
									app.logger.info({
										app: "eocsystem",
										method: "passwordExp.requestReset",
										success: false,
										user: user.id,
										remoteAddress: req.remoteAddress,
										err: err
									});
								}
							});
							res.err("Your password has expired. An email has been sent containing a link to create a new password.", err.err);
						}
						else {
							res.err("Invalid login info", err.err);
						}
					}
					if (authenticated) {
						// -- handle support admin impersonation functionality
						if (user.impersonate && user.impersonate !== "") {
							try {
								user = await model.getById(user.impersonate);

								app.logger.audit(
									dbUser.id,
									"user",
									dbUser.impersonate,
									"impersonate-login",
									"User attempting to impersonate another user",
									true
								);
							} catch (ex) {
								app.logger.audit(
									dbUser.id,
									"user",
									dbUser.impersonate,
									"impersonate-login",
									"User attempting to impersonate another user",
									false
								);
								app.logger.error({
									app: "ecosystem",
									method: "impersonate-login",
									success: false,
									user: username,
									impersonateId: dbUser.impersonate,
									remoteAddress: req.remoteAddress,
									err: err
								});

								res.err("Login Error: 0x473856. Contact Support.", null);
							}
						}

						if (user.disabled) {
							res.err("Account disabled", { message: "Account disabled", code: 405 });
						}
						try {
							const org = await orgModel.getById(user.orgId);
							if (!org || org.disabled) {
								res.err("Organization disabled", { message: "Organization disabled", code: 405 });
							}
						}
						catch (e) {
							res.err("Server Error", { message: "Server Error", code: 500 });
						}

						// -- create session
						const result = await session.create(
							user,
							req.remoteAddress,
							req.headers["user-agent"]);

						if (!result.success) {
							app.logger.audit(
								user.id,
								"user",
								user.id,
								"login",
								"User attempted to login from another device when already logged in on one device",
								false
							);
							res.err(result.reason, result);
						}
						else {
							app.logger.audit(
								user.id,
								"user",
								user.id,
								"login",
								"Login successful",
								true,
								null
							);
							res.send(result.tokens);
						}
					}
					// -- there really should be no else here err and authenticated have it covered
					else {
						app.logger.info({
							app: "eocsystem",
							method: "login",
							success: false,
							user: username,
							remoteAddress: req.remoteAddress
						});
						// let error = "Unknown error";
						// if (err) {
						// 	error = err;
						// }
						res.err(err.message, err);
					}
				});
			} catch (err) {
				app.logger.audit(
					username,
					"user",
					username,
					"login",
					`login failure reason: ${err.message}`,
					false,
					err
				);
				app.logger.info({
					app: "eocsystem",
					method: "login",
					success: false,
					user: username,
					remoteAddress: req.remoteAddress,
					err: err
				});
				res.err("Invalid login info", null);
			}
		} else {
			let result;
			try {
				result = JWT.verify(req.body.refreshToken, refreshSecret);
			}
			catch (err) {
				app.logger.audit(
					"anonymous",
					"refresh-token",
					req.body.refreshToken,
					"login",
					"refresh token invalid",
					false,
					err
				);
				res.send({ err: { message: "refresh token invalid", code: 401 } });
			}

			if (Date.now() > result.exp) {
				app.logger.audit(
					"anonymous",
					"refresh-token",
					req.body.refreshToken,
					"login",
					"refresh token expired",
					false,
					null
				);
				res.send({ err: { message: "refresh token expired", code: 401 } });
			}
			else {
				const user = {
					userId: result.userId,
					email: result.email,
					role: result.role,
					orgId: result.orgId
				};

				// -- create session
				const result = await session.create(
					user,
					req.remoteAddress,
					req.headers["user-agent"]);

				app.logger.audit(
					result.userId,
					"user",
					result.userId,
					"login",
					"successfully logged in with refresh token",
					true,
					null
				);

				res.send(result.tokens);
			}
		}
	});

	// -- invalidate token
	restServer.delete("/logout", async function (req, res) {
		try {
			const result = await session.dropUserSession(req.identity.userId, req.identity.sid);
			res.send(result);
		}
		catch (ex) {
			res.err({ err: { message: ex.message, code: 500 } });
		}

	});


	restServer.get("/auth/:email/forgot", async function (req, res) {
		try {
			const email = req.routeVars.email;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { passwordReset } = translations.ecosystem.email;
			const result = await model.requestReset(email, passwordReset);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});


	restServer.get("/auth/reset/:token", async function (req, res) {
		try {
			const resetToken = req.routeVars.token;
			const result = await model.verifyReset(resetToken);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.get("/auth/initial/:token", async function (req, res) {
		try {
			const resetToken = req.routeVars.token;
			const result = await model.verifyInitialSetPassword(resetToken);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.put("/auth/initial/:token", async function (req, res) {
		try {
			const token = req.routeVars.token;
			const newPassword = req.body.password;
			const result = await model.verifyInitialSetPassword(token);
			try {
				const setPWResult = await model.setPassword(result.userId, newPassword);
				res.send(setPWResult);
			}
			catch (ex) {
				res.err(ex.message, ex);
			}

		} catch (err) {
			res.send(err);
		}
	});

	restServer.put("/auth/reset/:token", async function (req, res) {
		try {
			const resetToken = req.routeVars.token;
			const newPassword = req.body.password;
			const result = await model.verifyReset(resetToken);
			try {
				const setPWResult = await model.setPassword(result.userId, newPassword);
				res.send(setPWResult);
			}
			catch (ex) {
				res.err(ex.message, ex);
			}
		} catch (err) {
			res.send(err);
		}
	});
};