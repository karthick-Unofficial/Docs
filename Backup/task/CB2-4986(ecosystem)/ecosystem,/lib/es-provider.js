const elasticsearch = require("elasticsearch");
const esServer = process.env.ES_SERVER ? process.env.ES_SERVER : "elasticsearch1:9200";
const esVersion = process.env.ES_API_VERSION || "7.4";
// eslint-disable-next-line radix
const esReqTimeout = process.env.ES_REQ_TIMEOUT ? parseInt(process.env.ES_REQ_TIMEOUT) : 5000;
const esUsername = process.env.ES_USERNAME || "elastic";
const secrets = require("../secrets/secrets"); 
const pw = secrets.get("ES_PASSWORD");

module.exports = { 
	get: getClient
};

function getClient(options) {
	let esOptions = {
		"host": esServer, 
		"apiVersion": esVersion, 
		"requestTimeout": esReqTimeout,
		"httpAuth": `${esUsername}:${pw}`,
		"auth": {
			"username": esUsername,
			"password": pw
		}
	};
	if(options) {
		esOptions = {...esOptions, ...options};
	}
	return new elasticsearch.Client(esOptions);
}