const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-shape-style-properties.js"
);

/**
 * Add support for streaming new shape style properties on an update or change
 */
module.exports.applyScript = async function() {
	const scriptName = "add-shape-style-properties";

	try {
		const result = r
			.table("sys_feedTypes")
			.filter({ entityType: "shapes" })
			.update({
				streamProperties: r.row("streamProperties").map(function(prop) {
					return r.branch(
						prop("batch").eq("globalData"),
						prop.merge(prop, {
							properties: {
								compare: prop("properties")("compare").union([
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType" 
								]),
								update: prop("properties")("update").union([
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType"
								])
							}
						}),
						prop
					);
				})
			})
			.run();

		logger.info(
			"applyScript",
			`Result of ${scriptName}: ${result}`,
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