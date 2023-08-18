let _app = undefined;
let _feedId = undefined;
let _args = undefined;

function parse(radar) {
	try {
		//Get the correct collection for radars
		const transformedData = {
			properties: { sourceId: radar.id }
		};

		for (const property in radar) {
			if (radar.hasOwnProperty(property)) {
				let propName = property;
				let skip = false;
				switch (property) {
					case "position":
						transformedData["geometry"] = {
							type: "Point",
							coordinates: [
								parseFloat(radar.position.longitude),
								parseFloat(radar.position.latitude)
							]
						};
						skip = true;
						break;
					case "radarFullName":
						propName = "name";
						break;
					case "control": {
						const control = radar[property];
						for (const prop in control) {
							switch (prop) {
								case "radarState":
									transformedData.properties["control"] = control;
									transformedData.properties.control["status"] = String(control[prop]);
									break;
								default:
									break;
							}
						}
						skip = true;
						break;
					}
				}
				if (!skip) {
					transformedData.properties[propName] = radar[property];
				}
			}
		}

		// -- shuey - in ref to comment below right. If SSR provides a timestamp we should use that but need to ensure time sync between servers
		transformedData.properties.timestamp = new Date(); // -- todo: maybe source timestamp vs system. SSR provides a unix epoch

		return { success: true, payload: transformedData };
	}
	catch (err) {
		console.log(err);
		_app.metricReporter.meter("integration-app-parse-error-" + _feedId).mark();
		return { success: false, reason: "error" };
	}
}

module.exports = function (appCore, fid, args) {
	_app = appCore;
	_feedId = fid;
	_args = args;
	return { "parse": parse, "bulk": true };
};
