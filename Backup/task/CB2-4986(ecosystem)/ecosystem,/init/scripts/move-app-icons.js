const config = require("../../config");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/move-app-icons.js"
);
const fs = require("fs");
const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";
const Minio = require("minio");

const minioClient = new Minio.Client(config.minio.connection);

module.exports.applyScript = async function() {
	const scriptName = "move-app-icons";

	try {
		// Ensure bucket
		const appIconBucket = config.minio.buckets.appIconBucket;
		await ensureBucket(appIconBucket);

		// Upload files
		const icons = fs.readdirSync(`${baseDir}/app-icons`);
		icons.forEach(icon => {
			minioClient.fPutObject(appIconBucket.name, icon, `${baseDir}/app-icons/${icon}`, (e) => {
				if (e) {
					logger.error("applyScript", `There was an error uploading app-icon: ${icon}`, {err: {message: e.message, stack: e.stack}});
				}
			});
		});
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};

const ensureBucket = async function (bucket) {
	return new Promise((resolve, reject) => {
		minioClient.bucketExists(bucket.name, function(err) {
			if (err) {
				if (err.code == "NoSuchBucket") {
					minioClient.makeBucket(bucket.name, bucket.region, function(err) {
						if (err) {
							logger.error("ensureBucket", "Error creating bucket.", { errMessage: err.message, errStack: err.stack });
							reject();
						}
						else {
							logger.info("ensureBucket", `Bucket ${bucket.name} created successfully in ${bucket.region}.`, {});
							resolve();
						}
					});
				}
				else {
					logger.error("ensureBucket", "Minio error.", { errMessage: err.message, errStack: err.stack });
					reject();
				}
			}
			// if err is null it indicates that the bucket exists.
			else {
				logger.info("ensureBucket", `Bucket ${bucket.name} exists.`, {});
				resolve();
			}
		});
	});
};