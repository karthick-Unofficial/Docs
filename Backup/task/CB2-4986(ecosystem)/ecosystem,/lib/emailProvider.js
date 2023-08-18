const config = require("../config.json");
const emailQueue = require("node-app-core").jobQueue("ecosystem", "email");


module.exports = EmailProvider;

function EmailProvider() {
	if (!(this instanceof EmailProvider)) return new EmailProvider();
}

/**
 * queueEmail
 * @param template -- optionally a string to read from local or a full template object
 * @param from
 * @param to
 * @param data
 */
EmailProvider.prototype.queueEmail = async function (template, from, to, data) {
	const job = emailQueue.createJob();
	job.template = template;
	job.from = from || config.environment.fromEmail;
	job.to = to;
	job.data = data;
	try {
		await emailQueue.addJob(job);
		return { "result": "Job Added: " + job.jobId };
	}
	catch(ex) {
		throw ex;
	}  
};
