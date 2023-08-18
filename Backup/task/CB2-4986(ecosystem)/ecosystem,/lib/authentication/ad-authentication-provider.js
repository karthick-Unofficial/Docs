const LdapAuthenticationProvider = require("./ldap-authentication-provider");
const ActiveDirectory = require("activedirectory");

class ADAuthenticationProvider extends LdapAuthenticationProvider {
	constructor(config) {
		super(config);
	}

	createClient() {
		return new ActiveDirectory(this._ldapConfig);
	}

	async authenticate(username, password, callback) {
		// -- parse out domain from authProvider admin user
		let domainUser = username;
		const ldapConfigUser = this._ldapConfig.username;
		if (ldapConfigUser.split("\\").length > 1) {
			domainUser = ldapConfigUser.split("\\")[0] + "\\" + domainUser;
		}
		else if (ldapConfigUser.split("@").length > 1) {
			domainUser = domainUser + "@" + ldapConfigUser.split("@")[1];
		}

		this.ldapClient.authenticate(domainUser, password, function (err, auth) {
			if (err) {
				console.log("AD - Authenticate error: ", err);
				callback({ err: { message: "An error occured.", code: 500 } }, null);
			}

			// Success
			if (auth) {
				this.isUserMemberOf(username, this.groupName, function (err, isMember) {
					if (err) {
						console.log("AD - Authenticate: isUserMemberOf error: ", err);
					}

					// User is member of correct group
					if (isMember) {
						callback(null, true);
					}
					else {
						callback({ err: { message: "User is not a member of authentication group: " + this.groupName, code: 401 } }, null);
					}
				}.bind(this));
			}
			// Failed
			else {
				callback({ err: { message: "External authentication failed.", code: 401 } }, null);
			}
		}.bind(this));
	}


	/**
	 * Generic AD search via query filter. Returns groups, users, and "others" that match filter.
	 * @param {string || object} opts - Query filter (ex "CN=*Brad*")
	 * @param {function} callback 
	 */
	async find(opts, callback) {
		try {
			return this.ldapClient.find(opts, callback);  
		} 
		catch (error) {
			console.log("AD - Find error: ", error);
			return error;
		}
	}

	/**
	 * Verify specific user exists
	 * @param {string} username - sAMAccountName, userPrincipalName, or distinguishedName (dn)
	 * @param {function} callback 
	 */
	async userExists(username, callback) {
		try {
			return this.ldapClient.userExists(username, callback);
		} 
		catch (error) {
			console.log("AD - User exists error: ", error);
			return error;
		}
	}

	/**
	 * Verify user is a member of specified group
	 * @param {string} userToSearch -- sAMAccountName, userPrincipalName, or distinguishedName (dn)
	 * @param {string} groupName -- commonName (cn) or distinguishedName (dn)
	 * @param {function} callback 
	 */
	async isUserMemberOf(userToSearch, groupName, callback) {
		try {
			return this.ldapClient.isUserMemberOf(userToSearch, groupName, callback);
		} 
		catch (error) {
			console.log("AD - Is user member error: ", error);
			return error;
		}
	}

	/**
	 * Retrieve all groups a user belongs to
	 * @param {string} userToSearch -- sAMAccountName, userPrincipalName, or distinguishedName (dn)
	 * @param {function} callback 
	 */
	async getGroupMembershipForUser(userToSearch, callback) {
		try {
			return this.ldapClient.find(userToSearch, callback);
		} catch (error) {
			console.log("AD - Group membership error: ", error);
			return error;
		}
	}
	
	/**
	 * Retrieve all users that match filter
	 * @param {string} opts -- LDAP filter (ex. "CN=*George*")
	 * @param {function} callback 
	 */
	async findUsers(opts, callback) {
		try {
			return this.ldapClient.findUsers(opts, callback);
		} 
		catch (error) {
			console.log("AD - Find users error: ", error);
			return error;
		}
	}

	/**
	 * Find a group by commonName (cn) or distinguishedName (dn)
	 * @param {*} groupName - common name or distinguished name
	 * @param {*} callback 
	 */
	async findGroup(groupName, callback) {
		try {
			return this.ldapClient.findGroup(groupName, callback);
		} 
		catch (error) {
			console.log("AD - Find group error: ", error);
			callback(error, null);
			return error;
		}
	}

	/**
	 * Retreive a list of users by commonName (cn) or distinguishedName (dn)
	 * @param {string} groupName - common name or distinguished name
	 * @param {function} callback 
	 */
	async getUsersForGroup(groupName, callback) {
		try {
			return this.ldapClient.getUsersForGroup(groupName, callback);
		} catch (error) {
			console.log("AD - Get users for group error: ", error);
			return error;
		}
	}   

	/**
	 * Retreive a list of users based on the saved authProvider in sys_authProviders. Mainly used for the sync process.
	 * @param {object} opts -- options for search query
	 * @param {function} callback 
	 */
	async getUsersForCommandBridgeGroup(callback) {
		try {
			return this.getUsersForGroup(this.groupName, callback);
		} catch (err) {
			console.log("Get users for CB group error: ", err);
			callback(err, null);
		}
	}  
}
module.exports = ADAuthenticationProvider;


