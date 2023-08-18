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
		global.testData = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		"core-system": {
			"label": "Core System",
			"type": "core-system",
			"systems": [{
				"label": "Ecosystem/Core",
				"alwaysShow": false,
				"checks": [{
					"id": "ecosystem-app-instance-availability",
					"name": "Ecosystem Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.651Z"
				}, {
					"id": "external-system-processor-process-instance-availability",
					"name": "External System Entity Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.655Z"
				}, {
					"id": "shape-activity-generator-process-instance-availability",
					"name": "Shape Activity Generator",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.653Z"
				}]
			}, {
				"label": "Databases",
				"alwaysShow": false,
				"checks": [{
					"id": "ecosystem-rethinkdb-availability",
					"name": "RethinkDB Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.668Z"
				}, {
					"id": "ecosystem-elasticsearch-availability",
					"name": "Elasticsearch Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.670Z"
				}]
			}]
		},
		"feeds": {
			"label": "My Feeds",
			"type": "feeds",
			"systems": [{
				"label": "aishub",
				"alwaysShow": true,
				"checks": [{
					"id": "ecosystem-feed-total-transactions-aishub",
					"name": "Feed aishub minimum 1 txn(s) in the last 5 minutes",
					"status": {
						"ok": true,
						"message": "Feed aishub total transaction count of 1064 in last 5 minutes is above allowed minimum of 1"
					},
					"lastUpdated": "2019-09-04T18:04:30.697Z"
				}]
			}]
		},
		"apps": {
			"label": "My Apps",
			"type": "my-apps",
			"systems": [{
				"label": "Berth Schedule App",
				"appId": "berth-schedule-app",
				"alwaysShow": false,
				"checks": [{
					"id": "berth-schedule-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.649Z"
				}, {
					"id": "vessel-berthing-event-processor-process-instance-availability",
					"name": "Berthing Event Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.653Z"
				}, {
					"id": "berth-request-app-app-instance-availability",
					"name": "Agent Portal Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.658Z"
				}]
			}, {
				"label": "Map App",
				"appId": "map-id",
				"alwaysShow": false,
				"checks": [{
					"id": "mapgl-app-app-instance-availability",
					"name": "App Availability"
				}, {
					"id": "gis-app-app-instance-availability",
					"name": "GIS Service Availability"
				}]
			}, {
				"label": "Lists App",
				"appId": "lists-app",
				"alwaysShow": false,
				"checks": [{
					"id": "lists-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.642Z"
				}]
			}, {
				"label": "Events App",
				"appId": "events-app",
				"alwaysShow": false,
				"checks": [{
					"id": "events-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.649Z"
				}]
			}, {
				"label": "Cameras App",
				"appId": "cameras-app",
				"alwaysShow": false,
				"checks": [{
					"id": "cameras-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.631Z"
				}, {
					"id": "slew-lock-manager-process-instance-availability",
					"name": "Slew Lock Manager",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.633Z"
				}]
			}, {
				"label": "Settings App",
				"appId": "settings-app",
				"alwaysShow": false,
				"checks": [{
					"id": "settings-app-app-instance-availability",
					"name": "App Availability"
				}]
			}, {
				"label": "Camera Wall App",
				"appId": "camera-wall-app",
				"alwaysShow": false,
				"checks": [{
					"id": "camera-wall-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.636Z"
				}]
			}, {
				"label": "Law Enforcement Search App",
				"appId": "law-enforcement-search-app",
				"alwaysShow": false,
				"checks": [{
					"id": "law-enforcement-search-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.645Z"
				}]
			}, {
				"label": "Reports App",
				"appId": "reports-app",
				"alwaysShow": false,
				"checks": [{
					"id": "reports-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.639Z"
				}, {
					"id": "zone-activity-process-instance-availability",
					"name": "Zone Activity Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.648Z"
				}, {
					"id": "tripwire-activity-process-instance-availability",
					"name": "Tripwire Activity Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.660Z"
				}, {
					"id": "dwell-time-process-instance-availability",
					"name": "Dwell Time Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.662Z"
				}, {
					"id": "feed-history-process-instance-availability",
					"name": "Feed History Processor",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.664Z"
				}]
			}, {
				"label": "Rules App",
				"appId": "rules-app",
				"alwaysShow": false,
				"checks": [{
					"id": "rules-app-app-instance-availability",
					"name": "App Availability",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.631Z"
				}, {
					"id": "rule-analyzer-process-instance-availability",
					"name": "Rule Analyzer",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.633Z"
				}, {
					"id": "loiter-activity-generator-process-instance-availability",
					"name": "Loiter Activity Generator",
					"status": {
						"ok": true
					},
					"lastUpdated": "2019-09-04T18:04:30.678Z"
				}]
			}]
		},
		"server-health": {
			"label": "Server Health",
			"type": "server-health",
			"systems": [{
				"label": "CB2 Demo1",
				"alwaysShow": true,
				"checks": [{
					"id": "ecosystem-server-cpu-CB2-Demo1",
					"name": "Server CPU",
					"status": {
						"ok": true,
						"message": "Average CPU of 13 over last 5 minutes is below CPU threshold of 50%",
						"details": {
							"host": "CB2-Demo1"
						}
					},
					"lastUpdated": "2019-09-04T18:04:30.678Z"
				}, {
					"id": "ecosystem-server-memory-CB2-Demo1",
					"name": "Server Memory",
					"status": {
						"ok": false,
						"message": "Current memory usage of 62% averaged over last 5 minutes exceed threshold of 50%",
						"details": {
							"host": "CB2-Demo1"
						}
					},
					"lastUpdated": "2019-09-04T18:04:30.682Z"
				}, {
					"id": "ecosystem-server-filesystem-CB2-Demo1",
					"name": "Server Filesystem",
					"status": {
						"ok": false,
						"message": "Disk utilization of 72% exceeds threshold of 40%",
						"details": {
							"host": "CB2-Demo1"
						}
					},
					"lastUpdated": "2019-09-04T18:04:30.686Z"
				}]
			}]
		}
	};
});