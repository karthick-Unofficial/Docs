const redis = require("./redisProvider").get({});
const config = require("../config.json");
const useragent = require("useragent");
const uuidv1 = require("uuid/v1");
const tokenProvider = require("./tokenProvider")({});
const _global = require("../app-global.js");

class Session {
	constructor() {

	}

	// -- session timeout will be defualt or role based
	// -- needs to be updated on every request in app-gateway
	// -- maybe tryCreate
	async create(user, remoteAddress, userAgent) {
		const options = config.authentication ? config.authentication.session || {} : {};
		const allowConcurrent = options.concurrent || false;
		const sessionTimeout = options.timeout || 1800; // default 30 minutes in milliseconds
				
		const activeSessions = await this.getUserActiveSessions(user.id);
		if((!allowConcurrent) && activeSessions.length > 0) {
			return { success: false, reason: "User already has an active session" };
		}

		const sessionId =  uuidv1();
		const agent = useragent.parse(userAgent);
		const agt = agent.toString();
		const os = agent.os.toString();
		const device = agent.device.toString();
		const exp = Date.now() + (sessionTimeout * 1000);

		const hashes = {}; 
		hashes["sid"] = sessionId;
		hashes["agent"] = agt;
		hashes["os"] = os;
		hashes["device"] = device;
		hashes["remoteAddress"] = remoteAddress;
		hashes["timeout"] = sessionTimeout;
		hashes["exp"] = exp;
		// hashes["blacklist"] = false; rather than blacklist could just set exp to 0 or remove key. we will need disabled at user level

		const key = `users:${user.id}:sessions:${sessionId}`;
		await redis.hmset(key, hashes);
		// -- remove key when no longer valid - drop session
		// -- this will need to be updated on every authorize in app-gateway
		await redis.expire(key, sessionTimeout);

		const tokens = {
			access_token: tokenProvider.generate(user, "access", { "sid": sessionId }),
			refresh_token: tokenProvider.generate(user, "refresh")
		};

		_global.logger.audit(
			user.id, 
			"user", 
			user.id,
			"login", 
			"Created a new session", 
			true,
			hashes
		);

		return { success: true, tokens: tokens };
	}

	async getUserActiveSessions(userId) {
		const pattern = `users:${userId}:sessions:*`;
		const sessionKeys = await redis.keys(pattern);
		const sessions = [];
		for(const idx in sessionKeys) {
			const key = sessionKeys[idx];
			const session = await redis.hgetall(key);
			if(this.sessionIsActive(session)) {
				sessions.push(session);
			}
		}
		return sessions;
	}

	async getAllActiveSessions() {
		const pattern = "users:*";
		const sessionKeys = await redis.keys(pattern);
		const sessions = [];
		for(const idx in sessionKeys) {
			const key = sessionKeys[idx];
			const session = await redis.hgetall(key);
			if(this.sessionIsActive(session)) {
				sessions.push(session);
			}
		}
		return sessions;
	}

	async dropUserAllSessions(userId) {
		const sessions = await this.getUserActiveSessions(userId);
		for(const idx in sessions) {
			try {
				const session = sessions[idx];
				const result = await this.dropUserSession(userId, session.sid);
				if(!result.success) {
				// -- we need it to work so throw error back to caller and they can resubmit
					return { success: false };
				}
			}
			catch(ex) {
				_global.logger.error({
					app: "ecosystem",
					class: "Session",
					method: "dropUserSession",
					err: JSON.stringify(ex, null, 4),
					addlInfo: {
						"userId": userId,
						"sid": sessions[idx]
					}
				});
			}
		}
		return { success: true };
	}

	async dropUserSession(userId, sid) {
		const key = `users:${userId}:sessions:${sid}`;
		let result = 0;
		try {
			result = await redis.del(key);
		}
		catch(ex) {
			_global.logger.error({
				app: "ecosystem",
				class: "Session",
				method: "dropUserSession",
				err: JSON.stringify(ex, null, 4),
				addlInfo: {
					"userId": userId,
					"sid": sid
				}
			});
			return { success: false };
		}
		return { success: result > 0 };
	}

	// -- todo: other checks potentially, i.e. blacklisting
	async sessionIsActive(session) {
		const isExpired = Date.now() > session.exp;
		return !isExpired;
	}

	async getAllActiveUsers() {
		const pattern = "users:*";
		const sessionKeys = await redis.keys(pattern);
		const userIds = [];
		for(const idx in sessionKeys) {
			const key = sessionKeys[idx];
			const userId = key.split(":")[1];
			if (userIds.indexOf(userId) < 0) {
				userIds.push(userId);
			}
		}
		return userIds;
	}

	async getAllActiveSessionsByUser() {
		const pattern = "users:*";
		const sessionKeys = await redis.keys(pattern);
		const userSessions = {};
		for(const idx in sessionKeys) {
			const key = sessionKeys[idx];
			const userId = key.split(":")[1];
			if (!userSessions[userId]) {
				userSessions[userId] = [];
			}

			const session = await redis.hgetall(key);
			if(this.sessionIsActive(session)) {
				userSessions[userId].push(session);
			}
		}

		return userSessions;
	}

}

module.exports = new Session();