import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import _ from "lodash";
import isEqual from "react-fast-compare";
// import { polygon, point, lineString } from "@turf/helpers";
// import isWithin from "@turf/boolean-within";
// import crosses from "@turf/boolean-crosses";
// import bboxToPolygon from "@turf/bbox-polygon";

import { userFeedsSelector } from "../Feeds/selectors";
import { disabledFeedsSelector } from "../../AppState/Selectors";
export {
	collectionsSelector,
	makeGetCollection,
	makeGetCollectionMembers
} from "../Collections/selectors";
export { rulesSelector } from "../Rules/selectors";
export { userFeedsSelector } from "../Feeds/selectors";
export * from "../GIS/selectors";
export { floorPlanSelector } from "../FloorPlan/selectors";
export {
	eventsSelector,
	eventTypesSelector,
	currentEventsSelector,
	currentOwnedEventsSelector,
	activeOwnedEventsSelector,
	eventsSharedFromOrgSelector,
	eventsSharedFromEcoSelector,
	sharedEventsSelector,
	activeSharedEventsSelector,
	availableEventsSelector,
	activeEventsSelector,
	makeGetEvent,
	makeGetPinnedItems,
	templatesSelector,
	ownedTemplatesSelector,
	templatesSharedFromOrgSelector,
	templatesSharedFromEcoSelector,
	sharedTemplatesSelector,
	availableTemplatesSelector,
	usedEventTemplatesSelector
} from "../Events/selectors";
export { userExclusionSelector } from "../Exclusions/selectors";

export const globalGeo = state => state.globalGeo;
const userIdSelector = state =>
	state.session ? state.session.user.profile.id : null;
export const orgRoleSelector = state => state.session.user.profile.orgRole;
export const globalData = (state, props) => {
	return props && props.feedId ? state.globalData[props.feedId] : state.globalData;
};


const notifications = state => state.globalData.notifications;

export const notificationById = id =>
	createSelector(
		notifications,
		notifications => {
			const { activeItemsById, archiveItemsById } = notifications;
			const allNotifications = { ...activeItemsById, ...archiveItemsById };
			return allNotifications[id];
		}
	);

export const priorityNotificationSelector = createSelector(
	notifications,
	notifications => {
		const { activeItemsById } = notifications;
		const alerts = _.pickBy(activeItemsById, item => item.isPriority);
		return alerts;
	}
);

export const userFacilitySelector = createSelector(globalData, globalData => {
	const userFacilities = [];
	_.forOwn(globalData, (value) => {
		if (value.data && !_.isEmpty(value.data)) {
			_.forOwn(value.data, (facility) => {
				if (facility.entityType === "facility") {
					userFacilities.push(facility);
				}
			});
		}
	});
	return userFacilities;
});

export const activeAlertsSelector = createSelector(
	notifications,
	notifications => {
		const { activeItemsById } = notifications;
		const alerts = _.map(
			_.pickBy(activeItemsById, item => item.isPriority && !item.viewed),
			item => item.object.id
		);
		return alerts;
	}
);

const integrations = state => {
	const { integrations } = state.session.user.profile;
	return integrations;
};

export const feedInfoSelector = feedId =>
	createSelector(
		integrations,
		feeds => {
			const feed = feeds.find(feed => feedId === feed.feedId);
			return feed;
		}
	);

// Returns all non-disabled feeds a user has access to.
export const userIntegrations = createSelector(
	userFeedsSelector,
	disabledFeedsSelector,
	(userFeeds, disabled) => {
		const integrations = _.pickBy(
			userFeeds,
			integration => integration.canView && !disabled.includes(integration)
		);
		return integrations;
	}
);
const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);
// Grabs all entities, minus GeoJSON, from feeds you have access to and are not disabled
// Data Type: Array
export const feedEntitiesSelector = createDeepEqualSelector(
	globalData,
	userIntegrations,
	(globalData, integrations) => {
		let entities = {};
		_.each(
			_.pickBy(integrations, integration => globalData[integration.feedId]),
			integration => {
				entities = { ...entities, ...globalData[integration.feedId].data };
			}
		);
		return entities;
	}
);

export const feedEntitiesByTypeSelector = entityType => createDeepEqualSelector(
	globalData,
	userIntegrations,
	(globalData, integrations) => {
		let entities = {};
		_.each(
			_.pickBy(
				integrations,
				integration => integration.entityType === entityType && globalData[integration.feedId]),
			integration => {
				entities = { ...entities, ...globalData[integration.feedId].data };
			}
		);
		return entities;
	}
);

