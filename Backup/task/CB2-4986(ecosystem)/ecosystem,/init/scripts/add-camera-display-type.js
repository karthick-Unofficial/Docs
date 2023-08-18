const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-camera-display-type.js"
);

module.exports.applyScript = async function() {
	const scriptName = "add-camera-display-type";

	try {
		console.log("test");
        
		const result = await r.table("sys_camera")
			.filter((cam) => {
				return r.and(
					cam.hasFields("entityData"),
					cam("entityData").hasFields("geometry"),
					cam("entityData")("geometry").hasFields("coordinates"),
					r.and(
						cam("entityData").hasFields("displayType").not(),
						cam("entityData").hasFields("displayTargetId").not()
					)
				);
			})
			.update({
				entityData: {
					displayType: "map"
				}
			})
			.run();
            
		logger.info("applyScript", `Camera displayType update result: ${result}`);
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};