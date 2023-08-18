const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/create-sys_mapStyles-table.js");
const mapboxSatellite = require("../data/mapStyles/satellite.json");
const mapboxDark = require("../data/mapStyles/dark.json");
const mapboxLight = require("../data/mapStyles/light.json");
const mapboxMedium = require("../data/mapStyles/medium.json");

module.exports.applyScript = async function () {
	const scriptName = "create-sys-mapStyles-table";

	try {
		const tables = ["sys_mapStyles"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				logger.info("applyScript for new mapStyles Passed", `Created table ${table}: ${ctResult}`);
			}
		}
		try {
			const addToMapStyles = r
				.table("sys_mapStyles")
				.insert([{
					name: "satellite",
					label: "Satellite",
					thumbnail: "/_fileDownload?bucketName=map-style-thumbnails&fileName=satellite.jpg",
					style: mapboxSatellite,
					enabled: true,
					orgFilter: null

				},
				{
					name: "grayscale",
					label: "Grayscale",
					thumbnail: "/_fileDownload?bucketName=map-style-thumbnails&fileName=grayscale.jpg",
					style: mapboxLight,
					enabled: true,
					orgFilter: null

				},

				{
					name: "color",
					label: "Color",
					thumbnail: "/_fileDownload?bucketName=map-style-thumbnails&fileName=color.jpg",
					style: mapboxMedium,
					enabled: true,
					orgFilter: null

				},
				{
					name: "night",
					label: "Night",
					thumbnail: "/_fileDownload?bucketName=map-style-thumbnails&fileName=illustration.jpg",
					style: mapboxDark,
					enabled: true,
					orgFilter: null

				}]
				)
				.run();
			console.log(`${scriptName} inserted rows in mapstyles result: `, addToMapStyles);
			return { success: true };
		} catch (err) {
			console.log(`There was an error with the ${scriptName} script:`, err);
			return { success: false, err };
		}


	}
	catch (err) {
		logger.error("applyScript for new mapStyles failed", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};