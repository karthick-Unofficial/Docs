"use strict";
const ATTACHMENT_TABLE = "sys_attachment";

const Minio = require("minio");
const jimp = require("jimp");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/process/thumbnailer.js");
let minioClient, minioConfig;

const proc = require("node-app-core").process("thumbnailer", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	},
	debugPort: 5870
});

const _health = {
	status: 1,
	config: { },
	metrics: { totalThumbnailed: 0, totalErrors: 0 }
};

proc.initialize = function (args) {
	try {
		setupMinio();
		proc.globalChangefeed.subscribeActivity("attachments", globalChangefeedHandler);
		proc.status("Subscribed to global changeFeed");
	}
	catch (e) {
		proc.fail("unhandled exception", e);
	}
	proc.initSuccess();
};

proc.shutdown = function () {
	proc.shutdownSuccess();
};

proc.getHealth = function () {
	// -- status should probably be more about performance or could be related to acceptable errors but want to be aware. 
	// -- Maybe I can come up with a metric that would generically help measure performance
	// -- like a ping and measure response time for starters
	// -- actually the ping could be built into health fetch I think
	return _health;
};

const setupMinio = () => {
	minioConfig = {
		BUCKET: proc._config.minio.buckets.attachmentBucket.name,
		THUMBNAIL_BUCKET: "cb2-attachment-thumbnail"
	};
	minioClient = new Minio.Client(proc._config.minio.connection);
	_health.config.minio = minioConfig;
};

const streamToBuffer = (stream) => {
	return new Promise((resolve, reject) => {
		const buffers = [];
		stream.on("error", reject);
		stream.on("data", (data) => buffers.push(data));
		stream.on("end", () => {
			const buffer = Buffer.concat(buffers);
			resolve(buffer);
		});
	});
};

async function globalChangefeedHandler(activity, subject) {
	try {
		// We are not interested in things that are not attachments
		if (activity.object.type !== "attachment") {
			return;
		}

		// We're unconcerned if something has been deleted
		if (activity.type === "removed") {
			return;
		}
		const result = await r.table(ATTACHMENT_TABLE)
			.get(activity.object.id)
			.pluck("handle", "mimeType");

		const handle = result.handle;
		const userId = handle.split(".")[1];
		const mimeType = result.mimeType;

		if (mimeType.includes("image")) {

			minioClient.getObject(minioConfig.BUCKET, handle, (err, dataStream) => {
				if (err) {
					logger.error("globalChangefeedHandler", "There was an error with the thumbnailer.", {
						err: err
					});
				}
				const thumbnailHandle = handle + "-thumbnail";

				streamToBuffer(dataStream)
					// This doesn't work with svg right now for some reason
					.then((buffer) => jimp.read(buffer))
					.then((image) => image.resize(150, 150).quality(60))
					.then((thumbnail) => {
						thumbnail.getBuffer("image/jpeg", (err, result) => {
							if (err) {
								logger.error("globalChangefeedHandler", "There was an error with the thumbnailer.", {
									err: err
								});
							}
							const buffer = result;

							minioClient.putObject(minioConfig.BUCKET, thumbnailHandle, buffer, (err, etag) => {
								if (err) {
									_health.metrics.totalErrors++;
									logger.error("globalChangefeedHandler", "There was an error with the thumbnailer.", {
										err: err
									});
								} else {
									_health.metrics.totalThumbnailed++;
									console.log("Thumbnail creation successful.");
								}
							});
						});
					})
					.catch((err) => {
						_health.metrics.totalErrors++;
						logger.error("globalChangefeedHandler", "There was an error with the thumbnailer.", {
							err: err
						});
					});
			});
		}
	} catch (error) {
		logger.error("globalChangefeedHandler", "There was an error with the thumbnailer.", {
			err: error
		});
	}
}