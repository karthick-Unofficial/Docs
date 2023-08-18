"use strict";
const AUTH_PROVIDERS_TABLE = "sys_authProviders";
const USER_TABLE = "sys_user";
const ORGANIZATION_TABLE = "sys_organization";

// Packages
const CryptoJS = require("crypto-js");

// Imports
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userModel = require("./userModel")();
const secrets = require("../secrets/secrets");

// If you need to use AD/LDAP locally, uncomment the below variable and comment the secret() one
// const secretKey = "This is a secret key that should only be used for development!";
const secretKey = secrets.get("AES_ENCRYPTION_SECRET_KEY") ? secrets.get("AES_ENCRYPTION_SECRET_KEY") : "local-secret-key";

module.exports = AuthenticationModel;

function AuthenticationModel(options) {
	if (!(this instanceof AuthenticationModel)) return new AuthenticationModel(options);
	const self = this;
	self.options = options;
}


AuthenticationModel.prototype.getAuthenticationProviders = async () => {
	try {
		const result = await r.table(AUTH_PROVIDERS_TABLE)
			.filter(
				r.row.hasFields("isDeleted").not()
					.or(r.row("isDeleted").eq(false))
			).run();
		return result;
	}
	catch (ex) {
		throw { message: "Unhandled exception in AuthenticationModel.getAuthenticationProviders: " + ex.message, code: 500 };
	}
};

AuthenticationModel.prototype.getAuthenticationProviderById = async (authProviderId) => {
	try {
		const result = await r.table(AUTH_PROVIDERS_TABLE)
			.filter({ "id": authProviderId })
			.filter({ "deleted": false }, { default: true })
			.run();

		if (result && result.isDeleted) {
			return null;
		}
		else {
			return result[0];
		}
	}
	catch (ex) {
		throw { message: "Unhandled exception in AuthenticationModel.getAuthenticationProviderById: " + ex.message, code: 500 };
	}

};

/**
 * Retreive an authProvider object
 * @param {string} userId
 * @param {string} orgId 
 */
