const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/realtime/systemNotification.js");

const systemNotificationModel = require("../../models/systemNotificationModel")({});

module.exports = function(app) {

	const realtimeServer = app.realtime;

	realtimeServer.pubsub("/systemNotifications", async function(sub) {
		const filterType = sub.args.type;
		switch(filterType.toLowerCase()) {
			case "user":
				if (sub.args.userId) {
					try {
						const result = await systemNotificationModel.streamByUser(
							sub.args.userId,
							function(err, record) {
								if (err) {
									logger.error(
										"streamByUser",
										"There was an error streaming systemNotifications", 
										{ err: { message: err.message, code: err.code } }
									);
								}
								else {
									sub.pub(record);
								}
							});
						const cancelFn = result;
						sub.events.on("disconnect", () => {
							cancelFn();
						});
					} catch (reason) {
						sub.pub(reason);
					}
				}
				else {
					sub.pub({ "msg": "No userId provided for type: user" });
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	});
};
