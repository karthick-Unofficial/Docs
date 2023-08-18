const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/rename-mapgl-to-map.js"
);
const provider = require("../../lib/rethinkdbProvider");
const r = provider.r;

const CONFIGURATION_TABLE = "sys_configuration";
const MAP_STYLES_TABLE = "sys_mapStyles";
const LOCALES_TABLE = "sys_locales";

module.exports.applyScript = async function() {
	const scriptName = "rename-mapgl-to-map";

	try {
		// Update app configuration for map app
		await r.table(CONFIGURATION_TABLE).filter(
			r.row("appId").eq("mapgl-app")
		).update({
			"appId": "map-app"
		});

		// Update sprite path in map styles
		await r.table(MAP_STYLES_TABLE).filter(
			r.row("style")("sprite").default("").eq("https://please-replace-me-with-the-correct-hostname/mapgl-app/static/icons/orion-sprites")
		).update({
			"style": {
				"sprite": "https://please-replace-me-with-the-correct-hostname/map-app/static/icons/orion-sprites"
			}
		});

		// Update locale for map app
		await r.table(LOCALES_TABLE).filter(
			r.row("appId").eq("mapgl-app")
		).update({
			"appId": "map-app"
		});

		return { "success": true };
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};
