(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.testDataTwo = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = [{
		"system": "gis-app",
		"checks": [{
			"id": "gis-app-app-instance-availability",
			"display": {
				"label": "Memory",
				"value": "62%",
				"group": "Sever Health",
				"system": "CB2-Demo1"
			},
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.639Z",
			"essential": true
		}],
		"id": "gis-app",
		"lastUpdated": "2019-09-04T18:04:30.642Z"
	}, {
		"system": "mapgl-app",
		"checks": [{
			"id": "mapgl-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.648Z",
			"essential": true
		}],
		"id": "mapgl-app",
		"lastUpdated": "2019-09-04T18:04:30.652Z"
	}, {
		"system": "berth-schedule-app",
		"checks": [{
			"id": "berth-schedule-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.649Z",
			"essential": true
		}, {
			"id": "vessel-berthing-event-processor-process-instance-availability",
			"name": "Vessel Berthing Event Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.653Z",
			"essential": true
		}],
		"id": "berth-schedule-app",
		"lastUpdated": "2019-09-04T18:04:30.654Z"
	}, {
		"system": "lists-app",
		"checks": [{
			"id": "lists-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.642Z",
			"essential": true
		}],
		"id": "lists-app",
		"lastUpdated": "2019-09-04T18:04:30.644Z"
	}, {
		"system": "events-app",
		"checks": [{
			"id": "events-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.649Z",
			"essential": true
		}],
		"id": "events-app",
		"lastUpdated": "2019-09-04T18:04:30.653Z"
	}, {
		"system": "cameras-app",
		"checks": [{
			"id": "cameras-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.631Z",
			"essential": true
		}, {
			"id": "slew-lock-manager-process-instance-availability",
			"name": "Slew Lock Manager Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.633Z",
			"essential": true
		}],
		"id": "cameras-app",
		"lastUpdated": "2019-09-04T18:04:30.640Z"
	}, {
		"system": "settings-app",
		"checks": [{
			"id": "settings-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.661Z",
			"essential": true
		}],
		"id": "settings-app",
		"lastUpdated": "2019-09-04T18:04:30.662Z"
	}, {
		"system": "camera-wall-app",
		"checks": [{
			"id": "camera-wall-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.636Z",
			"essential": true
		}],
		"id": "camera-wall-app",
		"lastUpdated": "2019-09-04T18:04:30.640Z"
	}, {
		"system": "edge-app",
		"checks": [{
			"id": "edge-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.649Z",
			"essential": true
		}, {
			"id": "gap-polling-client-process-instance-availability",
			"name": "GAP Polling Client Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.652Z",
			"essential": true
		}],
		"id": "edge-app",
		"lastUpdated": "2019-09-04T18:04:30.655Z"
	}, {
		"system": "law-enforcement-search-app",
		"checks": [{
			"id": "law-enforcement-search-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.645Z",
			"essential": true
		}],
		"id": "law-enforcement-search-app",
		"lastUpdated": "2019-09-04T18:04:30.652Z"
	}, {
		"system": "berth-request-app",
		"checks": [{
			"id": "berth-request-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.658Z",
			"essential": true
		}],
		"id": "berth-request-app",
		"lastUpdated": "2019-09-04T18:04:30.659Z"
	}, {
		"system": "reports-app",
		"checks": [{
			"id": "reports-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.639Z",
			"essential": true
		}, {
			"id": "zone-activity-process-instance-availability",
			"name": "Zone Activity Collector Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.648Z",
			"essential": true
		}, {
			"id": "tripwire-activity-process-instance-availability",
			"name": "Tripwire Activity Collector Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.660Z",
			"essential": true
		}, {
			"id": "dwell-time-process-instance-availability",
			"name": "Dwell Time Collector Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.662Z",
			"essential": true
		}, {
			"id": "feed-history-process-instance-availability",
			"name": "Feed History Collector Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.664Z",
			"essential": true
		}],
		"id": "reports-app",
		"lastUpdated": "2019-09-04T18:04:30.665Z"
	}, {
		"system": "rules-app",
		"checks": [{
			"id": "rules-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.631Z",
			"essential": true
		}, {
			"id": "rule-analyzer-process-instance-availability",
			"name": "Rule Analyzer Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.633Z",
			"essential": true
		}, {
			"id": "loiter-activity-generator-process-instance-availability",
			"name": "Loiter Activity Generator Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "2/2 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.678Z",
			"essential": true
		}],
		"id": "rules-app",
		"lastUpdated": "2019-09-04T18:04:30.679Z"
	}, {
		"system": "integration-app",
		"checks": [{
			"id": "integration-app-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.638Z",
			"essential": true
		}, {
			"id": "gap-transformer-process-instance-availability",
			"name": "GAP Transformer Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.643Z",
			"essential": true
		}],
		"id": "integration-app",
		"lastUpdated": "2019-09-04T18:04:30.651Z"
	}, {
		"system": "ecosystem",
		"checks": [{
			"id": "ecosystem-app-instance-availability",
			"name": "App Availability",
			"desc": "Confirms availability of expected application server instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.651Z",
			"essential": true
		}, {
			"id": "shape-activity-generator-process-instance-availability",
			"name": "Shape Activity Generator Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.653Z",
			"essential": true
		}, {
			"id": "external-system-processor-process-instance-availability",
			"name": "External System Entity Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.655Z",
			"essential": true
		}, {
			"id": "activity-processor-process-instance-availability",
			"name": "Activity Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.656Z",
			"essential": true
		}, {
			"id": "notification-processor-process-instance-availability",
			"name": "Notification Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.658Z",
			"essential": true
		}, {
			"id": "email-processor-process-instance-availability",
			"name": "Email Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.661Z",
			"essential": true
		}, {
			"id": "push-notification-processor-process-instance-availability",
			"name": "Push Notification Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.662Z",
			"essential": true
		}, {
			"id": "feed-monitor-process-instance-availability",
			"name": "Feed Monitor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.664Z",
			"essential": true
		}, {
			"id": "thumbnailer-process-instance-availability",
			"name": "Thumbnailer Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.665Z",
			"essential": true
		}, {
			"id": "user-sync-processor-process-instance-availability",
			"name": "User Sync Processor Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.667Z",
			"essential": true
		}, {
			"id": "camera-context-generator-process-instance-availability",
			"name": "Camera Context Generator Process Availability",
			"desc": "Confirms availability of expected process instances",
			"value": "1/1 instances available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.668Z",
			"essential": true
		}, {
			"id": "ecosystem-rethinkdb-availability",
			"name": "RethinkDB Availablility",
			"desc": "Indicates whether RethinkDB is available or not",
			"value": "available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.668Z",
			"essential": false
		}, {
			"id": "ecosystem-elasticsearch-availability",
			"name": "Elasticsearch Availablility",
			"desc": "Indicates whether elasticsearch is available or not",
			"value": "available",
			"status": {
				"ok": true
			},
			"lastUpdated": "2019-09-04T18:04:30.670Z",
			"essential": false
		}, {
			"id": "ecosystem-server-cpu-CB2-Demo1",
			"name": "Server CPU",
			"desc": "Avg CPU over last 5 minute(s)",
			"value": 13,
			"status": {
				"ok": true,
				"message": "Average CPU of 13 over last 5 minutes is below CPU threshold of 50%"
			},
			"lastUpdated": "2019-09-04T18:04:30.678Z",
			"essential": false
		}, {
			"id": "ecosystem-server-memory-CB2-Demo1",
			"name": "Server Memory",
			"desc": "Avg Memory over last 5 minute(s)",
			"value": 62,
			"status": {
				"ok": false,
				"message": "Current memory usage of 62% averaged over last 5 minutes exceed threshold of 50%",
				"details": {
					"host": "CB2-Demo1"
				}
			},
			"lastUpdated": "2019-09-04T18:04:30.682Z",
			"essential": false
		}, {
			"id": "ecosystem-server-filesystem-CB2-Demo1",
			"name": "Server Filesystem",
			"desc": "Last reported disk utilization",
			"value": 72,
			"status": {
				"ok": false,
				"message": "Disk utilization of 72% exceeds threshold of 40%",
				"details": {
					"host": "CB2-Demo1"
				}
			},
			"lastUpdated": "2019-09-04T18:04:30.686Z",
			"essential": false
		}, {
			"id": "ecosystem-feed-total-transactions-gap",
			"name": "Feed gap minimum 1 txn(s) in the last 5 minutes",
			"desc": "Feed gap must process at least 1 txn(s) in the last 5 minutes",
			"value": 1064,
			"status": {
				"ok": true,
				"message": "Feed gap total transaction count of 1064 in last 5 minutes is above allowed minimum of 1"
			},
			"lastUpdated": "2019-09-04T18:04:30.697Z",
			"essential": false
		}, {
			"id": "ecosystem-feed-average-latency-gap",
			"name": "Feed gap average latency last 2 minutes for feed gap",
			"desc": "Feed gap average latency in the last 2 minutes needs to stay below max latency of 5000ms for feed gap",
			"value": 21,
			"status": {
				"ok": true,
				"message": "Feed gap average latency of 21ms over last 2 minutes is below the allowed maximum of 5000ms"
			},
			"lastUpdated": "2019-09-04T18:04:30.706Z",
			"essential": false
		}],
		"id": "ecosystem",
		"lastUpdated": "2019-09-04T18:04:30.836Z"
	}];
});