// need to determine how to handle feeds that require sequential data, if an update fails I assume the show must go on. Maybe somehow indicate on the entity there was an update
// that wouldn't work, rather that currently the event could be out of sync with the source until it receives next successful update.  
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/process/externalSystemProcessor.js");
const feedModel = require("../models/feedModel")();
const eventModel = require("../models/eventModel")();
const activityModel = require("../models/activityModel")();
const externalSysModel = require("../models/externalSystemModel")();
const extEntMappingModel = require("../models/externalEntityMappingModel")();

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rethink connection/db

const proc = require("node-app-core").process("external-system-processor", {});
const timestampMetric = require("node-app-core").timestampMetric();

// -- required references in imported classes - will be going away by adding app/process to global namespace in node-app-core
const global = require("../app-global.js");
global.globalChangefeed = proc.globalChangefeed;
global.logger = proc.logger;
global.appRequest = proc.appRequest;

const activeFeedIds = [];
let latencyResetHandle = null;
const LATENCY_METRIC_RESET_INTERVAL = process.env.LATENCY_METRIC_RESET_INTERVAL || 10000; 

const _health = {
	status: 1,
	metrics: {
	}
};

let trackBatchProcHandle = null;
let trackBatch = [];
const TRACK_BATCH_PROC_INTERVAL = process.env.TRACK_BATCH_PROC_INTERVAL || 1000; 