/**
 * Grab collection members from available entities based on entity ID
 * @param {Array} members - An array of entity IDs
 */
export const collectionMemberSelector = members => {
	return createDeepEqualSelector(feedEntitiesSelector, entities => {
		const filteredMembers = _.pickBy(_.cloneDeep(entities), entity =>
			_.includes(members, entity.id)
		);
		return filteredMembers;
	});
};

export const sharedEntitiesSelector = createSelector(
	userIdSelector,
	feedEntitiesSelector,
	(userId, entities) => {
		const sharedEntities = _.pickBy(entities, entity => {
			const { owner } = entity;
			return owner && owner !== userId;
		});
		return sharedEntities;
	}
);

// Grabs the GeoJSON for all entities from feeds you have access to and are not disabled
// Data Type: Object
export const feedEntityGeoSelector = createSelector(
	globalGeo,
	userIntegrations,
	(globalGeo, integrations) => {
		let geoObj = {};
		_.each(
			_.filter(integrations, integration => globalGeo ? globalGeo[integration.feedId] : false),
			integration => {
				geoObj = { ...geoObj, ...(globalGeo ? globalGeo[integration.feedId].data : {}) };
			}
		);
		return geoObj;
	}
);

export const getEntityId = (state, props) =>
	props.entity ? props.entity.id : null;

export const getGeo = createSelector(
	feedEntityGeoSelector,
	getEntityId,
	(geos, id) => {
		const geo = geos[id];

		return geo ? geo : null;
	}
);

export const getGeoMemoized = createDeepEqualSelector(getGeo, geo => geo);

export const getFeedId = (state, props) => props.feedId;

const globalDataSelector = createDeepEqualSelector(
	globalData,
	globalData => globalData
);

export const feedDataSelector = createDeepEqualSelector(
	globalDataSelector,
	global => {
		return global ? global.data : {};
	}
);

export const feedSelector = (state, props) => {
	if (
		props &&
		state.globalData[props.feedId] &&
		state.globalData[props.feedId].data
	) {
		return state.globalData[props.feedId].data;
	}
};

const feedGeoSelector = (state, props) => {
	if (
		props &&
		state.globalGeo[props.feedId] &&
		state.globalGeo[props.feedId].data
	) {
		return state.globalGeo[props.feedId].data;
	}
};

const notificationSelector = state => {
	if (
		state.globalData &&
		state.globalData.notifications &&
		state.globalData.notifications.activeItemsById
	) {
		return state.globalData.notifications.activeItemsById;
	}
};

export const alertStateSelector = state => {
	if (state.globalData && state.globalData.notifications) {
		return state.globalData.notifications.initial;
	}
};

export const alertSelector = createDeepEqualSelector(
	notificationSelector,
	notifications => {
		return _.pickBy(
			notifications,
			notification => notification.isPriority && notification.viewed === false
		);
	}
);

// const mapBounds = (state, props) => {
// 	return props.map.getBounds();
// };

export const layerSourcesSelector = createSelector(
	feedGeoSelector,
	geo => {
		// // This is working correctly, but seems to have started causing errors on the map
		// // Leaving this in til theres time to come back to it

		// // Turn bounds object into an array
		// // const poly = [
		// // 	bounds._sw.lng,
		// // 	bounds._sw.lat,
		// // 	bounds._ne.lng,
		// // 	bounds._ne.lat
		// // ];

		// // // Convert bounding box to poylgon
		// // const bbox = bboxToPolygon(poly);

		// // // Only grab points that are within the bounding box
		// // const update = _.pickBy(data, entity => {
		// // 	if (
		// // 		entity &&
		// // 		entity.entityData.geometry &&
		// // 		entity.entityData.geometry.coordinates
		// // 		// &&
		// // 		// entity.entityData.geometry.type === "Point"
		// // 	) {
		// // 		let coords = entity.entityData.geometry.coordinates;

		// // 		coords = point(coords);

		// // 		return entity.entityData.geometry.type === "Point"
		// // 			? isWithin(coords, bbox)
		// // 			: entity;
		// // 	} else {
		// // 		return entity;
		// // 	}
		// // });

		return geo ? geo : {};
	}
);

const getEntityById = (state, props) => {
	const { id, feedId } = props;
	const entity = state.appState[state.replayMapState ? "replayMapRef" : "mapRef"].entities[feedId]
		? state.appState[state.replayMapState ? "replayMapRef" : "mapRef"].entities[feedId][id]
		: null;
	return entity;
};

export const makeGetEntity = () => {
	return createDeepEqualSelector(getEntityById, entity => {
		return entity;
	});
};
