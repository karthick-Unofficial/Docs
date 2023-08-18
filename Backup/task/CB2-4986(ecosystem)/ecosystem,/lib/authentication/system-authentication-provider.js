const AuthenticationProviderBase = require("./authentication-provider-base");
const encryptionProvider = require("../../lib/encryptionProvider")({});
const conf = require("../../config.json");

const configSym = Symbol();
class SystemAuthenticationProvider extends AuthenticationProviderBase {
	constructor(config) {
		super(config);
		this.authMode = conf.authentication
			? conf.authentication.mode.toLowerCase() || "advanced"
			: "advanced";
		this.maxLoginAttempts = conf.authentication
			? conf.authentication.maxLoginAttempts || 5
			: 5;
		this.maxLoginAttemptsLockoutPeriod = conf.authentication
			? conf.authentication.maxLoginAttemptsLockoutPeriod || 10
			: 10;
	}

	/**
	 * authenticate - implement to authenticate the user
	 * @param userName User to be authenticated
	 * @param password user credential
	 *  return user if authenticated else error
	 */
	async authenticate(userName, password, callback) {
		try {
			const user = await this.getUser(userName);
			if (!user.password) {
				callback({ err: { message: "Password not yet set", code: 401 } });
				return;
			}
			if (this.authMode === "advanced") {
				// -- lockout due to reaching max failed login attempts
				if (user.lockedUntil && Date.now() <= user.lockedUntil.getTime()) {
					callback({ err: { message: "Account locked out", code: 401 } });
					return;
				}
				// -- reset if lockout has passed
				if (user.lockedUntil && Date.now() > user.lockedUntil.getTime()) {
					this.resetLoginAttempts(user.id);
				}
				if (
					user.passwordExpires &&
					Date.now() > user.passwordExpires.getTime()
				) {
					callback({ err: { message: "Password expired", code: 401 } });
					return;
				}
			}
			const result = this.compareSync(password, user.password);
			if (result) {
				// -- if we got this far we can safely reset login attempts
				// -- if locked would not get here
				if (this.authMode === "advanced") {
					this.resetLoginAttempts(user.id);
				}
				callback(null, true);
				return;
			} else {
				if (this.authMode === "advanced") {
					this.failedLoginAttempt(
						user.id,
						this.maxLoginAttempts,
						this.maxLoginAttemptsLockoutPeriod
					);
				}
				callback({ err: { message: "Password invalid", code: 401 } });
				return;
			}
		}catch (err) {
			callback({ err: err }, null);
		}
	}

	compareSync(_userPassword, _hashedPassword) {
		return encryptionProvider.compareSync(_userPassword, _hashedPassword);
	}
}

module.exports = SystemAuthenticationProvider;
