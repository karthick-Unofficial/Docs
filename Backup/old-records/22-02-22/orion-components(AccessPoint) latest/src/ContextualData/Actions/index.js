import * as t from "./actionTypes";

import _ from "lodash";
import { listCategoryService } from "client-app-core";
import { unsubscribe } from "../contextStreaming";
export {
	startLiveCameraStream,
	startCamerasLinkedItemsStream,
	startListStream,
	startActivityStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	subscriptionReceived,
	startFOVItemStream,
	startCamerasInRangeStream,
	startCameraInRangeVideoStream,
	startEventCameraStream,
	startFloorPlanCameraStream,
	startTrackHistoryStream,
	startRulesStream,
	startProximityEntitiesStream,
	unsubscribe,
	simpleUnsub
} from "../contextStreaming";

/* Add the entity context to the state
 * @param entity: entity object to be set on context
 */
export const addContext = (id, entity) => {
	return {
		type: t.ADD_CONTEXT,
		payload: {
			id,
			entity
		}
	};
};

/* Update context in state (ie if a tracks course)
 * @param contextId: entity that owns that subscription
 * @param update: updated entity object
 */
export const updateContext = (contextId, update) => {
	return {
		type: t.UPDATE_CONTEXT,
		payload: {
			contextId,
			update
		}
	};
};

/* Update property on context in state (ie camerasInRange on entity)
 * @param contextId: entity that owns that subscription
 * @param updateProp: updated entity property
 * @param updateVal: updated entity property value
 */
export const updateContextProperty = (contextId, updateProp, updateVal) => {
	return {
		type: t.UPDATE_CONTEXT_PROPERTY,
		payload: {
			contextId,
			updateProp,
			updateVal
		}
	};
};

const updateContextListCategories = (contextId, categories) => {
	return {
		type: t.UPDATE_CONTEXT_LIST_CATEGORIES,
		payload: {
			contextId,
			categories
		}
	};
};
export const getContextListCategory = (categoryId, contextId) => {
	return dispatch => {
		listCategoryService.getListCategory(categoryId, (err, response) => {
			if (err) {
				console.log(err);
			}
			if (!response) {
				return;
			}
			dispatch(updateContextListCategories(contextId, [response]));

		});
	};
};

/*
 * Completely remove a context object
 * @param contextId: ID of entity used as context
 */
export const removeContext = contextId => {
	return {
		type: t.REMOVE_CONTEXT,
		payload: {
			contextId
		}
	};
};

/*
 * Completely remove a subscription and related data
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 */
export const removeFeed = (contextId, subscriptionId) => {
	return {
		type: t.REMOVE_SUBSCRIPTION,
		payload: {
			contextId,
			subscriptionId
		}
	};
};

/*
 * Remove a subscribed component from the subscribers array
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
export const removeSubscriber = (contextId, subscriptionId, subscriberRef) => {
	return {
		type: t.REMOVE_SUBSCRIBER,
		payload: {
			contextId,
			subscriptionId,
			subscriberRef
		}
	};
};

/*
 * Add a subscribed component to the subscribers array
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
export const addSubscriber = (contextId, subscriptionId, subscriberRef) => {
	return {
		type: t.ADD_SUBSCRIBER,
		payload: {
			contextId,
			subscriptionId,
			subscriberRef
		}
	};
};

/*
 * Check whether a feed should be unsubscribed from
 * @param subscriptions: A context object's subscriptions object
 * @param subscriptionId: ID of feed and related subscription
 */
const shouldUnsubscribeFeed = (
	subscriptions,
	subscriptionId,
	subscriberRef
) => {
	return dispatch => {
		const subscription = subscriptions[subscriptionId];

		// Error catch in the case of multiple unsubscribe calls
		if (!subscription) {
			return false;
			// Unsubscribe if this is the last subscriber
		} else if (
			subscription.subscribers.length === 0 ||
			(subscription.subscribers.length === 1 &&
				_.includes(subscription.subscribers, subscriberRef))
		) {
			if (subscription.subscription) {
				// If there is a valid subscription
				const channel = subscription.subscription;

				// Iterate over subscriptions involving multiple channels
				_.isArray(channel)
					? _.each(channel, channel => dispatch(unsubscribe(channel)))
					: dispatch(unsubscribe(channel));
			}
			return true;
		} else {
			return false;
		}
	};
};

/*
 * May need to pass subscriptions from passed props
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
export const unsubscribeFromFeed = (
	contextId,
	subscriptionId,
	subscriberRef
) => {
	return (dispatch, getState) => {
		// Exit if context doesn't exist
		if (!getState().contextualData[contextId]) return;

		const subscriptions = getState().contextualData[contextId].subscriptions;
		const context = getState().contextualData[contextId];
		if (!(context.trackHistory && subscriptionId === "entity")) {

			// Check if this is the last subscriber
			if (
				dispatch(
					shouldUnsubscribeFeed(subscriptions, subscriptionId, subscriberRef)
				)
			) {
			// Remove feed from context
				dispatch(removeFeed(contextId, subscriptionId));
				// Check if this is the last subscription to context
				if (_.size(subscriptions) <= 1) {
				// Remove context entirely
					dispatch(removeContext(contextId));
				}
			} else {
			// Remove subscriber from subscriber array
				dispatch(removeSubscriber(contextId, subscriptionId, subscriberRef));
			}
		}
	};
};

// Clear all contexts that are only being subscribed to by profile on close
export const removeProfileSubscription = () => {
	return (dispatch, getState) => {
		const { contextualData, appState } = getState();
		const { selectedContext } = appState.contextPanel.contextPanelData;
		_.each(contextualData, (context, contextId) => {
			if (!context.trackHistory && Object.values(selectedContext).includes(contextId)) {
				const subscriptionIds = _.keys(context.subscriptions);
				_.each(subscriptionIds, subscriptionId =>
					dispatch(unsubscribeFromFeed(contextId, subscriptionId, "profile"))
				);
			}
		});
	};
};
