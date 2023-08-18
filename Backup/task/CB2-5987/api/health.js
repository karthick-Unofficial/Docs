const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("reports-app", "/api/health.js");
const esReqTimeout = process.env.ES_REQ_TIMEOUT ? parseInt(process.env.ES_REQ_TIMEOUT) : 2000;
const esProvider = require("../lib/es-provider");
const client = esProvider.get({ requestTimeout: esReqTimeout });
const _global = require("node-app-core/dist/app-global.js");

module.exports = function (app) {
	app._getHealthChecks = async function () {
		const translations = await _global.geti18n();
		const healthChecks = [];

		const samplePeriod = process.env.FEED_HISTORY_COLLECTOR_RATE_SAMPLE_PERIOD || 5;
		const minRate = process.env.FEED_HISTORY_COLLECTOR_RATE_MIN_RATE || 1;
		healthChecks.push(await getMinTransactionRateCheck(samplePeriod, minRate, app, translations));
		return healthChecks;
	};
};

async function getMinTransactionRateCheck(samplePeriod, minRate, app, translations) {
	const metricName = "feed-history-collector-ent-recvd";
	const metricField = `data.stats.${metricName}`;
	const q = {
		from: 0,
		size: 20,
		_source: [metricField, "container.id"],
		query: {
			bool: {
				must: [{ exists: { field: metricField } }],
				filter: [
					{
						range: {
							"@timestamp": { gte: `now-${samplePeriod}m/s` }
						}
					}
				]
			}
		},
		sort: [{ "@timestamp": { order: "desc" } }]
	};

	let result = null;
	let qex = null;
	const { health } = translations["reports-app"];
	const { transRateCheck } = health;
	try {
		result = await client.search({
			index: "metric-logs-*",
			body: q
		});
	} catch (err) {
		logger.error("getMinTransactionRateCheck", "Unexpected exception running metrics query", {
			err: { message: err.message, stack: err.stack }
		});
		qex = err;
	}
	let status = { ok: true };
	let currentRate = 0;
	if (result === null) {
		status = {
			ok: false,
			message: `${transRateCheck.unableToFetch}`,
			details: {
				err: { err: { message: qex.message, stack: qex.stack } }
			}
		};
	} else if (!(result.hits.total.value > 0)) {
		status = {
			ok: false,
			message: `${transRateCheck.noCurrentFeedsAvail}`,
			details: {
				suggestion: transRateCheck.metricBeatCheck
			}
		};
	} else {
		// -- aggregate currentRate for all unique instances of processors
		const metrics = result.hits.hits;
		const uniqueContainers = [];

		for (let i = 0; i < metrics.length; i++) {
			const cid = metrics[i]._source.container.id;
			if (uniqueContainers.indexOf(cid) === -1) {
				currentRate += metrics[i]._source.data.stats[metricName].currentRate;
				uniqueContainers.push(cid);
			}
		}

		currentRate = Math.round(currentRate);
		if (currentRate < minRate) {
			status = {
				ok: false,
				message: `${transRateCheck.currentTxnRateOf} ${currentRate}${transRateCheck.droppedBelow} ${minRate} ${transRateCheck.transPerSec}`
			};
		}
	}

	if (status.ok) {
		status[
			"message"
		] = `${transRateCheck.currentTxnRateOf} ${currentRate}${transRateCheck.transAbove} ${minRate} ${transRateCheck.transPerSec}`;
	}

	const check = {
		id: "feed-history-collector-txn-rate",
		name: `${transRateCheck.currentTxnRate}`,
		desc: `${transRateCheck.currentTxnPerSec}`,
		value: `${currentRate} ${transRateCheck.transPerSec}`,
		status: status,
		lastUpdated: new Date().toISOString(),
		essential: true
	};

	return check;
}
