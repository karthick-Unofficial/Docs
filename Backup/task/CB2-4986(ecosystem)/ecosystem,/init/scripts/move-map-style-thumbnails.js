const config = require("../../config");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/move-map-style-thumbnails.js"
);
const fs = require("fs");
const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";
const Minio = require("minio");

const minioClient = new Minio.Client(config.minio.connection);

module.exports.applyScript = async function() {
	const scriptName = "move-map-style-thumbnails";

	try {
		// Ensure bucket
		const mapStyleThumbnailsBucket = config.minio.buckets.mapStyleThumbnailsBucket;
		await ensureBucket(mapStyleThumbnailsBucket);

		// Upload files
		const thumbnails = fs.readdirSync(`${baseDir}/map-style-thumbnails`);
		thumbnails.forEach(thumbnail => {
			minioClient.fPutObject(mapStyleThumbnailsBucket.name, thumbnail, `${baseDir}/map-style-thumbnails/${thumbnail}`, (e) => {
				if (e) {
					logger.error("applyScript", `There was an error uploading map style thumbnail: ${thumbnail}`, {err: {message: e.message, stack: e.stack}});
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