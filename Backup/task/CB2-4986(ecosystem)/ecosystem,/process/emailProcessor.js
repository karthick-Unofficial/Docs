const config = require("../config");
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const path = require("path");
const transporter = nodemailer.createTransport(config.mailSenderOptions);
const emailQueue = require("node-app-core").jobQueue("ecosystem", "email");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/process/emailProcessor.js");

const proc = require("node-app-core").process("email-processor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});

const _health = {
	status: 1,
	metrics: {
		successCount: 0,
		errorCount: 0,
		invalidFromEmail: 0,
		invalidToEmail: 0,
		noTemplateFound: 0,
		customHtmlErrorsCaught: 0,
		templateErrorsCaught: 0
	}
};

proc.initialize = function(args) {
	try {
		transporter.verify(function(error, success) {
			if (error) {
				console.log("SMTP server error", error);
				logger.error(
					"initialize", 
					"SMTP server error", 
					{ err: error }
				);
			} else {
				console.log(`SMTP server ${config.mailSenderOptions.host} is ready to send messages`);
				logger.info("initialize", `SMTP server ${config.mailSenderOptions.host} is ready to send messages`);
			}
		});
        
		startQueueMonitor();
		proc.status("Monitoring email queue");
	}
	catch(e) {
		console.log("unhandled exception", e);
		logger.error(
			"initialize", 
			"Unhandled exception during initialization", 
			{ err: { message: e.message, code: e.code }}
		);
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
	emailQueue.subscribe((job) => {
		try {
			const templateName = job.template;
			const from = job.from;
			const to = job.to;
			const data = job.data;
			let result = null;

			logger.info("startQueueMonitor", `Attempting to send email from ${from} to ${to}`);

			if(!validateEmail(from)) {
				_health.metrics.invalidFromEmail++;
				logger.error(
					"startQueueMonitor",
					`From address [${from || "null"}] is not a valid email`,
					{ err: { message: `From address [${from || "null"}] is not a valid email`}}
				);
				throw { message: `From address [${from || "null"}] is not a valid email` };
			}
    
			const email = new Email({
				message: {
					from: from
				},
				transport: transporter,
				juice: true,
				juiceResources: {
					preserveImportant: true,
					webResources: {
						relativeTo: path.resolve("emails")
					}
				}
			});
    
			// Custom html instead of template
			if (typeof job.template === "object") {
				if(!validateEmail(job.template.to)) {
					_health.metrics.invalidToEmail++;
					logger.error(
						"startQueueMonitor",
						`To address [${to || "null"}] is not a valid email`,
						{ err: { message: `To address [${to || "null"}] is not a valid email`}}
					);
					throw { message: `To address [${to || "null"}] is not a valid email` };
				}

				email
					.send({
						template: "empty",
						message: job.template
					})
					.then(response => {
						console.log(response);
						result = response;
					})
					.catch(err => {
						_health.metrics.customHtmlErrorsCaught++;
						logger.error(
							"email.send.catch", 
							"Error caught", 
							{ err: { message: err.message, code: err.code}}
						);
						console.log(err);
					});
			}
			else {
				if(!validateEmail(to)) {
					_health.metrics.invalidToEmail++;
					logger.error(
						"startQueueMonitor",
						`To address [${to || "null"}] is not a valid email`,
						{ err: { message: `To address [${to || "null"}] is not a valid email`}}
					);
					throw { message: `To address [${to || "null"}] is not a valid email` };
				}

				email
					.send({
						// This should be updated in userModel to point to a directory containing an html.pug and subject.pug file
						template: templateName,
						message: {
							to: to
						},
						locals: {...data}
					})
					.then(response => {
						console.log(response);
						result = response;
					})
					.catch(err => {
						_health.metrics.templateErrorsCaught++;
						logger.error(
							"email.send.catch", 
							"Error caught", 
							{ err: { message: err.message, code: err.code}}
						);
						console.log(err);
					});
			}
    
			const template = templateName;
    
			if (!template) {
				_health.metrics.noTemplateFound++;
				logger.error(
					"startQueueMonitor", 
					`No template named ${templateName}`, 
					{ err: { message: `No template named ${templateName}`}}
				);
				job.fail({ error: `No template named ${templateName}` });
			}
    
			_health.metrics.successCount++;
			job.success(result);
		} catch (err) {
			_health.metrics.errorCount++;
			logger.error(
				"startQueueMonitor", 
				"An error occurred", 
				{ err: { message: err.message, code: err.code }}
			);
			job.fail({ errMessage: err.message, errStack: err.stack });
		}
	});    
}

const validateEmail = email => {
	let isValid = true;

	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	isValid = re.test(email);

	if (email.length === 0) {
		isValid = false;
	}
	return isValid;
};