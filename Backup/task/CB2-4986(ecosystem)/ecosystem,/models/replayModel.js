"use strict";
const REPLAY_TABLE = "sys_replay";
const USER_TABLE = "sys_user";

const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/replayModel.js");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const esProvider = require("../lib/es-provider");
const esOptions = {
	"requestTimeout": 60000
};
const esClient = esProvider.get(esOptions);
const moment = require("moment");
const _ = require("underscore");
const turf = require("@turf/turf");

const feedModel = new (require("./feedModel"));
const eventModel = new (require("./eventModel"));
const notificationModel = new (require("./notificationModel"));
const userPolicyCache = new (require("../lib/userPolicyCache"));

module.exports = ReplayModel;

function ReplayModel() {
	if (!(this instanceof ReplayModel)) return new ReplayModel();
}

/**
 * Save a replay
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {object} replay -- Replay object 
 */
ReplayModel.prototype.create = async function (userId, orgId, replay) {
	try {
		logger.info("create", "Entering function", { userId: userId, orgId: orgId, replay: replay });
		const newReplay = {
			...replay,
			owner: userId,
			ownerOrg: orgId,
			createdDate: new Date()
		};

		const result = await r.table(REPLAY_TABLE).insert(newReplay).run();

		return result;


	} catch (err) {
		logger.error("create", "Unexpected error", { userId: userId, orgId: orgId, replay: replay, errMessage: err.message, errStack: err.stack });
		throw err;
	}
};

/**
 * Update a replay
 * @param {string} userId -- User's id
 * @param {string} replayId -- Replay's id 
 * @param {object} replay -- Replay
 */
ReplayModel.prototype.update = async function (userId, replayId, replay) {
	try {
		logger.info("update", "Entering function", { userId: userId, replayId: replayId, replay: replay });
		const result = await r.table(REPLAY_TABLE).get(replayId).update(replay, { returnChanges: true });
		return result;

	} catch (err) {
		logger.error("update", "Unexpected error", { userId: userId, replayId: replayId, replay: replay, errMessage: err.message, errStack: err.stack });
		throw err;
	}
};

/**
 * Delete a replay
 * @param {string} userId -- User's id
 * @param {string} replayId -- Replay's id 
 */
ReplayModel.prototype.delete = async function (userId, replayIds) {
	try {
		logger.info("delete", "Entering function", { userId: userId, replayIds: replayIds });
		const result = await r.table(REPLAY_TABLE).getAll(r.args(replayIds)).delete({ returnChanges: true });
		return result;

	} catch (err) {
		logger.error("delete", "Unexpected error", { userId: userId, replayIds: replayIds, errMessage: err.message, errStack: err.stack });
		throw err;
	}
};

/**
* Get all saved replays in org
* @param {string} userId -- User's id
* @param {string} orgId
*/
ReplayModel.prototype.getAll = async function (userId, orgId) {
	try {		
		const result = await r.table(REPLAY_TABLE).filter(
			r.row("ownerOrg").eq(orgId)
		).merge((replay) => {
			return {
				owner: r.table(USER_TABLE).get(replay("owner")).pluck("name")("name")
			};
		}).run();
		logger.info("getAll", "Query result", { userId: userId, orgId: orgId, result: result });
		return result;
	} catch (err) {
		throw err;
	}
};

