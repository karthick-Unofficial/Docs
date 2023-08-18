const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/snapshot.js");
const feedModel = require("../models/feedModel")({});
const eventModel = require("../models/eventModel")();
const shapeModel = require("../models/shapeModel")();
const facilitiesModel = require("../models/facilitiesModel")();
const cameraModel = require("../models/cameraModel")();
const accessPointModel = require("../models/accessPointModel")();
const listModel = require("../models/listModel")();
const moment = require("moment");
const esProvider = require("../lib/es-provider");
const esClient = esProvider.get();


module.exports = Snapshot;

function Snapshot() {
	if (!(this instanceof Snapshot)) return new Snapshot();
}

Snapshot.prototype.generate = async function () {
	const bulkIndexQueue = [];
	// get and merge other snapshots into single array
	const feedEntitiesSnapshot = await feedModel.getSnapshot(true);
	const eventsSnapshot = await eventModel.activeWithData(true);
	const shapesSnapshot = await shapeModel.getSnapshot(true);
	const facilitiesSnapshot = await facilitiesModel.getSnapshot(true);
	const camerasSnapshot = await cameraModel.getSnapshot(true);
	const accessPointsSnapShot = await accessPointModel.getSnapshot(true);
	// const listsSnapshot = await listModel.getSnapshot(true);
	const fullSnapshot = [...feedEntitiesSnapshot, ...eventsSnapshot, ...shapesSnapshot, ...facilitiesSnapshot, ...camerasSnapshot, ...accessPointsSnapShot];
	for (const evt of eventsSnapshot) evt.feedId = "event"; // isn't actually a feed but may leverage for auth in query
	const archiveDate = moment.utc();
	const archiveDateSuffix = archiveDate.format("YYYY-MM");
	for (const ent of fullSnapshot) {
		bulkIndexQueue.push({ "index": { "_index": `snapshot-${archiveDateSuffix}` } });
		const entSnapshot = {
			feedId: ent.feedId,
			snapshotDate: archiveDate,
			entity: ent
		};
		bulkIndexQueue.push(entSnapshot);
	}

	// -- todo: better strategy for handling problems. Could use health to notify of snapshot failures. Backout when there are failures
	const bulkResponse = await esClient.bulk({ refresh: true, body: bulkIndexQueue });

	const erroredDocuments = [];
	if (bulkResponse.errors) {
		// The items array has the same order of the dataset we just indexed.
		// The presence of the `error` key indicates that the operation
		// that we did for the document has failed.
		bulkResponse.items.forEach((action, i) => {
			const operation = Object.keys(action)[0];
			if (action[operation].error) {
				erroredDocuments.push({
					// If the status is 429 it means that you can retry the document,
					// otherwise it's very likely a mapping error, and you should
					// fix the document before to try it again.
					status: action[operation].status,
					error: action[operation].error,
					operation: bulkIndexQueue[i * 2],
					document: bulkIndexQueue[i * 2 + 1]
				});
			}
		});
		// todo: write errored records to a log, send a notification of failure (health)
		//console.log("ERROR DOCUMENTS", erroredDocuments);
	}

	delete bulkResponse.items;
	bulkResponse["errors"] = erroredDocuments;
	bulkResponse.count = bulkIndexQueue.length / 2;
	return bulkResponse;

	// esClient.bulk({
	// 	body: bulkIndexQueue
	// }, function (err, res) {
	// 	if (err) {
	// 		logger.error("snapshot bulkIndex", "Bulk index exception", { err: { message: err.message, stack: err.stack } });
	// 		return { success: false };
	// 	}
	// 	else {
	// 		logger.info("snapshot bulkIndex", "Bulk index success", { result: res });
	// 		return { success: true };
	// 	}
	// });

};

