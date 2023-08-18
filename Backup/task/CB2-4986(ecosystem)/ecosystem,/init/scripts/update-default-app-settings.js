const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-default-app-settings.js"
);

module.exports.applyScript = async function() {
	const scriptName = "update-default-app-settings";

	try {
		const defaultUnits = {
			unitsOfMeasurement: {
				coordinateSystem: "decimal-degrees",
				landUnitSystem: "imperial"
			}
		};
		const result = r
			.table("sys_user")
			.update({
				appSettings: r
					.row("appSettings")
					.default({})
					.merge(defaultUnits)
			})
			.run();

		logger.info(
			"applyScript",
			`Result of ${scriptName}: ${result}`,
			null,
			SYSTEM_CODES.UNSPECIFIED
		);

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
