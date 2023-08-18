const pushNotificationQueue = require("node-app-core").jobQueue("ecosystem", "push-notification");

module.exports = PushNotificationProvider;

function PushNotificationProvider() {
	if (!(this instanceof PushNotificationProvider)) return new PushNotificationProvider();
}

PushNotificationProvider.prototype.queuePushNotification = function(recipients, payload) {

	const promises = recipients.map((token) => {
		return new Promise((resolve, reject) => {
			const job = pushNotificationQueue.createJob();
			job.token = token;
			job.payload = payload;
	
			pushNotificationQueue.addJob(job)
				.then(() => {
					resolve({ "result": "Job Added: " + job.jobId });
				})
				.catch(err => { return reject(err); });
		});
	});

	Promise.all(promises)
		.catch((err) => {
			console.log(err);
		});

};
