const config = require("../../config.json");

const base = process.env.BASE_INSTALLATION_ADDRESS;
config.mobileConfig.homeAddress = base + config.mobileConfig.homeAddress;
config.mobileConfig.appsMenuAddress = base + config.mobileConfig.appsMenuAddress;


module.exports = function (app) {

	const restServer = app.rest;

	restServer.get("/mobile-config", function (req, res) {
		if (config && config.mobileConfig) {
			res.send(config.mobileConfig);
		}
		else {
			res.send("No config defined");
		}
	});
};
