const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("reports-app", "/api/reports.js");
const esProvider = require("../lib/es-provider");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const fs = require("fs");
const _global = require("node-app-core/dist/app-global.js");
const Minio = require("minio");
const moment = require("moment-timezone");
const uuid = require("node-uuid");

module.exports = function (app) {
	const minioConfig = app._config.minioClient;
	minioConfig.port = parseInt(minioConfig.port);
	const minioClient = new Minio.Client(minioConfig);
	const timezone = app._config.timezone ? app._config.timezone : "America/New_York";
	const includedReports = app._config.includedReports || [
		"sitrep",
		"tripwire-activity",
		"vessel-position",
		"zone-activity",
		"dwell-time"
	];

	app.rest.get("/selectValuesFromConfig/:configKey", async (req, res) => {
		try {
			const config = await buildConfig(app, req.identity);
			const configKey = config[req.routeVars.configKey];
			let result = configKey;
			if (configKey.makeEcoCall && configKey.url) {
				result = await app.appRequest.request("ecosystem", "GET", "/" + configKey.url, {}, null, req.identity);
			}
			res.send(result);
		} catch (error) {
			res.send(error);
		}
	});

	app.rest.get("/reportTypes", async (req, res) => {
		try {
			const result = [];
			const reportTypes = fs.readdirSync("reports");
			//remove thread report if user does not have access to secure-share
			if (reportTypes.includes("thread-report")) {
				const checkForAccess = await app.appRequest.request(
					"ecosystem",
					"GET",
					"/externalSystem/secure-share",
					{},
					null,
					req.identity
				);
				if (!checkForAccess.externalSystemId) {
					reportTypes.splice(reportTypes.indexOf("thread-report"), 1);
				}
			}
			if (reportTypes.includes("drive-cam")) {
				const checkForAccess = await app.appRequest.request(
					"ecosystem",
					"GET",
					"/externalSystem/drive-cam",
					{},
					null,
					req.identity
				);
				if (!checkForAccess.externalSystemId) {
					reportTypes.splice(reportTypes.indexOf("drive-cam"), 1);
				}
			}
			reportTypes.forEach((dir) => {
				if (includedReports.indexOf(dir) > -1) {
					const json = fs.readFileSync(`reports/${dir}/${dir}.json`, "utf8");
					result.push(JSON.parse(json));
				}
			});

			res.send(result);
		} catch (e) {
			// Should not send 200
			res.send(e);
		}
	});

	app.rest.post("/:reportType/generate", async (req, res) => {
		const reportType = req.routeVars.reportType;
		try {
			if (includedReports.indexOf(reportType) < 0) {
				return res.send({
					ok: false,
					message: `${reportType} not supported.`
				});
			}
			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			const query = require(`../reports/${reportType}/${metadata.queryScript}`);
			const client = createElasticSearchClient(30000);
			const result = await query(metadata, client, app.ecosystem, app.appRequest, req.body, req.identity.userId);
			res.send({ ok: true, data: result });
		} catch (e) {
			// Should not send 200
			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			handleGenerationTimeout(e, app, metadata.pdfOnly ? "pdf" : "csv", req, res);
		}
	});

	app.rest.post("/:reportType/export", async (req, res) => {
		const reportType = req.routeVars.reportType;
		try {
			if (includedReports.indexOf(reportType) < 0) {
				return res.send({
					ok: false,
					message: `${reportType} not supported.`
				});
			}
			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			const query = require(`../reports/${reportType}/${metadata.queryScript}`);
			const client = createElasticSearchClient(30000);
			const result = await query(metadata, client, app.ecosystem, app.appRequest, req.body, req.identity.userId);
			const CSV = convertToCSV(result, req.body.timeFormatPreference);
			res.send({
				ok: true,
				CSV
			});
		} catch (e) {
			handleGenerationTimeout(e, app, "csv", req, res);
		}
	});

	app.rest.post("/:reportType/export-pdf", async (req, res) => {
		const reportType = req.routeVars.reportType;
		try {
			if (includedReports.indexOf(reportType) < 0) {
				return res.send({
					ok: false,
					message: `${reportType} not supported.`
				});
			}
			const template = `./pdfTemplates/${reportType}.ejs`;
			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			const query = require(`../reports/${reportType}/${metadata.queryScript}`);
			const client = createElasticSearchClient(30000);
			const result = await query(metadata, client, app.ecosystem, app.appRequest, req.body, req.identity.userId);
			const reportData =
				result.length > 0
					? result[0].data
						? result[0].data.length > 0
							? result[0].data[0]
							: result[0].data
						: result[0]
					: [];

			const profile = await app.ecosystem.getUserProfile(req.identity.userId);
			const { locale } = profile.user.appSettings;
			const translations = await _global.geti18n(locale);
			const pdfTemplates = translations["reports-app"];

			const data = {
				...req.body,
				...reportData,
				...pdfTemplates,
				locale
			};
			const html = await createHTML(template, data, timezone);

			// The commented lines below are useful for writing the html data to an html file if we are having trouble downloading the pdf file;
			// const fileName = `${__dirname}/test.html`;
			// const stream = fs.createWriteStream(fileName);
			// stream.once("open", function () {
			// 	stream.end(html);
			// });

			const pdf = await createPDF(html, data.columns ? data.columns > 5 : true);
			await pdf.toBuffer((err, buffer) => {
				if (err) {
					logger.error("/:reportType/export-pdf", "Error converting PDF to buffer", {
						errMessage: err.message,
						errStack: err.stack
					});
				}
				try {
					res.send({ ok: true, data: buffer });
				} catch (err) {
					logger.error("/:reportType/export-pdf", "Unexpected error sending response", {
						errMessage: err.message,
						errStack: err.stack
					});
				}
			});
		} catch (err) {
			logger.error("/:reportType/export-pdf", "Unexpected error generating PDF", {
				errMessage: err.message,
				errStack: err.stack
			});
			handleGenerationTimeout(err, app, "pdf", req, res);
		}
	});

	app.rest.post("/:reportType/email", async (req, res) => {
		const reportType = req.routeVars.reportType;
		try {
			if (includedReports.indexOf(reportType) < 0) {
				return res.send({
					ok: false,
					message: `${reportType} not supported.`
				});
			}
			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			const query = require(`../reports/${reportType}/${metadata.queryScript}`);

			// Tell client report is being processed
			res.send({
				ok: true
			});
			const client = createElasticSearchClient(6000000);
			// Query report
			const result = await query(metadata, client, app.ecosystem, app.appRequest, req.body, req.identity.userId);

			// Convert report to CSV
			const CSV = convertToCSV(result, req.body.timeFormatPreference);

			// Upload to minio
			const handle = `report.${reportType}.${uuid()}`;
			await minioClient.putObject(app._config.attachmentBucket.name, handle, CSV, {}, async (err, etag) => {
				if (err) {
					sendErrorEmail(app, req, err);
				} else {
					// email generated minio link (insert to rethink, email after operation complete?)
					const profile = await app.ecosystem.getUserProfile(req.identity.userId);
					const { locale } = profile.user.appSettings;
					const translations = await _global.geti18n(locale);
					const { emailTemplates } = translations["reports-app"];
					const body = {
						to: profile.user.email,
						subject: emailTemplates.availableForDownload,
						html: generateHTML(handle, "csv", emailTemplates)
					};

					await app.appRequest.request("ecosystem", "POST", "/ecosystem/api/email", {}, body, req.identity);
				}
			});
		} catch (err) {
			// Should not send 200
			logger.error("/:reportType/email", "Unexpected error", {
				errMessage: err.message,
				errStack: err.stack
			});
			sendErrorEmail(app, req, err);
			res.send(err);
		}
	});

	//same as emailing a csv, but generating a pdf instead
	app.rest.post("/:reportType/pdf-email", async (req, res) => {
		const reportType = req.routeVars.reportType;
		try {
			if (includedReports.indexOf(reportType) < 0) {
				return res.send({
					ok: false,
					message: `${reportType} not supported.`
				});
			}
			const template = `./pdfTemplates/${reportType}.ejs`;

			const metadata = require(`../reports/${reportType}/${reportType}.json`);
			const query = require(`../reports/${reportType}/${metadata.queryScript}`);

			// Tell client report is being processed
			res.send({
				ok: true
			});
			const client = createElasticSearchClient(6000000);
			const result = await query(metadata, client, app.ecosystem, app.appRequest, req.body, req.identity.userId);
			//query results for vessel reports and non-vessel reports are slightly different
			const reportData =
				result.length > 0
					? result[0].data
						? result[0].data.length > 0
							? result[0].data[0]
							: result[0].data
						: result[0]
					: [];
			const userProfile = await app.ecosystem.getUserProfile(req.identity.userId);
			const { locale } = userProfile.user.appSettings;
			const translations = await _global.geti18n(locale);
			const pdfTemplates = translations["reports-app"];
			const data = {
				...req.body,
				...reportData,
				...pdfTemplates
			};

			const html = await createHTML(template, data, timezone);
			const pdf = await createPDF(html, data.columns ? data.columns > 5 : true);
			// Upload to minio
			const handle = `report.${reportType}.${uuid()}`;
			await pdf.toStream(async (err, stream) => {
				if (err) {
					sendErrorEmail(app, req, err);
				} else {
					const etag = await minioClient.putObject(
						app._config.attachmentBucket.name,
						handle,
						stream,
						{},
						async (err, etag) => {
							if (err) {
								sendErrorEmail(app, req, err);
							} else {
								// email generated minio link (insert to rethink, email after operation complete?)
								const profile = await app.ecosystem.getUserProfile(req.identity.userId);
								const { locale } = profile.user.appSettings;
								const translations = await _global.geti18n(locale);
								const { emailTemplates } = translations["reports-app"];
								const body = {
									to: profile.user.email,
									subject: emailTemplates.availableForDownload,
									html: generateHTML(handle, "pdf", emailTemplates)
								};
								await app.appRequest.request(
									"ecosystem",
									"POST",
									"/ecosystem/api/email",
									{},
									body,
									req.identity
								);
							}
						}
					);
				}
			});
		} catch (err) {
			logger.error("/:reportType/pdf-email", "Unexpected error sending pdf email", {
				errMessage: err.message,
				errStack: err.stack
			});
			sendErrorEmail(app, req, err);
			res.send(err);
		}
	});
};