/**
* Get a single specified replay by Id
* @param {string} replayId -- Replay's id
*/
ReplayModel.prototype.getById = async function (replayId) {
	try {
		const result = await r.table(REPLAY_TABLE).get(replayId).run();
		logger.info("getById", "Query result", { replayId: replayId, result: result });
		return result;
	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};


/**
 * getReplayBuffer - calculate a buffer for track in time range at give distance
 * @param userId
 * @param entityId
 * @param fromDate
 * @param toDate
 * @param distance
 */

ReplayModel.prototype.getReplayBuffer = async function (userId, entityId, fromDate, toDate, distance) {

	if (!userId) return; // auth user against entity

	fromDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
	toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
	distance = parseFloat(distance);

	const txnsQ = {
		"size": 10000,
		"sort": [
			{
				"transactionTime": {
					"order": "asc"
				}
			}
		],
		"query": {
			"bool": {
				"must": [
					{
						"range": {
							"transactionTime": {
								"gte": fromDate,
								"lte": toDate
							}
						}
					},
					{
						"term": {
							"collectedItem.id": entityId
						}
					}
				]
			}
		}
	};

	logger.info("getReplayBuffer", "Elastic query", { query: txnsQ });

	const lineCoords = [];
	let scrollId = null;
	let txnResult = null;
	let txnCount = -1;
	try {
		while (txnCount !== 0) {
			txnCount = 0;
			if (!scrollId) {
				txnResult = await esClient.search({
					index: "feed-history-*",
					scroll: "5s",
					body: txnsQ
				});
				scrollId = txnResult._scroll_id;
			}
			else {
				txnResult = await esClient.scroll({
					"scroll_id": scrollId,
					"scroll": "5s"
				});
			}
		}
		for (const hit of txnResult.hits.hits) {
			txnCount++;
			lineCoords.push(hit._source.collectedItem.entityData.geometry.coordinates);
		}

		const lineToBuffer = turf.lineString(lineCoords);
		// result is a geojson feature
		const bufferPoly = turf.buffer(lineToBuffer, distance, { units: "miles" });

		logger.info("getReplayBuffer", "Generated buffer polygon", { bufferPoly: bufferPoly });

		//  todo add option for geojson
		return bufferPoly.geometry.coordinates;

	}
	catch (err) {
		logger.error("getReplayBuffer", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw { message: err.msg || err.message, code: err.statusCode };
	}


};

/**
 * getEventFilter
 * @param userId
 * @param eventId 
 */
ReplayModel.prototype.getEventGeometry = async function (userId, eventId) {
	let circlePoly = null;
	try {
		const event = await eventModel.getById(userId, eventId);
		const geo = event.entityData.geometry;
		const proximities = event.proximities;
		// we only need the largest proximity as they are all centered on event location
		let maxDistanceKm = 0;
		if (geo && proximities && proximities.length > 0) {
			for (const proximity of proximities) {
				// normalize values to km
				const r = parseFloat(proximity.radius);
				const distanceKm = proximity.distanceUnits === "km" ? r : r * 1.60934;
				maxDistanceKm = distanceKm > maxDistanceKm ? distanceKm : maxDistanceKm;
			}

			if (maxDistanceKm > 0) {
				// create a circle polygon using largest radius from proximities
				const options = { steps: 32, units: "kilometers" };
				circlePoly = turf.circle(geo.coordinates, maxDistanceKm, options);
				logger.info("getEventGeometry", "Generated circle polygon", { circlePoly: circlePoly });
			}
		}
	}
	catch (err) {
		logger.error("getReplayBuffer", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw { message: err.msg || err.message, code: err.statusCode };
	}

	return circlePoly.geometry.coordinates;

};

/**
 * getEventDateRange
 * @param userId
 * @param eventId 
 */
ReplayModel.prototype.getEventDateRange = async function (userId, eventId) {
	try {
		const event = await eventModel.getById(userId, eventId);
		if (event.startDate && event.endDate) {
			const from = new Date(event.startDate).toISOString();
			const to = new Date(event.endDate).toISOString();
			logger.info("getEventDateRange", "event date range", { event: event, from: from, to: to });
			return {
				from: from,
				to: to
			};
		}
		else {
			logger.error("getEventDateRange", "Cannot request replay history on an uncompleted event", { event: event });
			throw { "message": "Cannot request replay history on an uncompleted event", code: 500 };
		}
	}
	catch (err) {
		logger.error("getEventDateRange", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw err;
	}
};

/**
 * getReplayFilter
 * @param userId
 * @param filter 
 * @param geoPath - the path to geo property different for snapshot and txn
 */
ReplayModel.prototype.getReplayFilter = async function (userId, filter, geoPath) {

	logger.info("getReplayFilter", "Entering function", { userId: userId, filter: filter, geoPath: geoPath });

	let geoFilter = { "geo_shape": {} };
	geoFilter.geo_shape[geoPath] = {
		"shape": {
			"type": null,
			"coordinates": null
		},
		"relation": "intersects"
	};

	let includeEntities = null;
	let entity = null;
	let turfPoly = null;

	try {
		switch (filter.type) {
			case "bbox":
				geoFilter.geo_shape[geoPath].shape.type = "envelope";
				geoFilter.geo_shape[geoPath].shape.coordinates = filter.coordinates;
				turfPoly = turf.bboxPolygon([
					filter.coordinates[0][0],
					filter.coordinates[0][1],
					filter.coordinates[1][0],
					filter.coordinates[1][1]
				]);
				break;
			case "shape":
				entity = await feedModel.getEntityWithAuthorization(userId, filter.entityId, "shapes");
				if (entity) {
					geoFilter.geo_shape[geoPath].shape.type = "polygon";
					geoFilter.geo_shape[geoPath].shape.coordinates = entity.entityData.geometry.coordinates;
					turfPoly = turf.polygon(entity.entityData.geometry.coordinates);
				}
				else {
					throw { message: "Access Denied", code: 403 };
				}
				break;
			case "polygon":
				geoFilter.geo_shape[geoPath].shape.type = "polygon";
				geoFilter.geo_shape[geoPath].shape.coordinates = filter.coordinates;
				turfPoly = turf.polygon(filter.coordinates);
				break;
			case "buffer":
				geoFilter.geo_shape[geoPath].shape.type = "polygon";
				geoFilter.geo_shape[geoPath].shape.coordinates = await this.getReplayBuffer(userId, filter.entityId, filter.from, filter.to, filter.distance);
				turfPoly = turf.polygon(geoFilter.geo_shape[geoPath].shape.coordinates);
				break;
			case "event":
				geoFilter.geo_shape[geoPath].shape.type = "polygon";
				geoFilter.geo_shape[geoPath].shape.coordinates = await this.getEventGeometry(userId, filter.eventId);
				turfPoly = turf.polygon(geoFilter.geo_shape[geoPath].shape.coordinates);
				includeEntities = await eventModel.getEventEntityIds(userId, filter.eventId);
				break;
		}
	}
	catch (err) {
		logger.error("getReplayFilter", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw err;
	}

	if (geoFilter.geo_shape[geoPath].shape.coordinates === null)
		geoFilter = null;

	return {
		geoFilter: geoFilter,
		geoFilterPoly: turfPoly,
		includeEntities: includeEntities  // these are inclusive of geo, so they don't have to be in geo to be included
	};


};

// 4 options to filter for a replay
// All include date range
// 1) Map selection (envelope/bbox) If I passed as polygon make 1 and 2 the same unless I allow passing fo shape Id for 2
// 2) Map Zone - basically same as 1 but uses existing shape rather than bbox
// 3) Track - buffer around track in the time range determines "zone"
// 4) Event - largest proximity is zone, include all pinned/linked items

// May want to page or at least allow for it, could technicaly get large
/**
 * getSnapshot
 * @param userId
 * @param orgId 
 * @param entityId 
 * @param atDate - date to grab activities before
 */
ReplayModel.prototype.getSnapshot = async function (
	userId,
	atDate, // required
	filter // options for various replay types bbox, shape, entityId and buffer, eventId
) {

	logger.info("getSnapshot", "Entering function", { userId: userId, atDate: atDate, filter: filter });

	try {

		if (filter.type === "event") {
			const eventDateRange = await this.getEventDateRange(userId, filter.eventId);
			atDate = eventDateRange.from;
		}
		else {
			//atDate = atDate ? new Date(atDate).toISOString() : new Date().toISOString();

			//ISO string does not match the UTC date value stored in snapshots
			atDate = atDate ? moment.utc(atDate) : moment.utc(new Date());
			atDate.format("YYYY-MM");
		}

		const userIntIds = userPolicyCache.getUserIntegrations(userId).map((userInt) => userInt.intId);
		logger.info("getSnapshot", "Get user integration ids", { userId: userId, userIntIds: userIntIds });
		if (userPolicyCache.authorizeApplication(userId, "events-app")) {
			userIntIds.push("event");
		}


		// -- Get the first record with snapshotDate prior to or on fromDate
		// -- that will be the snapshotDate for all records we need for snapshot
		const snapDateQ = {
			"from": 0,
			"size": 1,
			"sort": [{
				"snapshotDate": {
					"order": "desc"
				}
			}],
			"query": {
				"bool": {
					"must": [{
						"range": {
							"snapshotDate": {
								"lte": atDate
							}
						}
					},
					{
						"terms": {
							"feedId": userIntIds
						}
					}
					]
				}
			}
		};

		logger.info("getSnapshot", "snapshot date query", { query: snapDateQ });

		// todo, only include indexes in date range
		const snapshotDateResult = await esClient.search({
			index: "snapshot-*",
			body: snapDateQ
		});

		const snapshotDoc = snapshotDateResult.hits.hits[0] ? snapshotDateResult.hits.hits[0]._source : null;

		if (!snapshotDoc) {
			// or could be because no integrations that match records in db
			logger.error("getSnapshot", "No snapshots exist prior to from date", { query: snapDateQ });
			throw { "message": "No snapshots exist prior to from date" };
		}

		logger.info("getSnapshot", "snapshot date doc", { doc: snapshotDoc });

		const snapFilters = await this.getReplayFilter(userId, filter, "entity.entityData.geometry");

		const snapQ = {
			"from": 0,
			"size": 10000,
			"query": {
				"bool": {
					"must": [
						{
							"term": {
								"snapshotDate": snapshotDoc.snapshotDate
							}
						},
						{
							"terms": {
								"feedId": userIntIds
							}
						}
					]
				}
			}
		};

		if (snapFilters.geoFilter && snapFilters.includeEntities) {
			snapQ.query.bool.must.push({
				"bool": {
					"should": [
						{
							"terms": {
								"entity.id": snapFilters.includeEntities
							}
						},
						snapFilters.geoFilter
					]
				}
			});
		}
		else if (snapFilters.geoFilter && (!snapFilters.includeEntities)) {
			snapQ.query.bool.must.push(snapFilters.geoFilter);
		}
		else if (!(snapFilters.geoFilter) && snapFilters.includeEntities) {
			snapQ.query.bool.must.push({
				"bool": {
					"should": [
						{
							"terms": {
								"entity.id": snapFilters.includeEntities
							}
						}
					]
				}
			});
		}

		logger.info("getSnapshot", "snapshot query", { query: snapQ });

		const snapshotResult = await esClient.search({
			index: "snapshot-*",
			body: snapQ
		});

		const txnFilters = await this.getReplayFilter(userId, filter, "collectedItem.entityData.geometry");
		const scrollSize = 10000;

		// now need most recent transactions for each unique entity from snapshotDate to current requested fromDate
		// and merge with base snapshot. This will bring the snapshot current to from date
		// these come from transactional indexes feed-history, entity-history
		// TODO: Need a consistent time for sort across feed-history and entity-history so need to update those processes to include a transactionTime
		//       which can vary by type...
		const uniqueTxnQ = {
			"size": scrollSize,
			"sort": [{
				"transactionTime": {
					"order": "desc"
				}
			}],
			"query": {
				"bool": {
					"must": [
						{
							"exists": { "field": "collectedItem.entityData.geometry" }
						},
						{
							"range": {
								"transactionTime": {
									"gte": snapshotDoc.snapshotDate,
									"lte": atDate
								}
							}
						},
						{
							"terms": {
								"collectedItem.feedId": userIntIds
							}
						}
					]
				}
			}
		};

		if (txnFilters.includeEntities) {
			uniqueTxnQ.query.bool.must.push({
				"bool": {
					"should": [
						{
							"terms": {
								"collectedItem.id": txnFilters.includeEntities
							}
						}
					]
				}
			});
		}

		logger.info("getSnapshot", "unique transactions query", { query: uniqueTxnQ });

		const snapshotSource = snapshotResult.hits.hits.map((hit) => hit._source);
		let resultTotal = -1;
		let mergedResult = [];
		let remainingTxnsInBBox = [];
		let scrollId = null;
		let processedIds = [];
		let runningTotal = 0;

		while (resultTotal === -1 || resultTotal === scrollSize) {
			let uniqueTxnResult = null;
			if (scrollId === null) {
				uniqueTxnResult = await esClient.search({
					index: "feed-history-*,entity-history-*",
					scroll: "10s",
					body: uniqueTxnQ
				});
				scrollId = uniqueTxnResult._scroll_id;
			}
			else {
				uniqueTxnResult = await esClient.scroll({
					body: {
						"scroll_id": scrollId,
						"scroll": "10s"
					}
				});
				scrollId = uniqueTxnResult._scroll_id;
			}
			resultTotal = uniqueTxnResult.hits.hits.length;
			runningTotal += resultTotal;
			logger.info("getSnapshot", `${runningTotal} of ${uniqueTxnResult.hits.total.value} fetched`);

			// -- TODO - When building snapshot will need to authorize events individually due to how they are shared
			// -- added filter to exclude any transactions already processed as was unable to effectively use collapse in query to get uniques
			// first exclude any already processed Ids
			const excludeProcessedTxnSource = uniqueTxnResult.hits.hits.map((hit) => hit._source)
				.filter((txn) => !processedIds.includes(txn.collectedItem.id));
			// now get most recent uniques
			const uniqueTxnSource = [];
			const idMap = new Map();
			for (const txn of excludeProcessedTxnSource) {
				if (!idMap.has(txn.collectedItem.id)) {
					idMap.set(txn.collectedItem.id, true);
					uniqueTxnSource.push(txn);
				}
			}

			processedIds = [...processedIds, ...uniqueTxnSource.map((txn) => txn.collectedItem.id)];

			for (const snap of snapshotSource) {
				try {
					if (!snap.isMerged) {
						const mergeItemIndex = uniqueTxnSource.findIndex((txn) => txn.collectedItem.id === snap.entity.id);
						if (mergeItemIndex && mergeItemIndex > -1) {
							const collectedItem = uniqueTxnSource[mergeItemIndex].collectedItem;

							let isInGeofFilter = false;
							if (collectedItem.entityData.geometry.type === "Point") {
								const point = turf.point(collectedItem.entityData.geometry.coordinates);
								isInGeofFilter = turf.booleanPointInPolygon(point, txnFilters.geoFilterPoly);
							}
							else if (collectedItem.entityData.geometry.type === "LineString") {
								const line = turf.lineString(collectedItem.entityData.geometry.coordinates);
								isInGeofFilter = turf.booleanWithin(line, txnFilters.geoFilterPoly) || turf.booleanIntersects(line, txnFilters.geoFilterPoly);
							}
							else if (collectedItem.entityData.geometry.type === "Polygon") {
								const poly = turf.polygon(collectedItem.entityData.geometry.coordinates);
								isInGeofFilter = turf.booleanWithin(poly, txnFilters.geoFilterPoly) || turf.booleanIntersects(poly, txnFilters.geoFilterPoly);
							}

							if (isInGeofFilter && (collectedItem.isActive === undefined || collectedItem.isActive === true)) {
								mergedResult.push(collectedItem);
							}
							uniqueTxnSource.splice(mergeItemIndex, 1);
							snap["isMerged"] = true;
						}
					}
				}
				catch (err) {
					logger.error("getSnapshot", "Unexpected error merging snapshot results.", { errMessage: err.message, errStack: err.stack, transaction: snap });
				}
			}

			const inBBox = uniqueTxnSource.filter((txn) => {
				try {
					if (txn.collectedItem.entityData.geometry && txn.collectedItem.entityData.geometry.coordinate) {
						if (txn.collectedItem.entityData.geometry.type === "Point") {
							const point = turf.point(txn.collectedItem.entityData.geometry.coordinates);
							return turf.booleanPointInPolygon(point, txnFilters.geoFilterPoly);
						}
						else if (txn.collectedItem.entityData.geometry.type === "LineString") {
							const line = turf.lineString(txn.collectedItem.entityData.geometry.coordinates);
							return turf.booleanWithin(line, txnFilters.geoFilterPoly) || turf.booleanIntersects(line, txnFilters.geoFilterPoly);
						}
						else if (txn.collectedItem.entityData.geometry.type === "Polygon") {
							const poly = turf.polygon(txn.collectedItem.entityData.geometry.coordinates);
							return turf.booleanWithin(poly, txnFilters.geoFilterPoly) || turf.booleanIntersects(poly, txnFilters.geoFilterPoly);
						}
					}
					else {
						logger.info("getSnapshot", "Filtering txns in bbox entity no geometry", { txn: txn });
					}
					return false;
				}
				catch (err) {
					logger.error("getSnapshot", "Unexpected error filtering txns in bbox entity.", { errMessage: err.message, errStack: err.stack, transaction: txn, boundingBox: txnFilters.geoFilterPoly });
					return false;
				}
			});

			remainingTxnsInBBox = [...remainingTxnsInBBox, ...inBBox];

		}

		// anything left in txns and isActive is new since snapshot just merge in
		mergedResult = [
			...mergedResult,
			...snapshotSource.filter((snap) => !snap.isMerged).map((snap) => snap.entity),
			...remainingTxnsInBBox
				.filter((txn) => txn.collectedItem.isActive === undefined || txn.collectedItem.isActive === true)
				.map((txn) => txn.collectedItem)];

		return {
			count: mergedResult.length,
			integrations: userIntIds,
			items: mergedResult
		};
	}
	catch (err) {
		logger.error("getSnapshot", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw err;
	}

};


/**
 * getTransactions
 * @param userId
 * @param fromDate 
 * @param toDate 
 * @param scrollId - for any page request after first to use existing scroll (if still active) - if not would run a new query, client needs to be cognizant of that
 * @param pageSize - number of transactions to include in each response
 * @param format native|geojson
 */
ReplayModel.prototype.getTransactions = async function (
	userId,
	fromDate, // required
	toDate, // required
	filter, // options for various replay types bbox, shape, entityId and buffer, eventId
	scrollId, // nullable
	pageSize = 1000,
	format = "native"
) {

	logger.info("getTransactions", "Entering function", {
		userId: userId,
		from: fromDate,
		to: toDate,
		filter: filter,
		scrollId: scrollId,
		pageSize: pageSize,
		format: format
	});

	if (filter.type === "event") {
		const eventDateRange = await this.getEventDateRange(userId, filter.eventId);
		fromDate = eventDateRange.from;
		toDate = eventDateRange.to;
	}
	else {
		fromDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
		toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
	}

	const userIntIds = userPolicyCache.getUserIntegrations(userId).map((userInt) => userInt.intId);
	logger.info("getTransactions", "user integration ids", { userIntIds: userIntIds });
	if (userPolicyCache.authorizeApplication(userId, "events-app")) {
		userIntIds.push("event");
	}

	if (pageSize > 1000) pageSize = 1000;

	const txnFilters = await this.getReplayFilter(userId, filter, "collectedItem.entityData.geometry");

	// for scroll pagesize will be consistent with initial request until final page and all results retrieved
	const txnQ = {
		"size": pageSize === -1 ? 10000 : pageSize, // page size, -1 returns all in one shot so use max for elastic
		"sort": [{
			"transactionTime": {
				"order": "asc"
			}
		}],
		"query": {
			"bool": {
				"must": [{
					"range": {
						"transactionTime": {
							"gt": fromDate,
							"lte": toDate
						}
					}
				},
				{
					"terms": {
						"collectedItem.feedId": userIntIds
					}
				}
				]
			}
		}
	};

	if (txnFilters.geoFilter && txnFilters.includeEntities) {
		txnQ.query.bool.must.push({
			"bool": {
				"should": [
					{
						"terms": {
							"entity.id": txnFilters.includeEntities
						}
					},
					txnFilters.geoFilter
				]
			}
		});
	}
	else if (txnFilters.geoFilter && (!txnFilters.includeEntities)) {
		txnQ.query.bool.must.push(txnFilters.geoFilter);
	}
	else if (!(txnFilters.geoFilter) && txnFilters.includeEntities) {
		txnQ.query.bool.must.push({
			"bool": {
				"should": [
					{
						"terms": {
							"entity.id": txnFilters.includeEntities
						}
					}
				]
			}
		});
	}

	logger.info("getTransactions", "get transactions query", { query: txnQ });

	let txnResult = null;
	try {
		if (!scrollId) {
			txnResult = await esClient.search({
				index: "feed-history-*,entity-history-*",
				scroll: "30s",
				body: txnQ
			});
		}
		else {
			txnResult = await esClient.scroll({
				"scroll_id": scrollId,
				"scroll": "30s"
			});
		}
	}
	catch (err) {
		logger.error("getTransactions", "Unexpected error querying transactions", { errMessage: err.message, errStack: err.stack });
		throw { message: err.msg || err.message, code: err.statusCode };
	}

	// -1 = no paging return all results in one shot
	if (pageSize === -1) {
		while (txnResult.hits.total.value !== txnResult.hits.hits.length) {
			const partialResult = await esClient.scroll({
				"scroll_id": txnResult._scroll_id,
				"scroll": "10s"
			});
			txnResult.hits.hits = [...txnResult.hits.hits, ...partialResult.hits.hits];
		}
	}

	const txnSource = txnResult.hits.hits.map((hit) => {
		const ent = hit._source.collectedItem;
		ent["transactionTime"] = ent.entityType === "track" ? ent.acquisitionTime : ent.lastModifiedDate ? ent.lastModifiedDate : ent.lastModified;
		return hit._source.collectedItem;
	});

	let resultItems = null;
	if (format === "geojson") {
		resultItems = {
			"type": "FeatureCollection",
			"features": []
		};
		for (const txn of txnSource) {
			resultItems.features.push({
				...{ "type": "Feature" },
				...txn.entityData
			});
		}
	}
	else {
		resultItems = _.groupBy(txnSource, function (txn) {
			return moment(txn.transactionTime).endOf("second").add(1, "ms").toISOString();
		});
	}

	const result = {
		scrollId: txnResult._scroll_id,
		total: txnResult.hits.total.value,
		count: txnSource.length,
		items: resultItems
	};

	return result;

};

ReplayModel.prototype.mergeActivities = async function (
	userId,
	filter, // options for various replay types bbox, shape, entityId and buffer, eventId
	notifications
) {

	logger.info("mergeActivities", "Entering function", { userId: userId, filter: filter });

	const notificationActivityIds = notifications.map((notification) => notification.activityId);
	const uniqueNotificationActivityIds = _.uniq(notificationActivityIds);

	const activityFilters = await this.getReplayFilter(userId, filter, "geometry");

	// will need to authorize each activity individually after they have been matched up with a notification
	const activityQ = {
		"size": 10000, // page size
		"sort": [{
			"activityDate": {
				"order": "asc"
			}
		}],
		"query": {
			"bool": {
				"must": [
					{
						"terms": {
							"id": uniqueNotificationActivityIds
						}
					}
					// not required because notifications are in range so any related activities should be included
					// ,{
					// 	"range": {
					// 		"activityDate": {
					// 			"gt": fromDate,
					// 			"lte": toDate
					// 		}
					// 	}
					// }
				]
			}
		}
	};

	if (activityFilters.geoFilter && activityFilters.includeEntities) {
		activityQ.query.bool.must.push({
			"bool": {
				"should": [
					{
						"terms": {
							"object.id": activityFilters.includeEntities
						}
					},
					{
						"terms": {
							"target.id": activityFilters.includeEntities
						}
					},
					activityFilters.geoFilter
				]
			}
		});
	}
	else if (activityFilters.geoFilter && (!activityFilters.includeEntities)) {
		activityQ.query.bool.must.push(activityFilters.geoFilter);
	}
	else if (!(activityFilters.geoFilter) && activityFilters.includeEntities) {
		activityQ.query.bool.must.push({
			"bool": {
				"should": [
					{
						"terms": {
							"entity.id": activityFilters.includeEntities
						}
					},
					{
						"terms": {
							"target.id": activityFilters.includeEntities
						}
					}
				]
			}
		});
	}

	logger.info("mergeActivities", "Activity query", { query: activityQ });

	let activityResult = null;
	try {
		activityResult = await esClient.search({
			index: "activity-stream-*",
			body: activityQ
		});
	}
	catch (err) {
		logger.error("mergeActivities", "Unexpected error querying activities", { errMessage: err.message, errStack: err.stack });
		throw { message: err.msg || err.message, code: err.statusCode };
	}

	const activitySource = activityResult.hits.hits.map((hit) => hit._source);
	const azActivities = activitySource.filter((activity) => {
		return userPolicyCache.authorizeActivity(userId, activity);
	});

	const activityDict = {};
	for (const azActivity of azActivities) {
		activityDict[azActivity.id] = azActivity;
	}

	const result = [];
	for (const notification of notifications) {
		const notificationActivity = activityDict[notification.activityId];
		if (notificationActivity) {
			result.push({ ...notificationActivity, ...notification });
		}
	}

	return result;

};

/**
 * getNotificationTimeline
 * @param userId
 * @param fromDate 
 * @param toDate 
 * @param filter 
 */
ReplayModel.prototype.getNotificationTimeline = async function (
	userId,
	fromDate, // required
	toDate, // required
	filter // options for various replay types bbox, shape, entityId and buffer, eventId
) {

	try {
		if (filter.type === "event") {
			const eventDateRange = await this.getEventDateRange(userId, filter.eventId);
			fromDate = eventDateRange.from;
			toDate = eventDateRange.to;
		}
		else {
			fromDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
			toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
		}

		const userIntIds = userPolicyCache.getUserIntegrations(userId).map((userInt) => userInt.intId);
		if (userPolicyCache.authorizeApplication(userId, "events-app")) {
			userIntIds.push("event");
		}

		const priorityNotificationsInRange = await notificationModel.getUserNotificationsCreatedInDateRange(userId, fromDate, toDate);
		//const notificationActivityIds = priorityNotificationsInRange.map((notification) => notification.activityId);

		// merge activities
		const result = await this.mergeActivities(userId, filter, priorityNotificationsInRange);

		const groups = _.groupBy(result, function (notification) {
			return moment(notification.createdDate).endOf("second").add(1, "ms").toISOString();
		});

		return {
			total: result.length,
			items: groups
		};
	}
	catch (err) {
		logger.error("getNotificationTimeline", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw err;
	}

};


/**
 * getTimelineNotifications
 * @param userId
 * @param fromDate 
 * @param toDate 
 */
ReplayModel.prototype.getNotificationTransactions = async function (
	userId,
	fromDate, // required
	toDate, // required
	filter // options for various replay types bbox, shape, entityId and buffer, eventId
) {

	try {
		if (filter.type === "event") {
			const eventDateRange = await this.getEventDateRange(userId, filter.eventId);
			fromDate = eventDateRange.from;
			toDate = eventDateRange.to;
		}
		else {
			fromDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
			toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
		}

		const userIntIds = userPolicyCache.getUserIntegrations(userId).map((userInt) => userInt.intId);
		if (userPolicyCache.authorizeApplication(userId, "events-app")) {
			userIntIds.push("event");
		}

		const notifications = await notificationModel.getUserNotificationHistory(userId, fromDate, toDate);
		//const notificationActivityIds = priorityNotificationsInRange.map((notification) => notification.activityId);

		// merge activities
		const result = await this.mergeActivities(userId, filter, notifications);

		const groups = _.groupBy(result, function (notification) {
			return moment(notification.lastModifiedDate).endOf("second").add(1, "ms").toISOString();
		});

		return {
			total: result.length,
			items: groups
		};
	}
	catch (err) {
		logger.error("getNotificationTransactions", "Unexpected error", { errMessage: err.message, errStack: err.stack });
		throw err;
	}

};