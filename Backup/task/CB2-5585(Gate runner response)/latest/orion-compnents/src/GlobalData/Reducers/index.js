import keyBy from "lodash/keyBy";
import uniq from "lodash/uniq";
import filter from "lodash/filter";

export { default as collections } from "../Collections/reducer";
export { default as cameras } from "../Cameras/reducer";
export { default as events } from "../Events/reducer";
export { default as rules } from "../Rules/reducer";
export { default as userFeeds } from "../Feeds/reducer";
export { default as gisData } from "../GIS/reducer";
export { default as listLookupData } from "../Lists/reducer";
export { default as listCategories } from "../ListCategories/reducer";
export { default as exclusions } from "../Exclusions/reducer";
export { default as floorPlan } from "../FloorPlan/reducer";

// Coming from Dock component
export { notifications } from "../../Dock/Reducers";

const initialState = {
	data: {},
	dataById: [],
	dataQueue: {},
	dataByIdQueue: [],
	dataRemoveQueue: []
};
export const dataByFeed = (feedId = "", batchType = "", useQueue = false) => {
	const entities = (state = initialState, action) => {
		const { type, payload } = action;
		// Prevents crash when loading app
		if (!payload) return state;
		// IMPORTANT: For whatever reason, the logic here to return state in the case of different batchType or feedId
		// will ONLY work if it's nested if() statements like this. I have no clue why.
		if (payload) {
			if (payload.batch === batchType || payload.batch === "all") {
				if (feedId === payload.feedId) {
					switch (type) {
						case "DATA_BATCH_RECEIVED": {
							const { data, key } = payload;
							const newData = !useQueue ? { ...state.data } : { ...state.dataQueue };
							const newBatch = keyBy(data, key);
							const newBatchIds = Object.keys(newBatch);

							if (!newData) {
								return {
									...state,
									data: newBatch,
									dataById: newBatchIds
								};
							} else {
								const update = {};
								for (const id in { ...newData, ...newBatch }) {
									update[id] = deepMerge((newData[id] || {}), newBatch[id]);
								}
								if (useQueue) {
									// -- remove queuedRemoves if in new batch
									const newDataRemoveQueue = [...state.dataRemoveQueue];
									newBatchIds.forEach(id => {
										const index = newDataRemoveQueue.indexOf(id);
										if (index !== -1) {
											newDataRemoveQueue.splice(index, 1);
										}
									});

									return {
										...state,
										dataQueue: { ...update },
										dataByIdQueue: uniq([...state.dataByIdQueue, ...newBatchIds]),
										dataRemoveQueue: newDataRemoveQueue
									};
								} else {
									return {
										...state,
										data: { ...update },
										dataById: uniq([...state.dataById, ...newBatchIds])
									};
								}
							}
						}
						case "DATA_RECEIVED": {
							const { data, key } = payload;

							const newData = !useQueue ? { ...state.data } : { ...state.dataQueue };

							if (!newData) {
								return {
									...state,
									data: {
										[data[key]]: data
									},
									dataById: [data.id]
								};
							} else {
								// Merge data if obj already exists, otherwise just add object
								const update = newData[data[key]]
									? deepMerge(newData[data[key]], data)
									: data;

								if (useQueue) {
									// -- remove queuedRemoves if in new batch
									const newDataRemoveQueue = [...state.dataRemoveQueue];
									const index = newDataRemoveQueue.indexOf(data.id);
									if (index !== -1) {
										newDataRemoveQueue.splice(index, 1);
									}

									return {
										...state,
										dataQueue: { ...newData, [data[key]]: update },
										dataByIdQueue: uniq([...state.dataByIdQueue, data.id]),
										dataRemoveQueue: newDataRemoveQueue
									};
								} else {
									return {
										...state,
										data: {
											...newData,
											[data[key]]: update
										},
										dataById: uniq([...state.dataById, data.id])
									};
								}
							}
						}
						case "DATA_REMOVED": {
							const { dataId } = payload;

							if (useQueue) {
								return {
									...state,
									dataRemoveQueue: uniq([...state.dataRemoveQueue, dataId])
								};
							} else {
								const newData = { ...state.data, ...state.dataQueue };
								const newDataById = filter([...state.dataById, ...state.dataByIdQueue], id => {
									return id !== dataId;
								});

								delete newData[dataId];

								return {
									...state,
									data: newData,
									dataById: newDataById
								};
							}
						}
						case "SET_DATA_SUBSCRIPTION": {
							const { channel } = payload;

							return {
								...state,
								subscription: channel
							};
						}
						case "UNSUB_GLOBAL_FEED": {
							return {
								...state,
								subscription: null
							};
						}
						case "RUN_QUEUE": {
							if (useQueue) {
								// -- merge queued data with current data
								const newData = { ...state.data, ...state.dataQueue };
								const newDataById = uniq([...state.dataById, ...state.dataByIdQueue]);

								// -- remove data queued up for removal
								state.dataRemoveQueue.forEach(dataId => {
									delete newData[dataId];
									const index = newDataById.indexOf(dataId);
									if (index !== -1) {
										newDataById.splice(index, 1);
									}
								});

								return {
									...state,
									data: newData,
									dataById: newDataById,
									dataQueue: {},
									dataByIdQueue: [],
									dataRemoveQueue: []
								};
							} else {
								return state;
							}
						}
						default:
							return state;
					}
				} else {
					return state;
				}
			} else {
				return state;
			}
		} else {
			return state;
		}
	};
	return entities;
};

// -- Simple object check. Arrays return false
function isObject(item) {
	return (!!item && typeof item === "object" && !Array.isArray(item));
}

// -- Deep merge two objects.
function deepMerge(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return deepMerge(target, ...sources);
}
