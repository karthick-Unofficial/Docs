import { feedService, authExclusionService } from "client-app-core";
import * as t from "./actionTypes";
import { closeSecondary } from "../../ContextPanel/Actions/index";
import each from "lodash/each";
import { eventRemoved } from "../Events/actions";
import { unsubscribe } from "../../ContextualData/Actions";
import { subscriptionDataRemoved } from "../../ContextualData/contextStreaming";
import { viewingHistorySelector } from "../../ContextPanel/Selectors";
import { viewPrevious } from "../../ContextPanel/Actions";
import { removeDockedCameraById } from "orion-components/Dock/Actions/index";

export { subscribeCameras } from "../Cameras/actions";
export { subscribeCollections } from "../Collections/actions";
export { getAllEvents, getEventTypes, updateEvent, getAllTemplates, eventUpdated } from "../Events/actions";
export { subscribeRules } from "../Rules/actions";
export { subscribeFeedPermissions, setFeedPermissions, subscribeAppFeedPermissions } from "../Feeds/actions";
export { fetchGISData } from "../GIS/actions";
export { subscribeFOVs, unsubscribeFOVs } from "../FOVs/actions";
export {
	getAllLists,
	createList,
	getLookupValues,
	updateList,
	deleteList,
	streamLists,
	duplicateList
} from "../Lists/actions";
export {
	getAllListCategories,
	getListCategory,
	createListCategory,
	updateListCategory,
	deleteListCategory,
	streamListCategories
} from "../ListCategories/actions";
export { subscribeExclusions } from "../Exclusions/actions";
export * from "orion-components/Map/Controls/Actions";
export { subscribeFloorPlansWithFacilityFeedId } from "../FloorPlan/actions";
export { subscribeUnitMembers } from "../UnitMembers/actions";
export { subscribeUnits } from "../Units/actions";

/*
 * Add an initial batch of data to state
 * @param data: an array of data objects
 * @param feedId: id of updated feed
 * @param key: key to store data by
 */
export const dataBatchReceived = (data, feedId, batch, key = "id") => {
	return {
		type: t.DATA_BATCH_RECEIVED,
		payload: { data, feedId, batch, key }
	};
};

/*
 * Add or update a data in state
 * @param data: a data object
 * @param feedId: id of updated feed
 * @param key: key to store data by
 */
export const dataReceived = (data, feedId, batch, key = "id") => {
	return {
		type: t.DATA_RECEIVED,
		payload: { data, feedId, batch, key }
	};
};

/*
 * Remove data in state
 * @param dataId: id of data being removed
 * @param feedId: id of updated feed
 */
const dataRemoved = (dataId, feedId, batch) => {
	return {
		type: t.DATA_REMOVED,
		payload: { dataId, feedId, batch }
	};
};

/*
 * Check if entity is loaded in profile then remove data in state
 * @param id: id of data being removed
 * @param feedId: id of updated feed
 * @param deleting: whether entity is being deleted to control profile and context state.
 */
export const removeData = (id, feedId, batch, deleting = true) => {
	return (dispatch, getState) => {
		const appState = getState().appState;
		const selectedEntity =
			appState && appState.contextPanel && appState.contextPanel.profile
				? appState.contextPanel.profile.selectedEntity
				: null;
		// Close profile on delete
		if (deleting && selectedEntity && selectedEntity.id === id) dispatch(closeSecondary());

		dispatch(dataRemoved(id, feedId, batch));
	};
};

/*
 * Set reference to feed's subscription
 * @param channel: reference to subscription channel for unsubscribing
 */
export const setDataSubscription = (channel, feedId, batch) => {
	return {
		type: t.SET_DATA_SUBSCRIPTION,
		payload: { channel, feedId, batch }
	};
};

export const runQueue = (feedId, batch) => {
	return {
		type: t.RUN_QUEUE,
		payload: { feedId, batch }
	};
};

/*
 * Subscribe to a global feed using a system-based changefeed.
 */