const convertToCSV = (report, timeFormatPreference = "12-hour") => {
	const reportType = report[0].type;

	const metadataJSON = fs.readFileSync(`reports/${reportType}/${reportType}.json`, "utf8");
	const metadata = JSON.parse(metadataJSON);

	const data = report[0].groups;
	const columns = metadata.type.table.columns;
	const headers = {};
	let rows = [];

	// if report is grouped (i.e. by zone), prepend the report group's property column for CSV (unnecessary for table view)
	if (data[0] && data[0].property) {
		headers[data[0].property] = data[0].displayName;
	}

	columns.forEach((column) => {
		headers[column.property] = column.displayName;
	});

	if (data[0]) {
		// Flatten to rows
		rows = data
			.map((group) => {
				const rowData = group.rows.slice();
				const formattedRows = rowData.map((tr) => {
					// Parse timestamp
					for (const prop in tr) {
						if (prop === "acquisitionTime" || prop === "timestamp" || prop === "entered") {
							const dateTimeFormat =
								timeFormatPreference === "24-hour" ? "MM/DD/YYYY HH:mm z" : "MM/DD/YYYY hh:mm A z";
							tr[prop] = moment.tz(tr[prop], "UTC").format(dateTimeFormat);
						}
					}
					if (group.property) {
						// Shift cells over to account for report group's property
						const buffer = {
							[group.property]: " "
						};
						return {
							...buffer,
							...tr
						};
					}
				});
				formattedRows.unshift({
					[group.property]: group.name
				});
				return formattedRows;
			})
			.reduce((a, b) => {
				return a.concat(b);
			});
	}

	rows.unshift(headers);

	// Convert Object to JSON
	const jsonObject = JSON.stringify(rows);

	const array = typeof jsonObject !== "object" ? JSON.parse(jsonObject) : jsonObject;

	let str = "";
	if (array[1]) {
		for (let i = 0; i < array.length; i++) {
			let line = "";
			for (const index in array[i]) {
				if (line != "") line += ",";

				line += array[i][index];
			}

			str += line + "\r\n";
		}
	} else {
		str = "No Results";
	}

	return str;
};

