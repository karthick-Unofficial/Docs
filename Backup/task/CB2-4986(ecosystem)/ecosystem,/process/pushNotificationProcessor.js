/*
FIREBASE-ADMIN PACKAGE WAS UNINSTALLED DUE TO HIGH SECURITY AND POLICY VIOLATIONS
FOR ANY OF THIS TO WORK, THAT WILL HAVE TO BE RESOLVED, THEN UNCOMMENT OUT THE COMMENTED-OUT CODE BELOW
*/


//const admin = require("firebase-admin");
const pushNotificationQueue = require("node-app-core").jobQueue("ecosystem", "push-notification");

const proc = require("node-app-core").process("push-notification-processor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});

const _health = {
	status: 1,
	metrics: {
		successCount: 0,
		errorCount: 0
	}
};

proc.initialize = function(args) {
	try {
		const serviceAccount = require("../cb-tracker-firebase-adminsdk-qu2tv-53d6b205dc.json");
		//admin.initializeApp({
		//	credential: admin.credential.cert(serviceAccount)
		//});
		startQueueMonitor();
		proc.status("Monitoring push notification queue");
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
	return _health;
};

function startQueueMonitor() {
	pushNotificationQueue.subscribe((job) => {
		try {
			// admin.messaging().sendToDevice(job.token, job.payload)
			// 	.then((response) => {
			// 		console.log(response);
			// 		if (response.results[0].error) {
			// 			console.log(response.results[0].error);
			// 		} else {
			// 			console.log("notification sent.");
			// 			job.success(response.results[0]);
			// 		}
			// 	});
			_health.metrics.successCount++;
		}
		catch (err) {
			_health.metrics.errorCount++;
			job.fail({ errMessage: err.message, errStack: err.stack });
		}
	});
}