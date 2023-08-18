const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-shape-properties.js"
);

/**
 * Add new styling properties to lines and shapes for handling
 * outline thickness and color, fill color and opacity, and outline type
 */
module.exports.applyScript = async function() {
	const scriptName = "add-shape-properties";

	try {
		const lineUpdate = r.table("sys_shape")
			.filter({"entityData": {"type": "LineString"}})
			.update({"entityData": {
				"properties": r.row("entityData")("properties").merge({
					"lineType": "Solid",
					"lineWidth": 3,
					"polyStroke": "#2face8"
				})
			}})
			.run();
            
		const polyUpdate = r.table("sys_shape")
			.filter({"entityData": {"type": "Polygon"}})
			.update({"entityData": {
				"properties": r.row("entityData")("properties").merge({
					"lineType": "Solid",
					"lineWidth": 1,
					"polyFill": "#0073c8",
					"polyFillOpacity": 0.2,
					"polyStroke": "#2face8"
				})
			}})
			.run();
            
		logger.info(
			"applyScript",
			`Result of ${scriptName} line update: ${lineUpdate}`,
			null,
			SYSTEM_CODES.UNSPECIFIED
		);
        
		logger.info(
			"applyScript",
			`Result of ${scriptName} poly update: ${polyUpdate}`,
			null,
			SYSTEM_CODES.UNSPECIFIED
		);

		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {
			err: err
		});
		return {"success": false, err};
	}
};