const generateErrorHTML = (err, emailText) => {
	return `<div class='cb-font-b1'><p>${emailText.generateErrorHTML.content}</p> 
				<p>${emailText.generateErrorHTML.error} : ${err ? (err.message ? err.message : err) : "error"}</p></div>`;
};

const generateHTML = (handle, fileType, emailText) => {
	return `<div class="cb-font-b1">${emailText.generateHtml.content}: <a target=_blank href="${process.env.BASE_INSTALLATION_ADDRESS}/reports-app/#/download/${fileType}/${handle}" download="report.${fileType}">${emailText.generateHtml.clickHere}</a></div>`;
};

const sendErrorEmail = async (app, req, err) => {
	// generate an error email if something goes wrong
	const profile = await app.ecosystem.getUserProfile(req.identity.userId);
	const { locale } = profile.user.appSettings;
	const translations = await _global.geti18n(locale);
	const { emailTemplates } = translations["reports-app"];
	const body = {
		to: profile.user.email,
		subject: emailTemplates.sendError.subject,
		html: generateErrorHTML(err, emailTemplates)
	};
	await app.appRequest.request("ecosystem", "POST", "/ecosystem/api/email", {}, body, req.identity);
};

const createHTML = async (template, data, timezone) => {
	try {
		data.timezone = timezone;
		const html = await ejs.renderFile(template, {
			data: data,
			moment: moment
		});
		return html;
	} catch (err) {
		logger.error("createHTML", "Unexpected error creating HTML from template", {
			errMessage: err.message,
			errStack: err.stack
		});
	}
};

