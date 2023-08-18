
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("shapes-app", "/lib/utility.js");

async function attachMapThumbnail(process, activityId, center, zoom, features) {
	try {
		const mapboxConfig = process._config.mapbox;
		const featureColl = {
			"type": "FeatureCollection",
			"features": []
		};
		for(const idx in features) {
			featureColl.features.push({ "type": "Feature", "geometry": features[idx], "properties": {} });
		}
		const encodedFeatures = encodeURIComponent(JSON.stringify(featureColl));
		const mapThumbnailUrl = `${mapboxConfig.staticAPIBaseUrl}(${encodedFeatures})/${center[0]},${center[1]},${zoom}/${mapboxConfig.thumbnailWidth}x${mapboxConfig.thumbnailHeight}?access_token=${mapboxConfig.accessToken}`;
		logger.info("attachMapThumbnail", "Generated map thumbnail url", { url: mapThumbnailUrl });
		const result = await process.ecosystem.addAttachmentFromUrl(
			mapThumbnailUrl,
			activityId,
			"activity",
			`activity-${activityId}-map-thumbnail`,
			"image/png",
			mapboxConfig.attachmentIdentity
		);
		logger.info("attachMapThumbnail", "Added thumnail attachment", { result: result });
	}
	catch(ex) {
		logger.error("attachMapThumbnail", "Error attaching map thumbnail", { err: ex });
	}
}


module.exports = { "attachMapThumbnail": attachMapThumbnail };