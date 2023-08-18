import { feedService } from "client-app-core";

import * as t from "./actionTypes";
import { setLoading } from "../../AppState/Actions";
import {
	addContext,
	updateContext,
	subscriptionReceived
} from "../../ContextualData/Actions";
import {
	setSelectedEntity,
	clearSelectedEntity
} from "../../Profiles/ProfileState/Actions/index";

import {
	unsubscribeFromFeed,
	removeProfileSubscription
} from "../../ContextualData/Actions/index";

import _ from "lodash";

// Open List Panel
export const openPrimary = () => {
	return {
		type: t.OPEN_PRIMARY
	};
};

// Close List Panel
export const closePrimary = () => {
	return {
		type: t.CLOSE_PRIMARY
	};
};

// Open Profile
export const openSecondary = () => {
	return {
		type: t.OPEN_SECONDARY
	};
};

// Close Profile
export const _closeSecondary = () => {
	return {
		type: t.CLOSE_SECONDARY
	};
};

// Expand Secondary Profile
export const expandSecondary = () => {
	return {
		type: t.EXPAND_SECONDARY
	};
};

// Shrink Secondary Profile
export const shrinkSecondary = () => {
	return {
		type: t.SHRINK_SECONDARY
	};
};

export const closeSecondary = () => {
	return (dispatch, getState) => {
		dispatch(removeProfileSubscription());
		dispatch(clearSelectedEntity());
		dispatch(clearSelectedContext());
		dispatch(_closeSecondary());
	};
};

/**
 * Used by loadProfile to check whether viewing history needs to be updated
 * @param {Array} history - array of previous selected entities
 * @param {string} id - id of entity to load in the profile
 */
export const shouldUpdateViewingHistory = (history, id) => {
	if (history.length === 0 || history[0].id !== id) {
		return true;
	} else {
		return false;
	}
};

export const updateViewingHistory = (
	id,
	name,
	type,
	profileRef,
	context,
	options
) => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		payload: {
			id,
			name,
			type,
			profileRef,
			context,
			options
		}
	};
};

// View the previous profile based on viewing history
export const viewPrevious = history => {
	return dispatch => {
		const previous = history[1];
		const { id, name, type, profileRef, context, layerId } = previous;
		dispatch(updateViewingHistory());
		if (type === "gis") {
			dispatch(loadGISProfile(id, name, layerId, type, profileRef, context));
		} else {
			dispatch(loadProfile(id, name, type, profileRef, context));
		}
	};
};

/*
 * Set selected context
 * @param entityId: ID of entity being set as prescribed context
 * @param context: Whether primary or secondary context is being set
 */
const setSelectedContext = (entityId, context) => {
	return {
		type: t.SET_SELECTED_CONTEXT,
		payload: {
			entityId,
			context
		}
	};
};

/*
 * Clear selected context
 * @param contexts: Which contexts are being cleared. Defaults to both.
 */
const clearSelectedContext = (contexts = ["primary", "secondary"]) => {
	return {
		type: t.CLEAR_SELECTED_CONTEXT,
		payload: {
			contexts
		}
	};
};

/*
 * Update selected context
 * @param entityId: new selected entity ID
 * @param context: Whether entity is primary or secondary context (e.x. camera or event)
 */
export const updateSelectedContext = (entityId, context = "secondary") => {
	return (dispatch, getState) => {
		const selectedContext = getState().appState.contextPanel.contextPanelData
			.selectedContext;

		// Get contexts that have already been set
		const setContexts = _.pickBy(selectedContext, context => context !== null);

		switch (context) {
			case "primary":
				// If there are set contexts
				if (!_.isEmpty(setContexts)) {
					_.each(
						_.filter(
							_.values(setContexts),
							contextId => contextId !== entityId
						),
						contextId => {
							// Unsubscribe profile from old context
							if (getState().contextualData[contextId]) {
								_.each(
									_.keys(getState().contextualData[contextId].subscriptions),
									subscriptionId =>
										dispatch(
											unsubscribeFromFeed(contextId, subscriptionId, "profile")
										)
								);
							}
						}
					);
					// Clear all from selectedContext state
					dispatch(clearSelectedContext(_.keys(setContexts)));
				}
				// Set primary selected context
				dispatch(setSelectedContext(entityId, context));
				break;

			case "secondary":
				// If there is a secondary context selected
				if (
					_.includes(_.keys(setContexts), "secondary") &&
					setContexts["secondary"] !== entityId
				) {
					dispatch(
						// Unsubscribe profile from old context
						unsubscribeFromFeed(setContexts["secondary"], "entity", "profile")
					);
					// Clear secondary context from selectedContext state
					dispatch(clearSelectedContext(["secondary"]));
				}
				// Set secondary selected context
				dispatch(setSelectedContext(entityId, context));
				break;
			default:
				break;
		}
	};
};

