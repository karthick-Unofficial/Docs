const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/create-locale-table.js");

const settingsApp = require("../data/i18n-translations/settings-app.json");
const replayApp = require("../data/i18n-translations/replay-app.json");
const reportsApp = require("../data/i18n-translations/reports-app.json");
const facilitiesApp = require("../data/i18n-translations/facilities-app.json");
const berthScheduleApp = require("../data/i18n-translations/berth-schedule-app.json");
const global = require("../data/i18n-translations/global.json");
const CbAppScaffold = require("../data/i18n-translations/cb-app-scaffold.json");
const statusBoardApp = require("../data/i18n-translations/status-board-app.json");
const camerasApp = require("../data/i18n-translations/cameras-app.json");
const berthRequestApp = require("../data/i18n-translations/berth-request.json");
const champApp = require("../data/i18n-translations/champ-app.json");
const camerasWallApp = require("../data/i18n-translations/camera-wall.json");
const lawApp = require("../data/i18n-translations/law-enforcement-search-app.json");
const listsApp = require("../data/i18n-translations/lists-app.json");
const rulesApp = require("../data/i18n-translations/rules-app.json");
const tableTopApp = require("../data/i18n-translations/tableTop-app.json");
const eventsApp = require("../data/i18n-translations/events-app.json");
const mapApp = require("../data/i18n-translations/map-app.json");

module.exports.applyScript = async function () {
	const scriptName = "create-locale-table";

	try {
		const tables = ["sys_locales"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				logger.info("applyScript", `Created table ${table}: ${ctResult}`);
			}
		}

		try {
			const addToSysLocales = r
				.table("sys_locales")
				.insert([settingsApp, replayApp, reportsApp, camerasApp, statusBoardApp,
					berthScheduleApp, facilitiesApp, global, CbAppScaffold, berthRequestApp,
					champApp, camerasWallApp, listsApp, lawApp, rulesApp, tableTopApp, eventsApp, mapApp
				])
				.run();
			console.log(`${scriptName} inserted rows in sys_locales result: `, addToSysLocales);
			return { success: true };
		} catch (err) {
			console.log(`There was an error with the ${scriptName} script:`, err);
			return { success: false, err };
		}

	}
	catch (err) {
		console.log("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};



