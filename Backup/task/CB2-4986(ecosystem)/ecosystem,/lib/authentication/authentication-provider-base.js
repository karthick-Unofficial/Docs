const model = require("../../models/userModel")({});

// Symbol -- Unique value used to prevent object property collision
const configSym = Symbol();

class AuthenticationProviderBase {
	constructor(config = {}) {

		// Symbol-keyed property
		this[configSym] = config;
	}

	get config() {
		return this[configSym];
	}

	set config(value) {
		this[configSym] = value;
	}

	/**
	 * authenticate - implement to authenticate the user
	 * @param userName User to be authenticated
     * @param password user credential
	 *  return user if authenticated else error
	 */
	async authenticate(userName, password, callback) {
		console.log("Not implemented!");
		return false;
	}

	async getUser(userName) {
		return model.getByUsername(userName);
	}

	async failedLoginAttempt(userId, maxLoginAttempts, lockoutPeriod) {
		return await model.failedLoginAttempt(userId, maxLoginAttempts, lockoutPeriod);
	}

	async resetLoginAttempts(userId) {
		return await model.resetLoginAttempts(userId);
	}

	isUserConfiguredInApp(userName) {
		this.getUser(userName, function (error, user) {
			if (error) {
				return false;
			}
			else {
				return true;
			}
		}.bind(this));
	}
	
	getUsersForCommandBridgeGroup(opts, callback) {
		console.log("Not implemented!");
		return false;
	} 	
}

module.exports = AuthenticationProviderBase;

