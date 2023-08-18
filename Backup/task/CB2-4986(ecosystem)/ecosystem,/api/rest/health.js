const os = require("os");
const Redis = require("ioredis");
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/health.js");
const esServer = process.env.ES_SERVER ? process.env.ES_SERVER : "elasticsearch1:9200";
const esReqTimeout = process.env.ES_REQ_TIMEOUT ? parseInt(process.env.ES_REQ_TIMEOUT) : 2000;
const esProvider = require("../../lib/es-provider");
const client = esProvider.get({ "requestTimeout": esReqTimeout });
const provider = require("../../lib/rethinkdbProvider");
const extSysModel = require("../../models/externalSystemModel")();
const global = require("../../app-global.js");
// the period that server resource metrics will be averaged over
const METRIC_SAMPLE_PERIOD = process.env.METRIC_SAMPLE_PERIOD || 5; // in minutes
const CPU_THRESHOLD = process.env.HEALTH_CPU_THRESHOLD || 75;
const MEMORY_THRESHOLD = process.env.HEALTH_MEMORY_THRESHOLD || 75;
const DISK_DEVICE = process.env.HEALTH_DISK_DEVICE || "*";
const DISK_THRESHOLD = process.env.HEALTH_DISK_THRESHOLD || 75;
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");
const { locale } = config.environment;

const redis = new Redis({
	port: process.env.REDIS_PORT || 6379,
	host: process.env.REDIS_HOST || "redis-master"
});

module.exports = function (app) {

	const restServer = app.rest;
	

	app._getHealthChecks = async function () {

		let healthChecks = [];
		try {
			// -- aggregate checks and return

			const dbHealth = await getDatabaseHealth();
			healthChecks = [...healthChecks, ...dbHealth.checks];

			const hostnames = await app._docker.getSystemHostnames();
			logger.info("_getHealthChecks", "get hostnames for server health", { hostnames: hostnames }, SYSTEM_CODES.HEALTH);

			for (const hostname of hostnames) {
				const serverHealth = await getServerHealth(hostname);
				healthChecks = [...healthChecks, ...serverHealth.checks];
			}

			const extSystems = await extSysModel.getAllInternal();
			for (const idx in extSystems) {
				const extSysConfig = extSystems[idx].config || {};
				// if disabled or no feed id don't track health
				// there are systems that integrate to events that will be neglected so
				// todo: implement health for those likely in integration-app
				if (extSystems[idx].enabled && extSysConfig.feedId) {
					// check for existence of props and default minRate if missing	
					const feedHealth = await getFeedHealth(extSysConfig.feedId, extSysConfig.health || {});
					healthChecks = [...healthChecks, ...feedHealth.checks];
				}
			}

			const ecoLinkHealth = global.ecoLinkManager.getHealth();
			if (ecoLinkHealth.length > 0) {
				healthChecks = [...healthChecks, ...ecoLinkHealth];
			}

			return healthChecks;
		}
		catch (err) {
			logger.error("_getHealthChecks", "Unexpected error getting ecosystem health checks", { partialHealth: JSON.stringify(healthChecks), err: JSON.stringify(err) }, SYSTEM_CODES.HEALTH);
			throw err;
		}
	};

	restServer.get("/health/heartbeat", async (req, res) => {
		let pingResult = undefined;
		try {
			pingResult = await provider.ping();
			await client.ping({ requestTimeout: 5000 });
			await redis.info("server");

		}
		catch (err) {
			res.send({ isHealthy: false });
		}
		res.send({ isHealthy: pingResult });
	});

	// -- will need to get hosts from docker or perhaps just derive uniques from data - no can't do that because what if not exists
	restServer.get("/health/server?host=:host&device=:device", function (req, res) {
		res.send(getServerHealth(req.routeVars.host, req.routeVars.device, res));
	});

	// from external systems
	restServer.get("/health/feed?feedid=:feedid&minrate=:minrate", function (req, res) {
		res.send(getFeedHealth(req.routeVars.feedid, req.routeVars.minrate, res));
	});

	restServer.get("/health/databases", function (req, res) {
		res.send(getDatabaseHealth());
	});

};

