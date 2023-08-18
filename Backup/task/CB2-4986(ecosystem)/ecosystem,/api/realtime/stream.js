const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/realtime/stream.js");

const userModel = require("../../models/userModel")({});
const entityCollectionModel = require("../../models/entityCollectionModel")({});
const notificationModel = require("../../models/notificationModel")({});
const dailyBriefModel = require("../../models/dailyBriefModel")({});
const cameraGroupsModel = require("../../models/cameraGroupModel")({});
const cameraContextModel = require("../../models/cameraContextModel")();
const authExclusionModel = require("../../models/authExclusionModel")({}); 
const userPolicyCache = new (require("../../lib/userPolicyCache"));
const feedMiddleware = new (require("../../logic/feed")); 
const activityMiddleware = new (require("../../logic/activity")); 
const attachmentMiddleware = new (require("../../logic/attachment")); 
const eventMiddleware = new (require("../../logic/events")); 
const listMiddleware = new (require("../../logic/list")); 

module.exports = function(app) {

	const realtimeServer = app.realtime;

	realtimeServer.pubsub("/users", async function(sub) {
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "disabled":
				try {
					const result = await userModel.streamDisabled(
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});	
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});

	realtimeServer.pubsub("/attachments", function(sub) {
		attachmentMiddleware.streamAttachments(sub);
	});

	realtimeServer.pubsub("/events", function(sub) {
		eventMiddleware.streamEvents(sub);
	});

	realtimeServer.pubsub("/eventEntities", function(sub) {
		eventMiddleware.streamEventEntities(sub);
	});


	realtimeServer.pubsub("/entityCollections", async function(sub) {
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "all":
				try {
					const result = await entityCollectionModel.streamAll(
						sub.args.appId,
						sub.identity.userId,
						sub.identity.orgId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});	
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});

	realtimeServer.pubsub("/entity", function(sub) {
		feedMiddleware.streamEntity(sub);
	});

	realtimeServer.pubsub("/feedEntities", async function(sub) {
		feedMiddleware.streamFeedEntities(sub);
	});


	realtimeServer.pubsub("/activities", function(sub) {
		activityMiddleware.streamActivities(sub);
	});

	realtimeServer.pubsub("/notifications", async function(sub) {
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "active-by-user":
				try {
					const result = await notificationModel.streamActiveByUser(
						sub.args.userId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});	
					const cancelFn = result;
					if (cancelFn) {
						sub.events.on("disconnect", () => {
							cancelFn();
						});
					}
				} catch (err) {
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});

	realtimeServer.pubsub("/userIntegration", async function(sub) {
		const filterType = sub.args.filterType;

		switch(filterType.toLowerCase()) {
			case "initial-by-feed":
				try {
					const result = await userModel.checkIntegration(
						sub.identity.userId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err);
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType});
		}
	});

	realtimeServer.pubsub("/userAppIntegration", async function(sub) {
		const { filterType, appId } = sub.args;

		switch(filterType.toLowerCase()) {
			case "initial-by-feed":
				try {
					const result = await userModel.checkAppIntegration(
						sub.identity.userId,
						appId,
						function(err, record) {
							if (err) {
								logger.error(
									"checkAppIntegration",
									"An error occurred while checking user application integrations", 
									{ err: { message: err.message, code: err.code } }
								);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err);
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType});
		}
	});

	realtimeServer.pubsub("/list", function (sub) {
		listMiddleware.streamLists(sub);
	});

	realtimeServer.pubsub("/listCategories", function(sub) {
		listMiddleware.streamListCategories(sub);
	});

	realtimeServer.pubsub("/dailybrief", async function(sub) {
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "by-org":
				try {
					const result = await dailyBriefModel.streamByOrg(
						sub.identity.orgId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});

	realtimeServer.pubsub("/cameraGroups", async function (sub) {
		const filterType = sub.args.filterType;
		switch (filterType.toLowerCase()) {
			case "all":
				try {
					const result = await cameraGroupsModel.streamCameraGroups(
						sub.identity.userId,
						sub.identity.orgId,
						function (err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});	
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({
					"msg": "invalid action: " + filterType.toLowerCase()
				});
		}
	});

	realtimeServer.pubsub("/cameraContexts", async function (sub) {
		try {
			const result = await cameraContextModel.streamCameraContexts(
				sub.identity.userId,
				sub.identity.orgId,
				sub.args.entityId,
				sub.args.entityType,
				function (err, record) {
					if (err) {
						console.log(err);
					}
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (err) {
			sub.pub(err); // -- need standard method for publishing errors
		}
	});
	
	realtimeServer.pubsub("/exclusion", async function(sub) {
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "by-user":
				try {
					const result = await authExclusionModel.streamExclusionsByUser(
						sub.identity.userId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err);
				}				
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});

	realtimeServer.pubsub("/userPolicyCache", function(sub) {
		
		const publish = function(data) {
			sub.pub(data);
		};

		const initialCache = { 
			type: "initial",
			change: userPolicyCache.getAllCachedData()
		};

		publish(initialCache);

		userPolicyCache.events.on("change", publish);

		sub.events.on("disconnect", () => {
			userPolicyCache.events.removeListener("change", publish);
		});

	});

	// TODO: Possibly add authorization for GCF feeds - these are used eco level so presents an issue. Currently just let consumption authorization do it's thing
	//       Possible side effect of generating activities that no one is authorized to see, maybe others.
	// TODO: DO NEED TO ENSURE ONLY FORWARDING ENTITIES WHERE THERE ARE SHARED FEEDS IN THE ECO
	// specifically for remote eco consumption
	// todo tag @@sourceEcoId
	realtimeServer.pubsub("/authorizedGCF", function(sub) {
		
		const publish = function(change, subject) {
			sub.pub(change);
		};

		// get org feeds that are shared to remote
		// sub.args.remoteEcoId

		//  todo unsub, return function to unsub from nats in NAC Globalchangefeed
		const sid = app.globalChangefeed.subscribe({ entityType: "*" }, "ecosystem.realtime-stream", function(change, subject) {
			publish(change, subject);
		});

		//publish( { "success": true, sid: sid } );

		sub.events.on("disconnect", () => {
			// need a way to cancel a gcf, it should return canceFn
		});

	});


};
