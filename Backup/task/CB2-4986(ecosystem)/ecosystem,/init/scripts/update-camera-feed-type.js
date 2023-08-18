const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-camera-feed-type.js"
);

module.exports.applyScript = async function() {
	const scriptName = "update-camera-feed-type";

	try {
		const result = r
			.table("sys_feedTypes")
			.filter({ feedId: "cameras" })
			.update({
				streamProperties: r.row("streamProperties").map(function(prop) {
					return r.branch(
						prop("batch").eq("globalData"),
						prop.merge(prop, {
							properties: {
								initial: prop("properties")("initial").append("player")
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

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
