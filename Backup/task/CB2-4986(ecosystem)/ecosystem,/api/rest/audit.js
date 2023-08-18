const esProvider = require("../../lib/es-provider");
const SERVICE_PATH_COMPOSE = "docker.container.labels.com.docker.compose.service";
const SERVICE_PATH_SWARM = "docker.container.labels.com.docker.swarm.service.name";
const { canAudit } = require("../../lib/authorize");

module.exports = function (app) {
	// -- todo: setup to access config globally and create a model for this
	const restServer = app.rest;
	const esClient = esProvider.get();
	// -- by date range
	// by date range and service
	// by date range and service and user
	// by date range and user

	restServer.get("/auditLogs", async function (req, res) {
		if(await canAudit(req, res)) {
			handleAuditReq(esClient, req, res);
		}
	});

	// restServer.get("/auditLogs?start=:start&end=:end&service=:service&uid=:uid", async function (req, res) {
	// 	handleAuditReq(esClient, req, res);
	// });

	// restServer.get("/auditLogs?start=:start&end=:end&service=:service", async function (req, res) {
	// 	handleAuditReq(esClient, req, res);
	// });

	// restServer.get("/auditLogs?start=:start&end=:end&uid=:uid", async function (req, res) {
	// 	handleAuditReq(esClient, req, res);
	// });

	// restServer.get("/auditLogs?start=:start&end=:end", async function (req, res) {
	// 	handleAuditReq(esClient, req, res);
	// });

};

async function handleAuditReq(esClient, req, res) {
	try {
		const options = prepQ(req);
		console.log(options);
		if(options.start && options.end) {
			res.send(await execQ(esClient, options));
		}
		else {
			res.err("Valid start and end date required");
		}
	}
	catch(ex) {
		console.log("ERROR", JSON.stringify(ex, null, 4));
		console.log(req);
		console.log(res);
		res.err("Unexpected Error", ex);
	}
}

function prepQ(req) {
	const options = {};
	const startDate = new Date(req.query.start || null);
	const endDate = new Date(req.query.end || null);
	if(startDate && startDate !== "Invalid Date") options.start = startDate.toISOString();
	if(endDate && endDate !== "Invalid Date") options.end = endDate.toISOString();
	if(req.query.service) options.service = req.query.service;
	if(req.query.uid) options.userId = req.query.uid;
	options.from = req.query.from ? parseInt(req.query.from) : 0;
	options.size = req.query.size ? parseInt(req.query.size) : 10;

	return options;
}

async function execQ(esClient, options) {

	const q = {
		"index": "audit-logs-*",
		"ignoreUnavailable": true,
		"from": options.from,
		"size": options.size,
		"body": {
			"sort": [
				{ "@timestamp": { "order": "desc" } },
				{ "offset": { "order": "desc" } }
			],
			"_source": "log",
			"query": {
				"bool": {
					"must": [
						{"range": {"@timestamp": {"gte": options.start, "lte": options.end }}}
					]
				}
			}
		}
	};

	if (options.service) {
		const fieldExistsCondition = { "exists": { "field": SERVICE_PATH_COMPOSE } };
		const matchCondition = {
			"match": {}
		};
		matchCondition.match[SERVICE_PATH_COMPOSE + ".keyword"] = options.service;
		q.body.query.bool.must.push(fieldExistsCondition);
		q.body.query.bool.must.push(matchCondition);
		//q.body.query.bool.must.push({ "match": { "docker.container.labels.com.docker.swarm.service.name.keyword": options.service } });
		//{ "match": { "log.app": "ecosystem" } }
	}
    
	if(options.userId) {
		const userIdCondition ={ "match": { "log.userId.keyword": options.userId } };
		q.body.query.bool.must.push(userIdCondition);
	}

	let qResult = null;
	try {
		qResult = await esClient.search(q);
	}
	catch(ex) {
		console.log(ex.message);
	}
	const logEntries = qResult.hits.hits.map((hit) => {
		return hit._source.log;
	});

	return logEntries;

}