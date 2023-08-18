// Packages
const CryptoJS = require("crypto-js");

// Imports
const authModel = require("../../models/authenticationModel")();
const secrets = require("../../secrets/secrets");

// Implementation providers
const SystemAuthenticationProvider = require("./system-authentication-provider");
const LdapAuthenticationProvider = require("./ldap-authentication-provider");
const ADAuthenticationProvider = require("./ad-authentication-provider");

// Symbol -- Unique value used to prevent object property collision
const providerCache = Symbol();

// If you need to use AD/LDAP localyl, uncomment the below variable and comment the secret() one
// const secretKey = "This is a secret key that should only be used for development!";
const secretKey = secrets.get("AES_ENCRYPTION_SECRET_KEY") ? secrets.get("AES_ENCRYPTION_SECRET_KEY") : null;

class AuthenticationProviderFactory {
	constructor() {
		
		// Symbol-keyed property
		this[providerCache] = {};
	}

	/**
	 * Return correct provider via provider type with no DB query, passing in the connection info
	 * @param {string} authProviderType -- provider type
	 * @param {object} config -- connection settings
	 */
	async getAuthenticationProviderByType(authProviderType, config) {
		let provider;

		switch (authProviderType) {
			case "system":
				provider = new SystemAuthenticationProvider();
				break;
			case "ldap":
				provider = new LdapAuthenticationProvider(config);
				break;
			case "active-directory":
				provider = new ADAuthenticationProvider(config);
				break;
			default:
				throw new Error(`No provider matching provider type ${authProviderType}`);
		}

		return provider;
	}

	/**
	 * Return correct provider via id, querying the DB to get connection info
	 * @param {string} authProviderId -- ID of the authProvider entry in sys_authProviders
	 */
	async getAuthenticationProvider(authProviderId) {

		// Return if already loaded
		if (this[providerCache][authProviderId]) {
			return this[providerCache][authProviderId];
		}

		let providerData = null;
		let authProviderConfig = null;
		let provider = null;

		// Set config
		try {
			providerData = await authModel.getAuthenticationProviderById(authProviderId);
			authProviderConfig = null;

			if (authProviderId !== "system") {
				if (!secretKey) {
					throw "No secret key for password decryption found!";
				} 
				else {
					const { baseDN, groupName, host, password, port, username } = providerData.connection;
					// Decrypt password
					const bytes = CryptoJS.AES.decrypt(password, secretKey);
					const unencryptedPw = bytes.toString(CryptoJS.enc.Utf8);

					authProviderConfig = {
						connection: {
							host,
							port,
							baseDN,
							adminUser: username,
							adminPassword: unencryptedPw,
							groupName
						}
					};
				}
			}
		}
		catch (ex) {
			console.log("Unhandled exception in AuthenticationProviderFactory.getAuthenticationProvider:", ex);
			throw ex; // 500
		}

		// Set correct provider based on type
		switch (providerData.providerId) {
			case "system":
				provider = new SystemAuthenticationProvider();
				break;
			case "ldap":
				provider = new LdapAuthenticationProvider(authProviderConfig);
				break;
			case "active-directory":
				provider = new ADAuthenticationProvider(authProviderConfig);
				break;
			default:
				throw new Error(`No provider matching provider type ${authProviderConfig.providerId}`);
		}

		// Set provider if nonexistant in cache
		if (!this[providerCache][authProviderId]) {
			this[providerCache][authProviderId] = provider;
		}

		return provider;
	}
}

module.exports = AuthenticationProviderFactory;