AuthenticationModel.prototype.getAuthenticationByOrgId = async (userId, orgId) => {
	try {
		const user = await userModel.getByUserId(userId);

		if (user.hasOwnProperty("admin") && user.admin) {
			const query = await r.table(AUTH_PROVIDERS_TABLE)
				.filter({ orgId: orgId })
				.run();

			const result = query[0];

			if (result) {
				if (!secretKey) {
					throw "No secret key for password decryption found!";
				}
				else {
					// Decrypt password
					const bytes = CryptoJS.AES.decrypt(result.connection.password, secretKey);
					const unencryptedPw = bytes.toString(CryptoJS.enc.Utf8);
					result.connection.password = unencryptedPw;

					return result;
				}
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	catch (err) {
		throw err;
	}
};

/**
 * Add connection info to sys_authProviders with encrypted password & create sys_user entries for all group members
 * @param {string} orgId -- Organization's ID
 * @param {object} connectionData -- host, port, username, password, groupName, baseDN, and authType
 * @param {array} users -- array of user objects, each one containing at least a username and password
 */
AuthenticationModel.prototype.setAuthenticationInfo = async (orgId, connectionData, users) => {
	try {
		const { host, port, authType, username, password, groupName, baseDN, sync } = connectionData;

		const encryptedPW = CryptoJS.AES.encrypt(password, secretKey).toString();

		// Set auth provider entry for org
		const authResult = await r.table(AUTH_PROVIDERS_TABLE)
			.insert({
				orgId: orgId,
				providerId: authType,
				connection: {
					host,
					port,
					authType,
					username,
					password: encryptedPW,
					groupName,
					baseDN,
					sync
				}
			})
			.run();

		// If auth provider is set correctly, set ID on org and create users
		if (authResult.inserted) {

			// ID of auth provider entry
			const authProviderId = authResult.generated_keys[0];
			let error = null;

			// Add ID to org
			const orgResult = await r.table(ORGANIZATION_TABLE)
				.filter({ orgId: orgId })
				.update({
					authProviderId: authProviderId
				})
				.run();


			// Transform users to CB2 data structure, attach authProviderId
			const transformedUsers = users.map(user => {
				return {
					authProviderId: authProviderId,
					admin: false,
					ecoAdmin: false,
					contact: {
						address: null,
						cellPhone: null,
						city: null,
						officePhone: null,
						state: null,
						zip: null
					},
					createdDate: new Date(),
					lastModifiedDate: new Date(),
					email: user.email,
					name: user.name,
					orgId: orgId,
					role: "system-user",
					roleId: null,
					setPasswordToken: null,
					username: user.username
				};
			});

			for (const user of transformedUsers) {
				// Check username availability 
				const usernameExists = await userModel.getByUsername(user.username);

				if (usernameExists) {
					console.log(`A user with the username ${user.username} already exists.`);
					error = true;
				}
				// If username is available, create user
				else if (!usernameExists) {
					try {
						const res = await userModel.create(user, null);
						console.log("User was created from external system: ", res);
						error = false;
					} catch (err) {
						console.log("Error creating user from external system: ", err);
						error = true;
					}
				}
			}

			if (!error) {
				return orgResult;
			}
			else {
				return { err: { message: "An error occured. Some users may not be imported.", code: 500 } };
			}
		}
		else {
			return { err: { message: "Error creating authentication settings.", code: 500 } };
		}
	}
	catch (err) {
		throw err;
	}
};

/**
 * Update connection info to sys_authProviders, update sys_user entries for all existing group members, and create users who do not yet exist
 * @param {string} orgId -- Organization's ID
 * @param {object} connectionData -- host, port, username, password, groupName, baseDN, and authType
 * @param {array} users -- array of user objects, each one containing at least a username and password
 * @param {string} authId -- ID of authProvider for org
 */
AuthenticationModel.prototype.updateAuthenticationInfo = async (orgId, connectionData, users, authId) => {
	try {
		const { host, port, authType, username, password, groupName, baseDN, sync } = connectionData;
		const encryptedPW = CryptoJS.AES.encrypt(password, secretKey).toString();

		const authUpsertResult = await r.table(AUTH_PROVIDERS_TABLE)
			.get(authId)
			.update({
				providerId: authType,
				connection: {
					host,
					port,
					authType,
					username,
					password: encryptedPW,
					groupName,
					baseDN,
					sync
				}
			})
			.run();

		// Update successful
		if (authUpsertResult.replaced) {
			// Transform users to CB2 data structure for fields that need to be updated
			const updates = [];
			const creates = [];
			const removals = [];
			const disables = [];
			const enables = [];

			//TODO: MAKE SURE USERS ARE NOT CREATED AS DUPLICATES AND DELETED ONES CAN BE UNDELETED
			for (const user of users) {

				const userExists = await userModel.userExists(user.username);

				// User exists & not being removed, add to update array
				if (userExists && user.icon === "add") {
					updates.push({
						lastModifiedDate: new Date(),
						email: user.email,
						name: user.name,
						username: user.username,
						id: userExists.id,
						disabled: false,
						deleted: false
					});
				}
				// User exists but is being removed
				else if (userExists && user.icon === "remove") {
					removals.push(userExists.id);
				}
				// User is being disabled
				else if (userExists && user.icon === "disable") {
					disables.push({
						lastModifiedDate: new Date(),
						email: user.email,
						name: user.name,
						username: user.username,
						id: userExists.id,
						disabled: true,
						deleted: false
					});
				}
				// User is being enabled
				else if (userExists && user.icon === "enable") {
					enables.push({
						lastModifiedDate: new Date(),
						email: user.email,
						name: user.name,
						username: user.username,
						id: userExists.id,
						disabled: false,
						deleted: false
					});
				}
				// User does not exist, add to creation array
				else if (!userExists) {
					creates.push({
						authProviderId: authId,
						admin: false,
						ecoAdmin: false,
						contact: {
							address: null,
							cellPhone: null,
							city: null,
							officePhone: null,
							state: null,
							zip: null
						},
						createdDate: new Date(),
						lastModifiedDate: new Date(),
						email: user.email,
						name: user.name,
						orgId: orgId,
						role: "system-user",
						roleId: null,
						setPasswordToken: null,
						username: user.username,
						disabled: false,
						deleted: false
					});
				}
			}

			let error = false;

			// Create new users
			for (const newUser of creates) {
				try {
					const res = await userModel.create(newUser, null);
					console.log("User was created from external system: ", res);
				} catch (err) {
					console.log("Error creating user from external system: ", err);
					error = true;
				}
			}

			// Update existing users
			for (const updateUser of updates.concat(disables).concat(enables)) {
				try {
					const res = await userModel.update(updateUser.id, updateUser);
					console.log("User was updated from external system: ", res);
				} catch (err) {
					console.log("Error updating user from external system: ", err);
					error = true;
				}
			}

			// Remove users who were removed from external system
			for (const removeUser of removals) {
				try {
					const res = await userModel.delete(removeUser);
					console.log("External user was removed from CB system: ", res);
				} catch (err) {
					console.log("Error removing external user from CB system: ", err);
					error = true;
				}
			}

			if (!error) {
				return authUpsertResult;
			}
			else {
				return { err: { message: "An error occured. Some users may not be created, updated, or removed.", code: 500 } };
			}
		}
		else {
			return { err: { message: "Error updating authentication settings.", code: 500 } };
		}
	}
	catch (err) {
		throw err;
	}
};

/**
 * Check to see if users are being newly added, or removed, from the CB system
 * @param {string} orgId -- org's id
 * @param {array} usersResult -- array result of users retreived from AD or LDAP system
 */
AuthenticationModel.prototype.checkUserAddRemove = async function (userId, orgId, usersResult) {
	try {
		const removals = [];
		const disables = [];
		const enables = [];
		const additions = [];
		const authInfo = await this.getAuthenticationByOrgId(userId, orgId);
		const authProviderId = authInfo.id;

		// CB users from specific external system
		const users = await r.table(USER_TABLE)
			.filter({ authProviderId: authProviderId })
			.filter({ "deleted": false }, { default: true })
			.without("deleted")
			.run();
		const disabledCBUsers = users.filter(user => !!user.disabled);
		const enabledCBUsers = users.filter(user => !user.disabled);
		const disabledADUsers = usersResult.filter(user => {
			/**
			 * Bitwise AND to determine disabled userAccountControl value
			 * More info here: https://support.microsoft.com/en-us/help/305144/how-to-use-useraccountcontrol-to-manipulate-user-account-properties
			 * 		 and here: http://www.selfadsi.org/ads-attributes/user-userAccountControl.htm
			 */
			return (parseInt(user["userAccountControl"]) & 2) === 2;
		});
		const enabledADUsers = usersResult.filter(user => !disabledADUsers.includes(user));

		// Array of usernames from AD/LDAP
		const incomingEnabledUsernames = enabledADUsers.map(usr => {
			return usr.sAMAccountName;
		});
		const incomingDisabledUsernames = disabledADUsers.map(usr => {
			return usr.sAMAccountName;
		});

		// Array of usernames from CB
		const cbEnabledUsernames = enabledCBUsers.map(cbUsr => {
			return cbUsr.username;
		});

		enabledCBUsers.forEach(user => {
			if (incomingDisabledUsernames.includes(user.username)) {
				// -- if user disabled in AD, disable
				disables.push({
					avatar: "user",
					name: user.name,
					id: user.id,
					username: user.username,
					icon: "disable"
				});
			}
			else if (!incomingEnabledUsernames.includes(user.username)) {
				// -- if user DNE in AD, remove
				removals.push({
					avatar: "user",
					name: user.name,
					id: user.id,
					username: user.username,
					icon: "remove"
				});
			}
		});

		disabledCBUsers.forEach(user => {
			if (incomingEnabledUsernames.includes(user.username)) {
				// -- if user exists in AD, enable
				enables.push({
					avatar: "user",
					name: user.name,
					id: user.id,
					username: user.username,
					icon: "enable"
				});
			}
			else if (!incomingDisabledUsernames.includes(user.username)) {
				// -- if user DNE in AD, remove
				removals.push({
					avatar: "user",
					name: user.name,
					id: user.id,
					username: user.username,
					icon: "remove"
				});
			}
		});

		incomingEnabledUsernames.forEach(username => {
			// -- if user DNE in CB, add
			if (!cbEnabledUsernames.includes(username)) {
				additions.push(username);
			}
		});

		return {
			removals,
			disables,
			enables,
			additions
		};
	}
	catch (err) {
		console.log("authenticationModel.checkUserAddRemove error: ", err);
		return {
			removals: [],
			additions: []
		};
	}
};
