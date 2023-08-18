const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;


/**
 * This is the template for DB update scripts, and it may be expanded upon as necessary.
 * 1.) update the scriptName variable below
 * 2.) If you need a table, update any "x-goes-here" strings in the Create Table section. If not, remove it.
 * 3.) If you need an entry in sys_application, update any "x-goes-here" strings in the Add Application section. If not, remove it.
 * 4.) Add any custom code you may need.
 * 5.) Import script into dbscripts.js and add it to exports as an object.
 */
module.exports.applyScript = async function() {
	const scriptName = "update-camera-configuration";

	try {
		// Custom code ---------------------------------------------------

		const allCameras = await r.table("sys_camera").run();
		const batch = [];

		for(const camera of allCameras) {
			if(!camera.entityData.properties.features) camera.entityData.properties.features = [];

			if(camera.control) {
				if(camera.control.videoIntegrated) camera.entityData.properties.features.push("video-integrated-control");
				if(camera.control.lrad) camera.entityData.properties.features.push("lrad");
				camera.entityData.properties.vicPanFactor = camera.control.panFactor || 10;
				camera.entityData.properties.vicTiltFactor = camera.control.tiltFactor || 10;
				camera.entityData.properties.vicZoomFactor = camera.control.zoomFactor || 10;
			}

			if(camera.controls) {
				camera.entityData.properties.features.push("control");
				camera.entityData.properties.features.push("auto-slew");
			}

			batch.push(r.table("sys_camera").get(camera.id).update(camera));
			batch.push(r.table("sys_camera").get(camera.id).replace(r.row.without("control", "controls")));
		}

		const newConfigResult = await r.expr(batch).run();
		
		console.log(`${scriptName} update new config result: `, newConfigResult);

		// ---------------------------------------------------------------
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {"success": false, err};
	}
};