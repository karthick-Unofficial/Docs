const model = require("../../models/userModel")({});
const authModel = require("../../models/authenticationModel")({});
const AuthenticationProviderFactory = require("../../lib/authentication/authentication-provider-factory");


module.exports = function (app) {

	const restServer = app.rest;

	restServer.get("/externalAuthProviders/method/:orgId", async function (req, res) {
		const orgId = req.routeVars.orgId;
		const userId = req.identity.userId;
		try {
			const result = await authModel.getAuthenticationByOrgId(userId, orgId);
			res.send({ authId: result });
		} catch (err) {
			res.send(err);
		}
	});

	restServer.post("/externalAuthProviders/method", async function (req, res) {
		const { orgId, connectionData, users } = req.body;
		try {
			const result = await authModel.setAuthenticationInfo(orgId, connectionData, users);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.post("/externalAuthProviders/method/update", async function (req, res) {
		const { orgId, connectionData, users, authId } = req.body;
		try {
			const result = await authModel.updateAuthenticationInfo(orgId, connectionData, users, authId);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	/**
	 * Test the connection to the AD or LDAP server and return a list of users for the specified group
	 */
	restServer.post("/externalAuthProviders/connection", async function (req, res) {
		const orgId = req.identity.orgId;
		const userId = req.identity.userId;
		const { host, port, username, password, groupName, baseDN, authType, update } = req.body;

		const config = {
			connection: {
				host,
				port,
				baseDN,
				adminUser: username,
				adminPassword: password,
				groupName
			}
		};

		const factory = new AuthenticationProviderFactory();
		const authProvider = await factory.getAuthenticationProviderByType(authType, config);
		await authProvider.getUsersForGroup(groupName, async function(userErr, users) {
			const disabledUsers = users.filter(user => {
				/**
				 * Bitwise AND to determine disabled userAccountControl value
				 * More info here: https://support.microsoft.com/en-us/help/305144/how-to-use-useraccountcontrol-to-manipulate-user-account-properties
				 * 		 and here: http://www.selfadsi.org/ads-attributes/user-userAccountControl.htm
				 */
				return (parseInt(user["userAccountControl"]) & 2) === 2;
			});
			let enabledUsers = users.filter(user => !disabledUsers.includes(user));

			if (userErr) {					
				console.log("authProvider.getUsersForGroup error:", userErr);
				res.err(userErr);
			}
			else {
				// Group exists and has users
				if (users && users.length > 0) {
					let data = [];
					const addRemove = await authModel.checkUserAddRemove(userId, orgId, users);

					// -- remove users being enabled
					enabledUsers = enabledUsers.filter(enabledUser => !addRemove.enables.find(enable => enable.username === enabledUser.sAMAccountName));

					// For each user returned from AD/LDAP, add an object in the correct format
					for (const user of enabledUsers) {
						const usernameExists = await model.getByUsername(user.sAMAccountName);

						data.push({
							avatar: "user",
							name: user.displayName,
							email: user.mail || user.sAMAccountName,
							id: user.displayName + Math.random(),
							username: user.sAMAccountName,
							errorMessage: (!update && usernameExists) ? "Username is in use & user will not be added" : null,
							icon: addRemove.additions.includes(user.sAMAccountName) ? "add" : null
						});
					}

					// If updating, and users exist in CB that weren't returned from AD/LDAP, show them as removals
					if (update) {
						if (addRemove.removals && addRemove.removals.length) {
							data = data.concat(addRemove.removals);
						}
						if (addRemove.disables && addRemove.disables.length) {
							data = data.concat(addRemove.disables);
						}
						if (addRemove.enables && addRemove.enables.length) {
							data = data.concat(addRemove.enables);
						}
					}
					res.send(data);
				} 
				else {
					// Check to see if group exists
					await authProvider.findGroup(groupName, function(groupErr, group) {
						if (groupErr) {
							console.log("authProvider.findGroup error:", groupErr);
							res.err(groupErr);
						}
						else {
							// Group doesn't exist
							if (!group) {
								res.err("Group does not exist.");
							}
							// Group exists and is empty
							else {
								res.send([]);
							}
						}
					});
				}
			}
		});
	});
};