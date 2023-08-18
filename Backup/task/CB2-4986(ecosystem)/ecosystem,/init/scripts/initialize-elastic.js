// Initial setup for elastic. Checks for index templates, kibana index patterns, visualizations, dashboards, installing those not present.

const fs = require("fs");
const path = require("path");
const esProvider = require("../../lib/es-provider");
const client = esProvider.get({ "requestTimeout": 2000 });

const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";

const _sleep = function(ms) {
	return new Promise((resolve) => {
		setTimeout(function () {
			resolve(true);
		}, ms);
	});
};

// Recursively gets all filenames from a directory
const walkSync = (dir, filelist) => {
	let fileList = filelist || [];
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			fileList = walkSync(path.join(dir, file), fileList);
		}
		else {
			fileList.push(path.join(dir, file));
		}
	});
	return fileList; // ['filename1.json', 'filename2.json', ... ']
};

// /init/data/foo.json --> foo
const transformFilepath = (filepath) => {
	const filename = filepath.split("/")[filepath.split("/").length - 1];
	return filename.replace(".json", "");
};

// Given an array of filenames, returns an object when each key is the name of the file and each value is the JSON contents of that file
const mergeJSON = (files) => {
	return files.reduce((accum, currentVal) => {
		return {...accum, [transformFilepath(currentVal)]: fs.readFileSync(currentVal, "utf8")};
	}, {});
};

// For dashboards, check that the required visualizations are present at .kibana index
const checkMissingDeps = (endpoint, obj) => {
	const parsedObj = JSON.parse(obj);
	return new Promise((resolve, reject) => {
		if (!endpoint.includes("dashboard")) {
			// No dependencies needed
			resolve();
		}

		const deps = JSON.parse(parsedObj.panelsJSON).map((item) => item.id);
		const checks = deps.map((id) => {
			return new Promise((resolve, reject) => {
				client.transport.request({"method": "GET", "path": `/.kibana/visualization/${id}`})
					.then(() => resolve())
					.catch(() => {
						console.log(`  WARNING: One or more dependencies required by ${parsedObj.title} is missing! (${id})`);
						resolve();
					});
			});
		});

		Promise.all(checks)
			.then(() => resolve())
			.catch((err) => reject(err));

	});
};

// Check if an elasticsearch object exists
const checkExists = (endpoint, key) => {
	return new Promise((resolve, reject) => {
		client.transport.request({"method": "GET", "path": `${endpoint}/${key}`})
			.then(() => resolve(true))
			.catch(() => resolve(false));
	});
};

// Check all objects of a certain type and return an array of those needing installation
const getUninstalled = (keys, endpoint) => {
	let count = 0;
	const total = keys.length;
	let uninstalled = [];
	return new Promise((resolve, reject) => {
		const operations = keys.map((key) => {
			return new Promise((resolve, reject) => {
				checkExists(endpoint, key)
					.then((exists) => {
						// -- shuey - put templates regardless if exist or not
						if (endpoint !== "/_template" && exists) {
							count++;
							resolve();
						}
						else {
							uninstalled = [ ...uninstalled, key ];
							resolve();
						}
					});
			});
		});

		Promise.all(operations)
			.then((result) => {
				console.log(`  Found ${count} / ${total} of required objects.`);
				if (count < total) {
					console.log("  Installing missing...");
				}
				resolve(uninstalled);
			})
			.catch((err) => {
				console.log(err);
				resolve(err);
			}); 
	});
};

// Check is see if object keys need to be modified (index-patterns, etc.)
const verifyKeys = (obj, endpoint) => {
	if (endpoint.includes("index-pattern")) {
		const newObj = {};
		Object.keys(obj).forEach((key) => {
			newObj[key + "-*"] = obj[key];
		});
		return newObj;
	}
	else {
		return obj;
	}
};

const importer = (directory, method, endpoint) => {
	return () => {
		return new Promise((resolve, reject) => {

			// Single object containing each JSON we are responsible for installing
			const mergedFiles = mergeJSON(walkSync(directory));

			// Keys of index patterns need to be tweaked
			const data = verifyKeys(mergedFiles, endpoint);
			const keys = Object.keys(data);

			// Iterate through all and check for those that need to be installed
			getUninstalled(keys, endpoint)
				.then((missingKeys) => {

					// Return promises that executes installation for each missing key
					const operations = missingKeys.map((key) => {
						return new Promise((resolve, reject) => {

							// Check for dashboards missing dependencies
							checkMissingDeps(endpoint, data[key])

							// Execute install
								.then(() => client.transport.request({
									"method": "PUT", 
									"path": `${endpoint}/${key}`, 
									"body": data[key]
								}))
								.then((result) => {
									console.log(`    INSERT SUCCESS ${endpoint}/${key}`);
									resolve(result);
								})
								.catch((err) => {
									if (err !== "") { // (actual error)
										console.log(`    INSERT FAILED ${endpoint}/${key}`);
									}
									resolve();
								});
						});
					});


					// Fire off all promises at once then resolve
					Promise.all(operations)
						.then((result) => resolve(result))
						.catch((err) => resolve(err)); 

				});
		});
	};
};

const importIndexTemplates = importer(`${baseDir}/elastic/index-templates/`, "PUT", "/_template");
// const importIndexPatterns = importer(`${baseDir}/elastic/kibana_patterns/`, "PUT", "/.kibana/index-pattern");
// const importKibanaVisualizations = importer(`${baseDir}/elastic/kibana_visualizations/`, "PUT", "/.kibana/visualization");
// const importKibanaDashboards = importer(`${baseDir}/elastic/kibana_dashboards/`, "PUT", "/.kibana/dashboard");
const importRepositories = importer(`${baseDir}/elastic/repositories/`, "PUT", "/_snapshot");

const initElastic = () => {
	return new Promise((resolve, reject) => {
		client.ping({ requestTimeout: 60000 }, (err) => {
			if (err) {
				reject(err);
			}
			else {
				console.log("Successfully connected to ElasticSearch!");
				console.log("Checking index templates...");
				return importIndexTemplates()
					.then(() => {
						console.log("Checking repositories...");
						return importRepositories();
					})
					// .then(() => {
					// 	console.log("Checking index patterns...");
					// 	return importIndexPatterns();
					// })
					// .then(() => {
					// 	console.log("Checking Kibana visualizations...");
					// 	return importKibanaVisualizations();
					// })
					// .then(() => {
					// 	console.log("Checking Kibana dashboards...");
					// 	return importKibanaDashboards();
					// })
					.then(() => {
						console.log("Finished!\n");
						resolve({ "success": true });
					})
					.catch((err) => {
						console.log(err);
						resolve({ "success": false, err });
					});
			}
		});
	});
};

module.exports.run = () => {

	return new Promise(async (resolve, reject) => {
		let success = false;
		let attemptCount = 0;
		console.log("Polling ElasticSearch...");
		while (success === false) {
			try {
				const result = await initElastic();
				success = true;
				resolve(result);
			} catch (err) {
				attemptCount++;
				console.log("unable to connect to ElasticSearch. Attempt #" + attemptCount);
				await _sleep(10000);
			}
		}
	});

};