proc.initialize = function(args) {
	try {
		args.subscriptions.forEach((subscription) => {
			// -- I can use NATS streaming for tracks just don't use durable subscription and opts.setStartWithLastReceived();
			// if(subscription.persistent) {
			const subscriptionType = proc.globalChangefeed.constructor.SUBSCRIPTION_TYPES[subscription.type];
			if(subscriptionType !== undefined) {
				proc.globalChangefeed.subscribePersistent(subscription.entityType, processExternalEntity, subscriptionType);
				_health.metrics[subscription.entityType] = { success: 0, fail: 0 };
				proc.status(`Created ${subscription.type} subscription for entity type ${subscription.entityType}`);
			}
			else {
				proc.fail(`subscription type not defined ${subscription.type}`); 
			}
			// }
			// else {
			// 	// -- This has a different signature and therefore would need a different handler
			// 	proc.globalChangefeed.subscribe({ entityType: subscription.entityType }, `ecosystem.external-system-processor.${subscription.entityType}`, processExternalEntity);
			// }
		});
		initLatencyResetInterval();
		initTrackBatchProcessor();
		proc.status("External system processor initialized");
	}
	catch(e) {
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	if(latencyResetHandle) clearInterval(latencyResetHandle);
	if(trackBatchProcHandle) clearInterval(trackBatchProcHandle);
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	_health.metrics["poolLength"] = r.getPool().getLength();
	return _health;
};

function tryAddActiveFeedId(feedId) {
	if(activeFeedIds.indexOf(feedId) === -1) {
		activeFeedIds.push(feedId);
	}
}

function initLatencyResetInterval() {
	latencyResetHandle = setInterval(() => {
		for(const feedId of activeFeedIds) {
			proc.metricReporter.histogram("external-system-processor-track-latency-" + feedId).reset();
		}
	}, LATENCY_METRIC_RESET_INTERVAL);
}

function initTrackBatchProcessor() {
	trackBatchProcHandle = setInterval(() => {
		const trackBatchCopy = [...trackBatch];
		trackBatch = [];
		feedModel.bulkUpsertEntities(trackBatchCopy);
	}, TRACK_BATCH_PROC_INTERVAL);
}

// -- TODO: handle redeliveries -  depends on types - if sequential is required then it just needs to be logged and notified anything else we can retry but then would need to track how many attempts, 
//          etc. so maybe not or leverage a queue. In fact might want to consider using queues instead of GCF because they handle that already and don't really need GCF
// -- TODO: handle when have to manual ack and when NOT manual ack - or just require manual ack across the board
async function processExternalEntity(change, entityType, msg) {
	const span = proc.tracer.startSpan("external-system-processor");
	try {
		const valResult = validateChange(change);
		if(!valResult.success) {
			span.log({ 
				event: "error", 
				reason: `Process external system entity failed validation: ${valResult.reason}`
			});
			span.finish();
			processFailure(entityType, change, valResult.reason);
			return;
		}
		// -- get external system
		const extSysId = change.new_val.extSysId;
		const extSys = await getExternalSystem(extSysId);
		// -- process based on type
		let result = null;
		switch(entityType) {
			case "external_event":
				result = await processEvent(extSys, change);
				msg.ack();
				break;
			case "external_activity":
				result = await processActivity(change);
				break;
			case "external_notification":
				result = { "success": false, "reason": "not yet implemented for external_notification" };
				break;
			case "track":
				result = await processTrack(extSys, change);
				break;
		}
		if(result.success) {
			_health.metrics[entityType].success++;
		}
		else {
			processFailure(entityType, change, result.reason);
		}
		span.finish();
	}
	catch (ex) {
		span.log({ 
			event: "error", 
			reason: `Process external system entity failed: ${ex.message}`
		});
		processFailure(entityType, change, ex.message);
		span.finish();
		logger.error("processExternalEntity", "Error processing feed item", { err: ex.message });
	}
}

function validateChange(change) {
	// -- validate
	if(!change.new_val.extSysId) {
		return { "success": false, "reason": "no external system id is included in change" };
	}
	if(!change.new_val.entityData) {
		return { "success": false, "reason": "no entityData is included in change" };
	}
	if(!change.new_val.sourceId) {
		return { "success": false, "reason": "no sourceId is included in change" };
	}
	return { "success": true };
}

function processFailure(entityType, change, message) {
	_health.metrics[entityType].fail++;
	_health.metrics[entityType]["failedReason"] = message;
	_health.metrics[entityType]["failedChange"] = change;
	_health.metrics[entityType]["failedTime"] = new Date();
}

const extSysCache = {};
async function getExternalSystem(extSysId) {
	if(!extSysCache[extSysId]) {
		try {
			const extSys = await externalSysModel.getByIdUnauth(extSysId);
			extSysCache[extSysId] = extSys;
		}
		catch(ex) {
			logger.error("processFailure", "Error attempting to fetch external system", { err: ex });
			throw { message: "err getting external system", innerEx: ex };
		}
	}
	return extSysCache[extSysId];
}

async function processEvent(extSys, change) {
	const eventData = change.new_val.entityData;
	const addlProps = { ...eventData.additionalProperties };
	const sourceId = change.new_val.sourceId;

	try {
		const mapping = await extEntMappingModel.getBySourceId(sourceId, null);
		if(mapping) { // update
		// -- update handles addl props update as well, why not same for create???
			await eventModel.update(extSys.identity.userId, mapping.targetId, eventData);
		}
		else { // create
			delete eventData.additionalProperties;
			const event = await eventModel.create(extSys.identity.userId, extSys.identity.orgId, eventData);
			const mapProps = {
				targetId: event.id,
				targetType: "event",
				sourceId: sourceId,
				additionalProperties: addlProps
			};
			await extEntMappingModel.upsert(null, null, mapProps);
		// -- fitz did a subsequent update to add event id to entityData.properties. Whaaaaaat?!??!
		// -- since this appears to be a requirement why isn't it added in create method? More importantly,
		// -- why is it required?
		}
	}
	catch(ex) {
		return { "success": false, "reason": ex.message };
	}
	return { "success": true };
}

async function processTrack(extSys, change) {
	const span = proc.tracer.startSpan("process-track");
	let success = false;
	try {
		proc.metricReporter.meter("external-system-processor-track-recvd-" + extSys.config.feedId).mark();
		// -- only process realtime for UI updates
		if(change.rt) {
			const parsedMsg = timestampMetric.addTimestamp(change.new_val, timestampMetric.types().DB_UPSERT);
			proc.metricReporter.histogram("external-system-processor-track-latency-" + extSys.config.feedId).update(parsedMsg.latencyTimestamps.integrationLatency);
			tryAddActiveFeedId(extSys.config.feedId);

			span.log({ event: "feed-entity-upsert", feedId: extSys.config.feedId });
			// const result = await feedModel.upsertEntity(extSys.config.feedId, parsedMsg.id, parsedMsg.entityData, parsedMsg.latencyTimestamps.EDGE_RECEIVED, parsedMsg.latencyTimestamps);
			// success = result.success;
			trackBatch.push({
				feedId: extSys.config.feedId,
				id: parsedMsg.id,
				entity: parsedMsg.entityData,
				acquisitionTime: parsedMsg.latencyTimestamps.EDGE_RECEIVED,
				latencyTimestamps: parsedMsg.latencyTimestamps
			});
			success = true;
		}
		else {
			span.log({ event: "feed-entity-skip", feedId: extSys.config.feedId });
			success = true;
		}
	}
	catch (ex) {
		span.log({ 
			event: "error", 
			reason: `Process Track failed: ${ex.message}`
		});
		success = false;
	}
	span.finish();
	return { "success": success };
}

// -- currently no need for external sys
async function processActivity(change) {
	try {
		const result = await activityModel.queueActivity(change.new_val.entityData, "integration-app");
		return { "success": true };
	}
	catch (ex) {
		return { "success": false, "reason": ex.message };
	}
}