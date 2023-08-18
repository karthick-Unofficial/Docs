const userDeviceModel = require("../models/userDeviceModel")();
const userDeviceCache = {};

userDeviceModel.streamAll(
	function (err, change) {
		if (err) {
			console.log(err);
		}

		if (!change.new_val) {
			// removal
			const {[change.old_val.id]: omit, ...rest} = userDeviceCache[change.old_val.userId];
			userDeviceCache[change.old_val.userId] = rest;
		}
		else {
			userDeviceCache[change.new_val.userId] = userDeviceCache[change.new_val.userId] || {}; 
			userDeviceCache[change.new_val.userId][change.new_val.id] = change.new_val;
		}

        
	})
	.then(function (result) { console.log("User Device stream established."); })
	.catch(function (reason) { console.log("User Device stream failed: ", reason); });

module.exports = userDeviceCache;