export const subscribeData = (feedId) => {
	return (dispatch) => {
		// Now that global reducers are dynamically generated, we needed to add
		// FOVs to the array of reducers to generate. FOVs, however, are not a
		// subscribable feed type for this method, so we ignore them.
		if (feedId === "fovs") return;
		feedService
			.subscribeGlobalFeed(feedId, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				// If data is streaming in one by one
				// *This is the case for some internal feeds like cameras and shapes
				if (response.type) {
					switch (response.type) {
						case "add":
						case "initial":
						case "change":
							dispatch(dataReceived(response.new_val, feedId, response.batch));
							break;
						case "remove":
							dispatch(removeData(response.old_val.id, feedId, response.batch));
							break;
						default:
							break;
					}
				} else if (response && response.changes) {
					const batch = response.batch;
					const initial = response.changes
						.filter((change) => {
							return change.type === "initial";
						})
						.map((change) => {
							return change.new_val;
						});

					const changes = response.changes
						.filter((change) => {
							return change.type === "change";
						})
						.map((change) => {
							return change.new_val;
						});

					const additions = response.changes
						.filter((change) => {
							return change.type === "add";
						})
						.map((change) => {
							return change.new_val;
						});

					const removals = response.changes
						.filter((change) => {
							return change.type === "remove";
						})
						.map((change) => {
							return change.old_val.id;
						});

					if (initial.length) {
						dispatch(dataBatchReceived(initial, feedId, batch));
					}
					if (changes.length) {
						dispatch(dataBatchReceived(changes, feedId, batch));
					}
					if (removals.length) {
						each(removals, (id) => dispatch(removeData(id, feedId, batch)));
					}
					if (additions.length) {
						dispatch(dataBatchReceived(additions, feedId, batch));
					}
				}
			})
			.then((subscription) => {
				// Passing "all" as the batch allows the subscription to be set
				// on all streams created by this method
				dispatch(setDataSubscription(subscription.channel, feedId, "all"));
			});
	};
};

/**
 * Add an entity to authExclusion to ignore it on the front end
 * @param {string} entityId
 * @param {string} entityType
 * @param {string} feedId
 * @param {function} appData -- Function that returns either an array of batches to update in global state, or an app id to do custom state removal
 */
export const ignoreEntity = (entityId, entityType, feedId, appData) => {
	return (dispatch, getState) => {
		authExclusionService.ignoreEntity(entityId, entityType, feedId, (err, res) => {
			if (err) {
				console.log("Error ignoring entity:", err);
			}
			if (res) {
				if (res.result.inserted === 1) {
					// Get batch types per app to update in
					const appDataObj = appData(entityType);
					const { appSpecifics, isGlobal } = appDataObj;

					// If entity is a camera, check to see if we should remove it from the camera dock
					if (entityType === "camera") {
						dispatch(removeDockedCameraById(entityId));
					}

					// If the data is stored in global state, update it
					// All data in map-app, events in events app, cameras in cameras app
					if (isGlobal) {
						const availableReducers = appSpecifics;

						// For each batch type, remove the entity from that batch
						availableReducers.forEach((batch) => {
							if (feedId === "event") {
								dispatch(closeSecondary());
								dispatch(eventRemoved(entityId));
							} else {
								dispatch(removeData(entityId, feedId, batch));
							}
						});
					}
					// If the data is not stored in global state, update it where it is stored per app
					else {
						const app = appSpecifics;
						const contextPanelData = getState().appState.contextPanel.contextPanelData;
						const { selectedContext } = contextPanelData;
						const { primary } = selectedContext;

						const contextUpdateId = primary;
						const viewingHistory = viewingHistorySelector(getState());

						switch (app) {
							// In events app, any non-event entity is stored as a pinned item on the primary event context
							case "events": {
								dispatch(viewPrevious(viewingHistory));
								dispatch(subscriptionDataRemoved(contextUpdateId, entityId, "pinnedItems"));
								break;
							}
							// In cameras app, any non-camera entity is stored as an fov item on the primary camera context
							case "cameras": {
								dispatch(viewPrevious(viewingHistory));
								dispatch(subscriptionDataRemoved(contextUpdateId, entityId, "fovItems"));
								break;
							}
							default:
								console.log(`No case for ${app} exists when hiding entity`);
								break;
						}
					}
				}
			}
		});
	};
};

/*
 * Subscribe to a feed
 * @param feedId: id of feed to subscribe to
 * @param source: app or int (found on integration object)
 */
export const subscribeFeed = (feedId, source = "app") => {
	return (dispatch) => {
		dispatch(subscribeData(feedId, source));
	};
};

const unsub = (feedId) => {
	return {
		type: t.UNSUB_GLOBAL_FEED,
		payload: {
			feedId,
			batch: "all"
		}
	};
};

export const unsubscribeGlobalFeed = (feedId, channel) => {
	return (dispatch) => {
		dispatch(unsubscribe(channel));
		dispatch(unsub(feedId));
	};
};