async function getServerHealth(hostname) {

	const healthReport = {
		"system": `server-${hostname}`,
		"checks": []
	};

	let deviceRoot = DISK_DEVICE;
	if (deviceRoot === "*") {
		switch (os.platform()) {
			case "win32":
				deviceRoot = "C:\\";
				break;
			default:
				deviceRoot = "/";
				break;
		}
	}

	healthReport.checks.push(await getCPUCheck(hostname));
	healthReport.checks.push(await getMemoryCheck(hostname));
	healthReport.checks.push(await getFileSystemCheck(hostname, deviceRoot));

	return healthReport;

}

async function getFeedHealth(feedId, healthConfig) {

	const healthReport = {
		"system": `feed-${feedId}`,
		"checks": []
	};

	if (healthConfig.includeTxnsPerSec) {
		const samplePeriod = healthConfig.txnsPerSecSamplePeriod || 5;
		const minRate = healthConfig.txnsPerSecMinRate || 1;
		healthReport.checks.push(await getMinTransactionRateCheck(feedId, samplePeriod, minRate));
	}

	if (healthConfig.includeTotalTxns) {
		const samplePeriod = healthConfig.totalTxnsSamplePeriod || 5;
		const minCount = healthConfig.totalTxnsMinCount || 1;
		healthReport.checks.push(await getTotalTransactionCountCheck(feedId, samplePeriod, minCount));
	}

	if (healthConfig.includeAverageLatency) {
		const samplePeriod = healthConfig.avgLatencySamplePeriod || 5;
		const maxLatency = healthConfig.avgLatencyMax || 1000;
		healthReport.checks.push(await getFeedLatencyCheck(feedId, samplePeriod, maxLatency));
	}

	if (healthConfig.custom) {
		const keys = Object.keys(healthConfig.custom);
		const customChecks = await Promise.all(
			keys.map((key) => {
				// handle all cases in one call
				const type = healthConfig.custom[key].type;
				return type.includes("count") ? getCustomCountCheck(feedId, key, healthConfig.custom[key]) :
					type.includes("avg") ? getCustomAverageCheck(feedId, key, healthConfig.custom[key]) : [];
			})
		);
		for (const result of customChecks) {
			healthReport.checks = healthReport.checks.concat(result);
		}
	}

	return healthReport;

}

async function getDatabaseHealth() {

	const healthReport = {
		"system": "databases",
		"checks": []
	};

	healthReport.checks.push(await getRethinkDBAvailableCheck());
	healthReport.checks.push(await getESAvailableCheck());
	healthReport.checks.push(await getREDISAvailableCheck());

	return healthReport;
}

