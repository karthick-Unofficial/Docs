import { feedService } from "client-app-core";
export {
	editAssignment
} from "../BerthGroup/BerthTimeline/berthTimelineActions";
export { setDay } from "../DateControls/dateControlsActions";
import * as t from "./actionTypes";

export const openEventForm = () => {
	return {
		type: t.OPEN_EVENT_FORM
	};
};

export const openBerthMap = () => {
	return {
		type: t.OPEN_BERTH_MAP
	};
};

export const closeBerthMap = () => {
	return {
		type: t.CLOSE_BERTH_MAP
	};
};

export const trackReceived = data => {
	return {
		type: t.TRACK_RECEIVED,
		payload: { data }
	};
};

export const addSubscription = sub => {
	return {
		type: t.ADD_SUBSCRIPTION,
		payload: { sub }
	};
};

export const removeSubscriptions = () => {
	return {
		type: t.REMOVE_SUBSCRIPTIONS
	};
};

export const updateView = (page) => {
	return {
		type: t.UPDATE_VIEW,
		payload: { page }
	};
};

export const startMapStreams = (mapFeedIds, mapInclusionZone) => {
	return dispatch => {
		// -- start map feed subscription(s)
		mapFeedIds.forEach(feedId => {
			feedService.subscribeFilteredFeed(
				"external",
				feedId,
				{
					expandRefs: false,
					inclusionGeo: mapInclusionZone
				},
				(err, response) => {
					if (err) {
						console.log(err);
					} else {
						if (response && response.changes && response.changes.length > 0) {
							response.changes.forEach(change => {
								if (change && change.new_val) {
									const data = {
										"entityData": {
											"geometry": change.new_val.entityData.geometry,
											"properties": {
												"course": change.new_val.entityData.properties.course,
												"dimA": change.new_val.entityData.properties.dimA,
												"dimB": change.new_val.entityData.properties.dimB,
												"dimC": change.new_val.entityData.properties.dimC,
												"dimD": change.new_val.entityData.properties.dimD,
												"disposition": change.new_val.entityData.properties.disposition,
												"iconType": change.new_val.entityData.properties.iconType,
												"length": change.new_val.entityData.properties.length,
												"name": change.new_val.entityData.properties.name,
												"width": change.new_val.entityData.properties.width
											}
										},
										"id": change.new_val.id
									};
									dispatch(trackReceived(data));
								}
							});
						}
					}
				},
				true,
				[])
				.then(sub => {
					dispatch(addSubscription(sub));
				});
		});

		// -- open map
		dispatch(openBerthMap());
	};
};

export const stopMapStreams = (subscriptions) => {
	return dispatch => {
		// -- close map feed subscription(s)
		subscriptions.forEach(sub => {
			sub.unsubscribe();
		});

		// -- remove subscription references and close map
		dispatch(removeSubscriptions());
		dispatch(closeBerthMap());
	};
};

export const updateBerthView = (currentView) => {
	return dispatch => {
		if (currentView === "schedule") {
			dispatch(updateView("agenda"));
		}
		else if (currentView === "agenda") {
			dispatch(updateView("schedule"));
		}
	};
};