const createPDF = async (html, usePortrait) => {
	try {
		const pdf = await htmlPdf.create(html, {
			timeout: 3000000,
			format: "A3",
			orientation: usePortrait ? "portrait" : "landscape",
			header: {
				height: "80px"
			}
		});
		return pdf;
	} catch (err) {
		logger.error("createPDF", "Unexpected error creating PDF from html", {
			errMessage: err.message,
			errStack: err.stack
		});
	}
};

const createElasticSearchClient = (requestTimeout) => {
	const client = esProvider.get({ requestTimeout: requestTimeout });
	client.ping({
		requestTimeout: 5000
	});
	return client;
};

const handleGenerationTimeout = (e, app, filetype, req, res) => {
	if (e.message === "request timeout") {
		res.send(e);
		const body = {
			...req.body
		};
		if (body.paginate) {
			body.paginate = false;
		}
		if (filetype === "pdf") {
			app.appRequest.request(
				"reports-app",
				"POST",
				`/${req.routeVars.reportType}/pdf-email`,
				{},
				body,
				req.identity
			);
		} else {
			app.appRequest.request("reports-app", "POST", `/${req.routeVars.reportType}/email`, {}, body, req.identity);
		}
	} else {
		logger.error("handleGenerationTimeout", "Unexpected error", {
			errMessage: e.message,
			errStack: e.stack
		});
		res.send(e);
	}
};

const buildConfig = async (app, identity) => {
	let config = { ...app._config };
	const secureShare = await app.appRequest.request(
		"ecosystem",
		"GET",
		"/externalSystem/secure-share",
		{},
		null,
		identity
	);
	const driveCam = await app.appRequest.request("ecosystem", "GET", "/externalSystem/drive-cam", {}, null, identity);
	if (driveCam.config) {
		config = {
			...config,
			...driveCam.config
		};
	}
	if (secureShare.config) {
		config = {
			...config,
			...secureShare.config
		};
	}
	return config;
};