// Local flag to disallow multiple profile load attempts within a short time
let loadingId = null;

// Action fired when an entity is clicked on
// Load correct profile and set state
export const loadProfile = (
	entityId,
	entityName,
	entityType,
	profileRef,
	context = "primary"
) => {
	return (dispatch, getState) => {
		// If another profile load was attempted within 1 sec, bail out
		if (loadingId) {
			return;
		}

		loadingId = entityId;

		// Allow subsequent loads after 1 sec
		setTimeout(() => {
			loadingId = null;
		}, 1000);

		const { contextPanelData, profile } = getState().appState.contextPanel;
		const { selectedEntity } = profile;
		if (selectedEntity && selectedEntity.id === entityId) {
			return;
		}
		dispatch(clearSelectedEntity());
		if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, entityId)) {
			dispatch(
				updateViewingHistory(
					entityId,
					entityName,
					entityType,
					profileRef,
					context
				)
			);
		}
		dispatch(openSecondary());

		// Set loading to true
		dispatch(setLoading("profile", true));

		// Call to fetch entity data
		feedService
			.streamEntityByType(entityId, entityType, (err, response) => {
				if (err) console.log(err);
				else {
					if (!response) return;
					switch (response.type) {
						case "initial":
							// Add context to state
							dispatch(addContext(entityId, response.new_val));
							dispatch(setSelectedEntity(response.new_val, entityType));
							break;
						case "change":
							// Update context entity data (ie updated track details)
							dispatch(updateContext(entityId, response.new_val));
							break;
						default:
							break;
					}
				}
			})
			.then(subscription => {
				// Set feed subscription and add profile to subscriber array
				dispatch(
					subscriptionReceived(
						entityId,
						subscription.channel,
						"entity",
						profileRef
					)
				);

				// Add or update the currently selected context
				dispatch(updateSelectedContext(entityId, context));

				// Set loading to false
				dispatch(setLoading("profile", false));
			});
	};
};


export const loadProfileOffline = (
	entityId,
	entityName,
	entityType,
	entity,
	profileRef,
	context = "primary"
) => {
	return (dispatch, getState) => {
		// If another profile load was attempted within 1 sec, bail out
		if (loadingId) {
			return;
		}

		loadingId = entityId;

		// Allow subsequent loads after 1 sec
		setTimeout(() => {
			loadingId = null;
		}, 1000);

		const { contextPanelData, profile } = getState().appState.contextPanel;
		const { selectedEntity } = profile;
		if (selectedEntity && selectedEntity.id === entityId) {
			return;
		}
		dispatch(clearSelectedEntity());
		if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, entityId)) {
			dispatch(
				updateViewingHistory(
					entityId,
					entityName,
					entityType,
					profileRef,
					context
				)
			);
		}
		dispatch(openSecondary());

		// Set loading to true
		dispatch(setLoading("profile", true));

		dispatch(addContext(entityId, entity));
		dispatch(setSelectedEntity(entity, entityType));

		// Add or update the currently selected context
		dispatch(updateSelectedContext(entityId, context));

		// Set loading to false
		dispatch(setLoading("profile", false));
	};
};


export const loadGISProfile = (
	id,
	name,
	layerId,
	type,
	profileRef,
	context = "primary"
) => {
	return (dispatch, getState) => {
		// If another profile load was attempted within 1 sec, bail out
		if (loadingId) {
			return;
		}
		loadingId = id;
		// Allow subsequent loads after 1 sec
		setTimeout(() => {
			loadingId = null;
		}, 1000);
		const { contextPanelData, profile } = getState().appState.contextPanel;
		const { selectedEntity } = profile;
		if (selectedEntity && selectedEntity.id === id) {
			return;
		}
		const { features } = getState().globalData.gisData.layers[layerId];
		const feature = features.find(feature => feature.properties.id === id);
		const entity = { id, entityType: "gis", entityData: feature };
		dispatch(clearSelectedEntity());
		if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, id)) {
			dispatch(
				updateViewingHistory(id, name, type, profileRef, context, { layerId })
			);
		}
		dispatch(openSecondary());
		dispatch(setLoading("profile", true));
		dispatch(addContext(id, entity));
		dispatch(setSelectedEntity(entity, "gis"));
		dispatch(updateSelectedContext(id, context));
		dispatch(setLoading("profile", false));
	};
};

// Clear viewing history
export const clearViewingHistory = () => {
	return {
		type: t.CLEAR_VIEWING_HISTORY
	};
};
