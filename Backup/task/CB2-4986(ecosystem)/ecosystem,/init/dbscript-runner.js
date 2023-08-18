const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/dbscript-runner.js");
const config = require("../config.json");
const _scripts = require("./dbscripts");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r;

const MIGRATION_TABLE = "sys_migration";
const STATE_TABLE = "sys_state";
const LAST_SCRIPT_ID = "last.script.id";

const _runScripts = async function() {

	const hasDB = await r.dbList().contains(config.dbOptions.db).run();
	logger.info("_runScripts", `Rethink has DB ${config.dbOptions.db}: ${hasDB}`);
	if(!hasDB) {
		const dbCreateResult = await r.dbCreate(config.dbOptions.db);
		logger.info("_runScripts", `Created database ${config.dbOptions.db}`, { result: dbCreateResult });
	}

	let migrateSuccess = true;
	let lastScript = "";
	let lastScriptIndex = -1;
	const hasStateTable = await r.tableList().contains(STATE_TABLE).run();
	const hasMigrationTable = await r.tableList().contains(MIGRATION_TABLE).run();
	if(!hasMigrationTable) {
		// assume rightly this is first time with changes
		// get last script ran from old state table create the new one with all old entries and then resume
		const tableCreateResult = await r.tableCreate(MIGRATION_TABLE);
		logger.info("_runScripts", `Created table ${MIGRATION_TABLE}`, { result: tableCreateResult });
		if(hasStateTable) { 
			// first time ran since changes to migration table
			// - get last script ran via old method using sys_state table
			// - update migrations table so we are tracking correctly point forward
			// - set lastScriptIndex accordingly so new scripts will be applied
			console.log("Transitioning to new migration system. Determine and update migration table to reflect current DB state");
			const previousRuns = [];
			const lastScriptResult = await r.table(STATE_TABLE).get(LAST_SCRIPT_ID);
			const lastScript = lastScriptResult.lastScript;
			lastScriptIndex = _scripts.findIndex((script) => script.key === lastScript);
			for(let idx = 0; idx <= lastScriptIndex; idx++) {
				const prevousScript = _scripts[idx];
				previousRuns.push({
					"sequence": idx,
					"script": prevousScript.key,
					"runDate": new Date(),
					"result": "transitioned to new migration model",
					"success": true
				});
			}
			if(previousRuns.length > 0) {
				const insertPrevScriptRunsResult = await r.table(MIGRATION_TABLE).insert(previousRuns);
				logger.info("_runScripts", `Successfully inserted previous runs into ${MIGRATION_TABLE} table`, { result: insertPrevScriptRunsResult });
			}
		}
	}
	else {
		const lastScriptResult = await r.table(MIGRATION_TABLE)
			.orderBy(r.desc("sequence"))
			.limit(1)(0).default(null);
		if(lastScriptResult) {
			lastScriptIndex = lastScriptResult.sequence;
			lastScript = lastScriptResult.script;
			logger.info("_runScripts", "last script applied", { lastScript: lastScript });
		}
	}

	try {

		if(lastScriptIndex === (_scripts.length - 1)) {
			console.log("Database is already up to date");
		}
		else {

			console.log("New migrations are available. Updating database.");
 
			for (let idx = lastScriptIndex + 1; idx < _scripts.length; idx++) {
				const script = _scripts[idx];
				const lastScriptOp = {
					"sequence": idx,
					"script": script.key,
					"runDate": new Date(),
					"result": null,
					"success": true
				};
				try {
					console.log(`Applying migration script ${script.key}`);
					const result = await script.export.applyScript();
					// need to make sure the result is meaningful, i.e. whatever is returned from rethink or any exceptions
					lastScriptOp.result = result;
					if (result.success) {
						console.log(`Script ${script.key} completed successfully`);
					}
					else {
						lastScriptOp.success = false;
						logger.error("_runScripts", `Script ${script.key} encountered an error!`, { result: result });
						console.log(`Script ${script.key} encountered an error!`);
					}
				}
				catch(err) {
					lastScriptOp.result = { errMsg: err.message, errStack: err.stack };
					lastScriptOp.success = false;
					logger.error("_runScripts", `Migration Script ${script.key} failed with unexpected error`, { err: { message: err.message, stack: err.stack } });
				}
				const insertScriptResult = await r.table(MIGRATION_TABLE).insert(lastScriptOp);
				logger.info("_runScripts", "Script result added to ${MIGRATION_TABLE} table", { result: insertScriptResult });
				// -- if migration failed blow out
				if(!lastScriptOp.success) {
					migrateSuccess = false;
					break;
				}
			}
		}
	}
	catch(err) {
		migrateSuccess = false;
		logger.error("_runScripts", "Migration failed with unexpected error", { err: { message: err.message, stack: err.stack } });
	}

	return { "success": migrateSuccess };
};


module.exports.run = _runScripts;
