import { createSelector } from "reselect";
import { layerSourcesSelector, userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { primaryContextSelector, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import _ from "lodash";

const globalDataSelector = (state) => state.globalData;
const globalGeoSelector = (state) => state.globalGeo;
const contextualDataSelector = (state) => state.contextualData;
const proximityEntitiesSelector = (state) => selectedContextSelector(state)?.proximityEntities ?? [];
const primarySelector = (state) => state.contextualData[primaryContextSelector(state)];
const pinnedItemsSelector = (state) => primarySelector(state)?.pinnedItems ?? [];

const userFeedsSelectorData = (state) => userFeedsSelector(state);

export const getFacilities = createSelector(
	[
		globalDataSelector,
		globalGeoSelector,
		contextualDataSelector,
		proximityEntitiesSelector,
		primarySelector,
		pinnedItemsSelector,
		userFeedsSelectorData
	],
	(globalData, globalGeo, contextualData, proximityEntities, primary, pinnedItems, userFeeds) => (state, props) => {
		const { secondary, feedId, replayMap, getInitialPlayBarData } = props;
		const facilityFeeds = _.map(
			_.filter(_.map(userFeeds), (feed) => {
				return feed && feed.entityType === "facility";
			}),
			"feedId"
		);

		let facilities = {};

		if (replayMap) {
			const playBarValue = state.playBar.playBarValue;
			const data = getInitialPlayBarData(playBarValue, state.replay.timeTransactions);

			if (data) {
				Object.keys(data).map((key) => {
					if (data[key].feedId === feedId) {
						facilities[key] = data[key];
					}
				});
			}
		} else if (feedId) {
			facilities = layerSourcesSelector(state, props);
		} else if (secondary) {
			[...proximityEntities, ...pinnedItems].forEach((item) => {
				if (item.entityType === "facility" && item.entityData.geometry) {
					facilities[item.id] = item;
				}
			});
		} else {
			if (globalData && globalGeo) {
				if (!_.isEmpty(contextualData)) {
					if (primary && primary.entity) {
						facilities[primary.entity.id] = primary.entity;
					}
				} else {
					facilityFeeds.map((feed) => {
						facilities = _.merge(
							facilities,
							_.cloneDeep(layerSourcesSelector(state, { feedId: feed })) || {}
						);
					});
				}
			}
		}

		return facilities;
	}
);
