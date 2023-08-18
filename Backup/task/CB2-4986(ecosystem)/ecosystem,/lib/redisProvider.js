const Redis = require("ioredis");

function getClient(options) {
	if(!options) options = {};
	return new Redis({
		port: options.port || process.env.REDIS_PORT || 6379,
		host: options.host || process.env.REDIS_HOST || "redis-master"
	});
}

module.exports = { 
	get: getClient
};
