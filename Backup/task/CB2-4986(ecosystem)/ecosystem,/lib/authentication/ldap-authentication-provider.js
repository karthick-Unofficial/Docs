const AuthenticationProviderBase = require("./authentication-provider-base");
const ldap = require("ldapjs");

class LdapAuthenticationProvider extends AuthenticationProviderBase {
	constructor(config) {
		super(config);

		const ldapHost = config.connection.host;
		const ldapPort = config.connection.port;
		const baseDN = config.connection.baseDN;
		const adminUser = config.connection.adminUser;
		const adminPassword = config.connection.adminPassword;
		this.groupName = config.connection.groupName;

		//If using secure ldap
		if (ldapPort === "636") {
			//Required to ensure no certificate issues. Not super secure, but...
			process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
			this._ldapUrl = `ldaps://${ldapHost}:${ldapPort}`;
		}
		else if (ldapPort !== "") {
			this._ldapUrl = `ldap://${ldapHost}:${ldapPort}`;
		}
		else {
			this._ldapUrl = `ldap://${ldapHost}`;
		}

		this._ldapConfig = {
			url: this._ldapUrl,
			baseDN: baseDN,
			username: adminUser,
			password: adminPassword
		};

		this.ldapClient = this.createClient();
	}

	createClient() {

		// Create client with correct URL built from config
		const client = ldap.createClient({ url: this._ldapUrl });

		// Bind data to LDAP instance
		client.bind(this._ldapConfig.baseDN, this._ldapConfig.password, function (err) {
			//assert.ifError(err);
			console.log("Error binding connection data to LDAP client: ", err);
			// throw err;
		});

		return client;
	}

	async authenticate(userName, password, callback) {
		// If user can bind to client using their user, pass, and org's auth settings, they should be authenticated
		const client = ldap.createClient({ url: this._ldapUrl });
		client.bind(this._ldapConfig.baseDN, this._ldapConfig.password, function (err) {
			if (err) {
				callback(err, null);
			}
		});

		if (client) {
			callback(null, true);
		}
		else {
			callback(null, false);
		}
	}

	async getUsersForGroup(groupName, callback) {
		try {
			const opts = {
				// Default filter
				filter: "(objectclass=*)"
			};

			// First argument - base: a DN string
			// Second argument - options: optional params
			// Third argument - callback
			return this.ldapClient.search(this.groupName, opts, function (err, res) {
				if (err) {
					callback(err, null);
				}

				const results = [];

				// Store results as they come
				res.on("searchEntry", function (entry) {
					results.push(entry.object);
				});

				res.on("error", function (err) {
					callback(err.message, null);
				});

				res.on("end", function (result) {
					// From: http://ldapjs.org/client.html#search
					// "You'll want to check the LDAP status code (likely for 0) on the end event to assert success"
					if (result.status === 0) {
						callback(null, results);
					}
				});

				// Search references are also exposed, if needed
				// res.on("searchReference", function(referral) {
				// 	console.log("LDAP searchReference response: " + referral.uris.join());
				// })
			});

		} catch (error) {
			console.log("LDAP - Get users for group error: ", error);
			if (callback) {
				callback(error, null);
			}
			else {
				return error;
			}
		}
	}

	findGroup(callback) {
		return this.ldapClient.search(this.groupName, function (err, res) {
			if (err) {
				callback(err, null);
			}

			let results = [];

			// Store results as they come
			res.on("searchEntry", function (entry) {
				if (results !== null) {
					results.push(entry.object);
				}
			});

			res.on("error", function (err) {
				results = null;
				callback(err.message, null);
			});

			res.on("end", function (result) {
				// From: http://ldapjs.org/client.html#search
				// "You'll want to check the LDAP status code (likely for 0) on the end event to assert success"
				if (result.status === 0 && results) {
					callback(null, results);
				}
			});
		});
	}

	getUsersForCommandBridgeGroup(opts, callback) {
		try {
			return this.getUsersForGroup(this.groupName, callback);
		} catch (err) {
			console.log("Get users for CB group error: ", err);
			callback(err, null);
		}
	}
}
module.exports = LdapAuthenticationProvider;


