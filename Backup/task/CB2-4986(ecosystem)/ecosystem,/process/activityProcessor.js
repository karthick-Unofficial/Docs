const activityModel = require("../models/activityModel")();
const notificationModel = require("../models/notificationModel")();

const proc = require("node-app-core").process("activity-processor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});
require("../app-global.js").globalChangefeed = proc.globalChangefeed;
const activityQueue = require("node-app-core").jobQueue("ecosystem", "activity");

const _health = {
	status: 1,
	metrics: {
		successCount: 0,
		errorCount: 0
	},
	deadJobs: [],
	deadJobCount: 0
};

proc.initialize = function(args) {
	try {
		startQueueMonitor();
		proc.status("Monitoring activity queue");
	}
	catch(e) {
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	_health.deadJobs = activityQueue.deadJobs;
	_health.deadJobCount = activityQueue.deadJobCount;
	return _health;
};

function startQueueMonitor() {
	activityQueue.subscribe(async function (job) {
		const span = proc.tracer.startSpan("process-activity");
		try {
			// -- todo: this uses to field to pass onto notificationProcessor for notification dispersal
			// -- however, for rules we wanted to further limit who actually has access to the activity
			// -- based on the "to" field. So that needs to be reflected here. think we will need to use a different field
			// -- though. "to" can be for message recipients but maybe "dist" for who it shows up for
			let to = job.activity.to;

			// const activityResult = await activityModel.create(job.sourceApp || "ecosystem", job.activity);
			const activityResult = await activityModel.create(job.sourceApp || "ecosystem", job.activity);
			const activityId = job.activity.id;
    			
			// -- Queue notification job if needed
			if(
				to !== undefined 
				&& to !== null
				&& to.length
			) {

				// If we're only notifying authorized users, we map here
				if (to[0].token === "auth-users:true") {
					const activityAuthUsers = await activityModel.getActivityAuthorizedUsers(activityId);
					to = activityAuthUsers.map((id) => {
						return {
							"token": `user:${id}`,
							"system": to[0].system,
							"email": to[0].email,
							"pushNotification": to[0].pushNotification
						};
					});
				}
				
				notificationModel.queueNotification({
					"to": to,
					"actor": job.activity.actor,
					"activityId": activityId,
					"summary": job.activity.summary,
					"escalationEvent": job.activity.escalationEvent
				});
			}
    
			_health.metrics.successCount++;
			// -- having the result in db was handy so may add that in and log it to elastic in job queue
			job.success({ "create-activity-result": activityResult });
			span.finish();
		} catch (err) {
			span.log({ 
				event: "error", 
				reason: err.message
			});
			console.log(err.message, err.stack);
			_health.metrics.errorCount++;
			job.fail({ errMessage: err.message, errStack: err.stack });
			span.finish();
		}
    
	});
}