const provider = require("../../lib/rethinkdbProvider");
const r = provider.r;
const esProvider = require("../../lib/es-provider");
const client = esProvider.get({ "requestTimeout": 30000 });


module.exports.applyScript = async function() {
	const scriptName = "rename-event-last-modified";

	try {

		// add lastModifiedDate key
		const addLMDKeyResult = await r.table("sys_event")
			.update({ "lastModifiedDate": r.row("lastModified") }).run();

		if(addLMDKeyResult.errors > 0) {
			throw { message: "errors encountered adding lastModifiedDate key", result: addLMDKeyResult };
		}
	
		// remove old key
		const removeLMKeyResult =  await r.table("sys_event").replace(r.row.without("lastModified"));
		if(removeLMKeyResult.errors > 0) {
			throw { message: "errors encountered removing lastModified key", result: removeLMKeyResult };
		}

		// update entity-history to reflect modifications
		const q = {
			"script": {
				"source": "ctx._source.collectedItem.feedId='event';ctx._source.collectedItem.lastModifiedDate=ctx._source.collectedItem.lastModified;ctx._source.collectedItem.remove('lastModifedDate');ctx._source.collectedItem.remove('lastModified')",
				"lang": "painless"
			},
			"query": {
				"bool": {
					"must": [
						{
							"match": {
								"collectedItem.entityType": "event"
							}
						}
					]
				}
			}
		};

		const esUpdateResult = await client.updateByQuery({
			refresh: true,
			index: "entity-history-*",
			body: q
		});
		if(esUpdateResult.failures.length > 0) {
			throw { message: "errors encountered updating elasticsearch entity-history-*", result: esUpdateResult };
		}

			
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {"success": false, err};
	}
};