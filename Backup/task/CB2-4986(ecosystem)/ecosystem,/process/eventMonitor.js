"use strict";
const EVENT_TABLE = "sys_event";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const eventModel = require("../models/eventModel")();

const defaultPollFreq = 5000; //ms
let handle = null;
const _health = {
	status: 1,
	config: {
		pollFrequency: defaultPollFreq
	},
	metrics: {
		totalActivated: 0,
		lastActivateBatch: [],
		totalDeactivated: 0,
		lastDeactivateBatch: []
	}
};

const proc = require("node-app-core").process("event-monitor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});

require("../app-global.js").globalChangefeed = proc.globalChangefeed;

proc.initialize = function(args) {
	_health.config.pollFrequency = args.pollFreq || defaultPollFreq;
	try {
		handle = setInterval(evaluateEventStatus, _health.config.pollFrequency);
		proc.status("Started event monitor");
	}
	catch(e) {
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	clearInterval(handle);
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	return _health;
};

async function evaluateEventStatus() {

	try {
		const activateEvents = await r.table(EVENT_TABLE)
			.filter(r.and(
				r.row("isActive").eq(false).default(true),
				r.row("startDate").lt(r.now()),
				r.row("endDate").gt(r.now()).default(true)
			));


		const deactivateEvents = await r.table(EVENT_TABLE)
			.filter(
				r.or(
					r.and(
						r.row("isActive").eq(true).default(true),
						r.row("endDate").lt(r.now()).default(false)
					),
					r.and(
						r.row("isActive").eq(true).default(true),
						r.row("startDate").gt(r.now())
					)
				)
			);
		
		if(activateEvents.length > 0) {
			_health.metrics.lastActivateBatch = [];
			for(const activateEvent of activateEvents) {
				await eventModel.setActiveStatus(activateEvent.id, true);
				_health.metrics.lastActivateBatch.push(activateEvent);
				_health.metrics.totalActivated++;
			}
		}

		if(deactivateEvents.length > 0) {
			_health.metrics.lastDeactivateBatch = [];
			for(const deactivateEvent of deactivateEvents) {
				await eventModel.setActiveStatus(deactivateEvent.id, false);
				_health.metrics.lastDeactivateBatch.push(deactivateEvent);
				_health.metrics.totalDeactivated++;
			}
		}
	}
	catch(err) {
		proc.fail(err.message, err);
	}

}