async function getRethinkDBAvailableCheck() {
	let isAvailable = false;
	let status = { "ok": true };
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { rethink } = health;
	try {
		isAvailable = await provider.ping();
	}
	catch (err) {
		logger.error("getRethinkDBAvailableCheck", "Error executing rethinkdb ping", { errMessage: err.message, errStack: err.stack });
	}
	if (!isAvailable) {
		status = {
			"ok": false,
			"message": health.didNotRespond
		};
	}
	const check = {
		"id": "ecosystem-rethinkdb-availability",
		"name": rethink.rethinkAvailability,
		"desc": rethink.rethinkDesc,
		"value": isAvailable ? "available" : "unavailable",
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getESAvailableCheck() {

	let isAvailable = false;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { elasticSearch } = health;
	try {
		await client.ping({ requestTimeout: 5000 });
		isAvailable = true;
	}
	catch (ex) {
		isAvailable = false;
	}
	let status = { "ok": true };
	if (!isAvailable) {
		status = {
			"ok": false,
			"message": health.didNotRespond
		};
	}
	const check = {
		"id": "ecosystem-elasticsearch-availability",
		"name": elasticSearch.elasticSearchAvail,
		"desc": elasticSearch.elasticSearchDesc,
		"value": isAvailable ? "available" : "unavailable",
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getREDISAvailableCheck() {

	let isAvailable = false;
	let res = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { redisHealth } = health;
	try {
		res = await redis.info("server");
		isAvailable = true;
	}
	catch (ex) {
		isAvailable = false;
	}
	let status = { "ok": true };
	if (!isAvailable) {
		status = {
			"ok": false,
			"message": redisHealth.didNotRespond
		};
	}
	else {
		const props = ["redis_version", "uptime_in_seconds"];
		res = res.replace("# Server ", "");
		const kvPairs = res.split("\r\n");
		status["details"] = {};
		for (const kvPair of kvPairs) {
			const kv = kvPair.split(":");
			if (props.indexOf(kv[0]) > -1) {
				status.details[kv[0]] = kv[1];
			}
		}
	}
	const check = {
		"id": "ecosystem-redis-availability",
		"name": redisHealth.redisAvail,
		"desc": redisHealth.redisDesc,
		"value": isAvailable ? "available" : "unavailable",
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getMinTransactionRateCheck(feedId, samplePeriod, minRate) {
	const metricName = `external-system-processor-track-recvd-${feedId}`;
	const metricField = `data.stats.${metricName}`;
	const q = {
		"from": 0,
		"size": 20,
		"_source": [metricField, "container.id"],
		"query": {
			"bool": {
				"must": [
					{ "exists": { "field": metricField } }
				],
				"filter": [
					{ "range": { "@timestamp": { "gte": `now-${samplePeriod}m/s` } } }
				]
			}
		},
		"sort": [
			{ "@timestamp": { "order": "desc" } }
		]
	};

	let result = null;
	let qex = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { transRateCheck } = health;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let currentRate = 0;
	if (result === null) {
		status = {
			ok: false,
			"message": `${transRateCheck.unableToFetch} ${feedId}`,
			"details": {
				"err": qex
			}
		};
	}
	else if (!(result.hits.total.value > 0)) {
		status = {
			ok: false,
			"message": `${transRateCheck.noCurrentFeedsAvail} ${feedId}`,
			"details": {
				"suggestion": transRateCheck.metricBeatCheck
			}
		};
	}
	else {
		// -- aggregate currentRate for all unique instances of processors
		const metrics = result.hits.hits;
		const uniqueContainers = [];

		for (let i = 0; i < metrics.length; i++) {
			const cid = metrics[i]._source.container.id;
			if (uniqueContainers.indexOf(cid) === -1) {
				currentRate += metrics[i]._source.log.stats[metricName].currentRate;
				uniqueContainers.push(cid);
			}
		}

		currentRate = Math.round(currentRate);
		if (currentRate < minRate) {
			status = {
				ok: false,
				"message": `${health.feed} ${feedId} ${transRateCheck.currentTxnRateOf} ${currentRate}${transRateCheck.droppedBelow} ${minRate} ${transRateCheck.transPerSec}`
			};
		}
	}

	if (status.ok) {
		status["message"] = `${health.feed} ${feedId} ${transRateCheck.currentTxnRateOf} ${currentRate}${transRateCheck.transAbove} ${minRate} ${transRateCheck.transPerSec}`;
	}

	const check = {
		"id": `ecosystem-feed-rate-${feedId}`,
		"name": `${health.feed} ${feedId} ${transRateCheck.currentTxnRate}`,
		"desc": `${health.feed} ${feedId} ${transRateCheck.currentTxnPerSec}`,
		"value": `${currentRate} ${transRateCheck.transPerSec}`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getCustomCountCheck(feedId, checkId, customProps) {
	const metricName = `${customProps.app}-health-${checkId}-${feedId}`;
	const metricField = `data.stats.${metricName}`;
	// get min and max counts for each unique container for specified feed
	const q = {
		"from": 0,
		"size": 0,
		"_source": [metricField, "container.id"],
		"query": {
			"bool": {
				"must": [{
					"exists": {
						"field": metricField
					}
				}],
				"filter": [{
					"range": {
						"@timestamp": {
							"gte": `now-${customProps.samplePeriod}m/s`
						}
					}
				}]
			}
		},
		"aggs": {
			"group_by_containerid": {
				"terms": {
					"field": "container.id.keyword",
					"size": 10
				},
				"aggs": {
					"min_count": {
						"min": {
							"field": `${metricField}.count`
						}
					},
					"max_count": {
						"max": {
							"field": `${metricField}.count`
						}
					}
				}
			}
		}
	};

	let result = null;
	let qex = null;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let totalTxnCount = 0;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { customCount } = health;
	
	if (result === null) {
		status = {
			ok: false,
			"message": customCount.unableToFetch,
			"details": {
				"err": qex
			}
		};
	}
	else if (!(result.aggregations.group_by_containerid.buckets.length > 0)) {
		status = {
			ok: false,
			"message": customCount.metricsCheck,
			"details": {
				"suggestion": customCount.metricBeatCheck
			}
		};
	}
	else {
		// -- get sum of all feed counts for each process instance (container)
		const containerBuckets = result.aggregations.group_by_containerid.buckets;
		for (const bucket of containerBuckets) {
			totalTxnCount += (bucket.max_count.value - bucket.min_count.value);
		}

		if (customProps.type === "lt-count") {
			if (totalTxnCount < customProps.threshold) {
				status = {
					ok: false,
					"message": customProps.failMessage || `${health.feed} ${feedId} ${customProps.label} ${customCount.of} ${totalTxnCount} ${customCount.inLast} ${customProps.samplePeriod} ${customCount.minsDropped} ${customProps.threshold}`
				};
			}
			else {
				status["message"] = `${health.feed} ${feedId} ${customProps.label} ${customCount.of} ${totalTxnCount} ${customCount.inLast} ${customProps.samplePeriod} ${customCount.minsAbove} ${customProps.threshold}`;
			}
		}

		if (customProps.type === "gt-count") {
			if (totalTxnCount > customProps.threshold) {
				status = {
					ok: false,
					"message": customProps.failMessage || `${health.feed} ${feedId} ${customProps.label} ${customCount.of} ${totalTxnCount} ${customCount.inLast} ${customProps.samplePeriod} ${customCount.minsRose} ${customProps.threshold}`
				};
			}
			else {
				status["message"] = `${health.feed} ${feedId} ${customProps.label} ${customCount.of} ${totalTxnCount} ${customCount.inLast} ${customProps.samplePeriod} ${customCount.minsBelow} ${customProps.threshold}`;
			}
		}
	}

	const healthCheckName = `${health.feed} ${feedId} ${customProps.type === "lt-count" ? customCount.min : customCount.max} ${customProps.threshold} ${customProps.label} ${health.inTheLast} ${customProps.samplePeriod} ${customCount.minutes}`;
	const healthCheckDesc = `${health.feed} ${feedId} ${customCount.mustProcess} ${customProps.type === "lt-count" ? customCount.atLeast : customCount.atMost} ${customProps.threshold} ${customProps.label} ${health.inTheLast} ${customProps.samplePeriod} ${customCount.minutes}`;
	const check = {
		"id": metricName,
		"name": healthCheckName,
		"desc": healthCheckDesc,
		"value": totalTxnCount,
		"displayValue": `${totalTxnCount} ${customProps.label}`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getCustomAverageCheck(feedId, checkId, customProps) {
	const metricName = `${customProps.app}-health-${checkId}-${feedId}`;
	const metricField = `data.stats.${metricName}`;
	// get avg, min and max latency across all containers for a specified feed in a specified sample period
	const q = {
		"from": 0,
		"size": 0,
		"_source": [metricField, "container.id"],
		"query": {
			"bool": {
				"must": [{
					"exists": {
						"field": metricField
					}
				}],
				"filter": [{
					"range": {
						"@timestamp": {
							"gte": `now-${customProps.samplePeriod}m/s`
						}
					}
				}]
			}
		},
		"aggs": {
			"avg_value": {
				"avg": {
					"field": `${metricField}.mean`
				}
			},
			"min_value": {
				"min": {
					"field": `${metricField}.min`
				}
			},
			"max_value": {
				"max": {
					"field": `${metricField}.max`
				}
			}
		}
	};

	let result = null;
	let qex = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { customAverage } = health;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let avgValue = -1;
	if (result === null) {
		status = {
			ok: false,
			"message": customAverage.unableToFetch,
			"details": {
				"err": qex
			}
		};
	}
	else if (!(result.hits.total.value > 0)) {
		status = {
			ok: false,
			"message": customAverage.metricsCheck,
			"details": {
				"suggestion": customAverage.sysProcessorCheck
			}
		};
	}
	else {
		avgValue = Math.round(result.aggregations.avg_value.value);
		if (customProps.type === "gt-avg") {
			if (avgValue > customProps.threshold) {
				status = {
					ok: false,
					"message": customProps.failMessage || `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${customAverage.of} ${avgValue} ${customAverage.overLast} ${customProps.samplePeriod} ${customAverage.minsClimbed} ${customProps.threshold}`
				};
			}
			else {
				status["message"] = `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${customAverage.of} ${avgValue} ${customAverage.overLast} ${customProps.samplePeriod} ${customAverage.minsBelow} ${customProps.threshold}`;
			}
		}

		if (customProps.type === "lt-avg") {
			if (avgValue < customProps.threshold) {
				status = {
					ok: false,
					"message": customProps.failMessage || `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${customAverage.of} ${avgValue} ${customAverage.overLast} ${customProps.samplePeriod} ${customAverage.minsDropped} ${customProps.threshold}`
				};
			}
			else {
				status["message"] = `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${customAverage.of} ${avgValue} ${customAverage.overLast} ${customProps.samplePeriod} ${customAverage.minsAbove} ${customProps.threshold}`;
			}
		}

	}


	const healthCheckName = `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${customAverage.last} ${customProps.samplePeriod} ${customAverage.minsForFeed} ${feedId}`;
	const healthCheckDesc = `${health.feed} ${feedId} ${customAverage.average} ${customProps.label} ${health.inTheLast} ${customProps.samplePeriod} ${customAverage.minsNeed} ${customProps.threshold} ${customAverage.forFeed} ${feedId}`;
	const check = {
		"id": metricName,
		"name": healthCheckName,
		"desc": healthCheckDesc,
		"value": avgValue,
		"displayValue": `${avgValue}`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}



async function getTotalTransactionCountCheck(feedId, samplePeriod, minCount) {
	const metricName = `external-system-processor-track-recvd-${feedId}`;
	const metricField = `data.stats.${metricName}`;
	// get min and max counts for each unique container for specified feed
	const q = {
		"from": 0,
		"size": 0,
		"_source": [metricField, "container.id"],
		"query": {
			"bool": {
				"must": [{
					"exists": {
						"field": metricField
					}
				}],
				"filter": [{
					"range": {
						"@timestamp": {
							"gte": `now-${samplePeriod}m/s`
						}
					}
				}]
			}
		},
		"aggs": {
			"group_by_containerid": {
				"terms": {
					"field": "container.id.keyword",
					"size": 10
				},
				"aggs": {
					"min_count": {
						"min": {
							"field": `${metricField}.count`
						}
					},
					"max_count": {
						"max": {
							"field": `${metricField}.count`
						}
					}
				}
			}
		}
	};

	let result = null;
	let qex = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { totalTxn } = health;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let totalTxnCount = 0;
	if (result === null) {
		status = {
			ok: false,
			"message": `${totalTxn.unableToFetch} ${feedId}`,
			"details": {
				"err": qex
			}
		};
	}
	else if (!(result.aggregations.group_by_containerid.buckets.length > 0)) {
		status = {
			ok: false,
			"message": `${totalTxn.noCurrentFeed} ${feedId}`,
			"details": {
				"suggestion": totalTxn.metricBeatCheck
			}
		};
	}
	else {
		// -- get sum of all feed counts for each process instance (container)
		const containerBuckets = result.aggregations.group_by_containerid.buckets;
		for (const bucket of containerBuckets) {
			totalTxnCount += (bucket.max_count.value - bucket.min_count.value);
		}

		if (totalTxnCount < minCount) {
			status = {
				ok: false,
				"message": `${health.feed} ${feedId} ${totalTxn.totalTxnsCount} ${totalTxnCount} ${totalTxn.inLast} ${samplePeriod} ${totalTxn.minsDropped} ${minCount}`
			};
		}
	}

	if (status.ok) {
		status["message"] = `${health.feed} ${feedId} ${totalTxn.totalTxnCount} ${totalTxnCount} ${totalTxn.inLast} ${samplePeriod} ${totalTxn.minsAbove} ${minCount}`;
	}

	const check = {
		"id": `ecosystem-feed-total-transactions-${feedId}`,
		"name": `${health.feed} ${feedId} ${totalTxn.min} ${minCount} ${totalTxn.txnsInLast} ${samplePeriod} ${totalTxn.mins}`,
		"desc": `${health.feed} ${feedId} ${totalTxn.mustProcess} ${minCount} ${totalTxn.txnsInLast} ${samplePeriod} ${totalTxn.mins}`,
		"value": totalTxnCount,
		"displayValue": `${totalTxnCount} ${totalTxn.transactions}`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getFeedLatencyCheck(feedId, samplePeriod, maxLatency) {
	const metricName = `external-system-processor-track-latency-${feedId}`;
	const metricField = `data.stats.${metricName}`;
	// get avg, min and max latency across all containers for a specified feed in a specified sample period
	const q = {
		"from": 0,
		"size": 0,
		"_source": [metricField, "container.id"],
		"query": {
			"bool": {
				"must": [{
					"exists": {
						"field": metricField
					}
				}],
				"filter": [{
					"range": {
						"@timestamp": {
							"gte": `now-${samplePeriod}m/s`
						}
					}
				}]
			}
		},
		"aggs": {
			"avg_latency": {
				"avg": {
					"field": `${metricField}.mean`
				}
			},
			"min_latency": {
				"min": {
					"field": `${metricField}.min`
				}
			},
			"max_latency": {
				"max": {
					"field": `${metricField}.max`
				}
			}
		}
	};

	let result = null;
	let qex = null;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let avgLatency = -1;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { feedLatency } = health;
	if (result === null) {
		status = {
			ok: false,
			"message": `${feedLatency.unableToFetch} ${feedId}`,
			"details": {
				"err": qex
			}
		};
	}
	else if (!(result.hits.total.value > 0)) {
		status = {
			ok: false,
			"message": `${feedLatency.noCurrentLatency} ${feedId}`,
			"details": {
				"suggestion": feedLatency.metricBeatCheck
			}
		};
	}
	else {
		avgLatency = Math.round(result.aggregations.avg_latency.value);
		if (avgLatency > maxLatency) {
			status = {
				ok: false,
				"message": `${health.feed} ${feedId} ${feedLatency.avgLatencyOf} ${avgLatency}${feedLatency.msOverLast} ${samplePeriod} ${feedLatency.minsClimbed} ${maxLatency}${feedLatency.ms}`
			};
		}
	}

	if (status.ok) {
		status["message"] = `${health.feed} ${feedId} ${feedLatency.avgLatencyOf} ${avgLatency}${feedLatency.msOverLast} ${samplePeriod} ${feedLatency.minsBelow} ${maxLatency}${feedLatency.ms}`;
	}

	const check = {
		"id": `ecosystem-feed-average-latency-${feedId}`,
		"name": `${health.feed} ${feedId} ${feedLatency.avgLatencyLast} ${samplePeriod} ${feedLatency.minsForFeed} ${feedId}`,
		"desc": `${health.feed} ${feedId} ${feedLatency.avgLatInLast} ${samplePeriod} ${feedLatency.minsToStay} ${maxLatency}${feedLatency.msForFeed} ${feedId}`,
		"value": avgLatency,
		"displayValue": `${avgLatency}${feedLatency.ms}`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;

}

async function getCPUCheck(hostname) {
	// -- from metricbeat cpu - https://www.elastic.co/guide/en/beats/metricbeat/current/exported-fields-system.html
	// -- take total system + user cpu and divide by number of cores to get overall percentage
	const q = {
		"from": 0,
		"size": 1,
		"query": {
			"bool": {
				"must": {
					"match": { "agent.hostname": hostname }
				},
				"filter": [
					{ "term": { "event.module": "system" } },
					{ "term": { "metricset.name": "cpu" } },
					{ "range": { "@timestamp": { "gte": `now-${METRIC_SAMPLE_PERIOD}m/s` } } }
				]
			}
		},
		"sort": [{ "@timestamp": { "order": "desc" } }],
		"aggs": {
			"avg_system_cpu": {
				"avg": { "field": "system.cpu.system.pct" }
			},
			"avg_user_cpu": {
				"avg": { "field": "system.cpu.user.pct" }
			}
		}
	};

	let result = null;
	let qex = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { cpu } = health;
	try {
		result = await client.search({
			index: "metricbeat-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let cores = 1;
	let avgTotalCPU = 0;
	if (result === null) {
		status = {
			ok: false,
			"message": cpu.unableToFetchCPU,
			"details": {
				"host": hostname,
				"ex": qex
			}
		};
	}
	else if (!(result.hits.hits.length > 0)) {
		status = {
			ok: false,
			"message": cpu.noCurrentStats,
			"details": {
				"host": hostname,
				"suggestion": health.metricbeatCheck
			}
		};
	}
	else {
		cores = result.hits.hits[0]._source.system.cpu.cores;
		avgTotalCPU = Math.round(((result.aggregations.avg_system_cpu.value + result.aggregations.avg_user_cpu.value) / cores) * 100);

		if (avgTotalCPU > CPU_THRESHOLD) {
			status = {
				ok: false,
				"message": `${cpu.averageCPUof} ${avgTotalCPU} ${cpu.overLast} ${METRIC_SAMPLE_PERIOD} ${cpu.minsExceedCPU} ${CPU_THRESHOLD}%`,
				"details": {
					"host": hostname
				}
			};
		}
	}

	if (status.ok) {
		status["message"] = `${cpu.averageCPUof} ${avgTotalCPU} ${cpu.overLast} ${METRIC_SAMPLE_PERIOD} ${cpu.minsBelowCPU} ${CPU_THRESHOLD}%`;
		status["details"] = { "host": hostname };
	}

	const check = {
		"id": `ecosystem-server-cpu-${hostname}`,
		"name": cpu.serverCPU,
		"desc": `${cpu.averageCPUover} ${METRIC_SAMPLE_PERIOD} ${health.minutes}`,
		"value": avgTotalCPU,
		"displayValue": `${avgTotalCPU}%`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;
}

async function getMemoryCheck(hostname) {

	const q = {
		"from": 0,
		"size": 1,
		"query": {
			"bool": {
				"must": {
					"match": { "agent.hostname": hostname }
				},
				"filter": [
					{ "term": { "event.module": "system" } },
					{ "term": { "metricset.name": "memory" } },
					{ "range": { "@timestamp": { "gte": `now-${METRIC_SAMPLE_PERIOD}m/s` } } }
				]
			}
		},
		"sort": [{ "@timestamp": { "order": "desc" } }],
		"aggs": {
			"avg_actual_memory": {
				"avg": { "field": "system.memory.actual.used.pct" }
			},
			"avg_swap_memory": {
				"avg": { "field": "system.memory.swap.used.pct" }
			}
		}
	};

	let result = null;
	let qex = null;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { memory } = health;
	try {
		result = await client.search({
			index: "metricbeat-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let avgActualMemory = 0;
	if (result === null) {
		status = {
			ok: false,
			"message": memory.unableToFetchMemory,
			"details": {
				"host": hostname,
				"ex": qex
			}
		};
	}
	else if (!(result.hits.hits.length > 0)) {
		status = {
			ok: false,
			"message": memory.noCurrentMemmory,
			"details": {
				"host": hostname,
				"suggestion": health.metricbeatCheck
			}
		};
	}
	else {
		avgActualMemory = Math.round(result.aggregations.avg_actual_memory.value * 100);
		if (avgActualMemory > MEMORY_THRESHOLD) {
			status = {
				ok: false,
				"message": `${memory.currentMemoryOf} ${avgActualMemory}% ${memory.averagedOver} ${METRIC_SAMPLE_PERIOD} ${memory.minsExceedThreshold} ${MEMORY_THRESHOLD}%`,
				"details": {
					"host": hostname
				}
			};
		}
	}

	if (status.ok) {
		status["message"] = `${memory.currentMemoryOf} ${avgActualMemory}% ${memory.averagedOver} ${METRIC_SAMPLE_PERIOD} ${memory.minsBelowThreshold} ${MEMORY_THRESHOLD}%`;
		status["details"] = { "host": hostname };
	}

	const check = {
		"id": `ecosystem-server-memory-${hostname}`,
		"name": memory.serverMemory,
		"desc": `${avgMemoryOver} ${METRIC_SAMPLE_PERIOD} ${health.minutes}`,
		"value": avgActualMemory,
		"displayValue": `${avgActualMemory}%`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;
}

async function getFileSystemCheck(hostname, mountPoint) {

	const q = {
		"from": 0,
		"size": 1,
		"query": {
			"bool": {
				"must": [
					{ "match": { "agent.hostname": hostname } },
					{ "match": { "system.filesystem.mount_point": mountPoint } }
				],
				"filter": [
					{ "term": { "event.module": "system" } },
					{ "term": { "metricset.name": "filesystem" } },
					{ "range": { "@timestamp": { "gte": `now-${METRIC_SAMPLE_PERIOD}m/s` } } }
				]
			}
		},
		"sort": [{ "@timestamp": { "order": "desc" } }]
	};

	let result = null;
	let qex = null;
	try {
		result = await client.search({
			index: "metricbeat-*",
			body: q
		});
	}
	catch (ex) {
		console.log("unhandled exception", ex);
		qex = ex;
	}

	let status = { ok: true };
	let percentDiskUtilized = 0;
	const translations = await geti18n(app.appRequest, locale);
	const { health } = translations.ecosystem;
	const { fileSystem } = health;
	if (result === null) {
		status = {
			ok: false,
			"message": fileSystem.unableTofetchFile,
			"details": {
				"host": hostname,
				"ex": qex
			}
		};
	}
	else if (!(result.hits.hits.length > 0)) {
		status = {
			ok: false,
			"message": fileSystem.noCurrentFileSystem,
			"details": {
				"host": hostname,
				"suggestion": health.metricbeatCheck
			}
		};
	}
	else {
		percentDiskUtilized = Math.round(result.hits.hits[0]._source.system.filesystem.used.pct * 100);
		if (percentDiskUtilized > DISK_THRESHOLD) {
			status = {
				ok: false,
				"message": `${fileSystem.diskUtilsOf} ${percentDiskUtilized}% ${fileSystem.exceedsThresholdOf} ${DISK_THRESHOLD}%`,
				"details": {
					"host": hostname
				}
			};
		}
	}

	if (status.ok) {
		status["message"] = `${fileSystem.diskUtilsOf} ${percentDiskUtilized}% ${fileSystem.belowThreshold} ${DISK_THRESHOLD}%`;
		status["details"] = { "host": hostname };
	}

	const check = {
		"id": `ecosystem-server-filesystem-${hostname}`,
		"name": fileSystem.serverFileSystem,
		"desc": fileSystem.lastReportedDisk,
		"value": percentDiskUtilized,
		"displayValue": `${percentDiskUtilized}%`,
		"status": status,
		"lastUpdated": new Date().toISOString(),
		"essential": false
	};

	return check;
}