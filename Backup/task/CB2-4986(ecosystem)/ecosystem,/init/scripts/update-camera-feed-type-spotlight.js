const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-camera-feed-type-spotlight.js"
);

module.exports.applyScript = async function() {
	const scriptName = "update-camera-feed-type-spotlight";

	try {
		const result = r
			.table("sys_feedTypes")
			.filter({ feedId: "cameras" })
			.update({
				streamProperties: r.row("streamProperties").map(function(prop) {
					return r.branch(
						prop("batch").eq("globalGeo"),
						prop.merge(prop, {
							properties: {
								compare: prop("properties")("compare").append("spotlightShape"),
								initial: prop("properties")("initial").append("spotlightShape"),
								update: prop("properties")("update").append("spotlightShape")
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
			null
		);

		return { success: true };
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return { success: false, err };
	}
};
