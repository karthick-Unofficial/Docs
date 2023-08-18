import {
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import isEqual from "react-fast-compare";
import forOwn from "lodash/forOwn";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

const unAssignedMemberState = state => state.globalData.unitMembers;


const unAssignedMemberSelector = (state) => {
	const unitMembers = unAssignedMemberState(state);
	let result = {};
	forOwn(unitMembers, function (value, key) {
		const feedObj = {
			[value.entityId]: value
		}
		result = { ...result, ...feedObj }
	});
	return result;
}


export const getUnAssignedMemberFeed = (state, feedSettings) => {
	let feeds = {};
	if (feedSettings.length > 0) {
		feedSettings.forEach(feed => {
			const { data } = state.globalGeo[feed]; // using global geo here because track feeds' global data is not streaming geometry
			feeds = { ...feeds, ...data };
		});
	}
	return feeds;
};

export const getUnassignedMembers = () => {
	return createDeepEqualSelector(
		getUnAssignedMemberFeed,
		unAssignedMemberSelector,
		(entities, members) => {
			let result = [];
			forOwn(entities, function (feedValue, key) {
				if (members[key]) {
					if (members[key].entityId === key) {
						const { entityData } = feedValue;
						if (members[key].unitId === null) {
							members[key].geometry = entityData.geometry;
							members[key].feedId = feedValue.feedId
							members[key].disabled = false;
							members[key].isFeed = false
							result.push(members[key]);
						}
						// Unassigned members with unitIds other than null are skipped.
					}
				}
				else {
					const { entityData } = feedValue;
					const convertToMembers = {
						id: key,
						entityId: key,
						isActive: false,
						disabled: true,
						memberType: "person",
						entityType: feedValue.entityType,
						name: entityData ? entityData.properties.name : null,
						unitId: null,
						geometry: entityData.geometry,
						feedId: feedValue.feedId,
						isFeed: true
					};
					result.push(convertToMembers);
				}
			});
			return result;
		}
	);
};



