import {
	createSelector
} from "reselect";
import forOwn from "lodash/forOwn";
import values from "lodash/values";
import { getUnAssignedMemberFeed } from "../UnitMembers/selectors";



const getAllUnitMembers = state => state.globalData.unitMembers;

export const getAllUnits = state => state.globalData.units;

const getUnitsMemberByUnitId = (state, unitId, feedSettings) => {
	const unitMembers = getAllUnitMembers(state);
	const unitMemberFeed = getUnAssignedMemberFeed(state, feedSettings);
	let result = {};
	forOwn(unitMembers, function (value, key) {
		const { entityId } = value;
		if (value.unitId === unitId) {
			if (unitMemberFeed[entityId]) {
				const { entityData, feedId } = unitMemberFeed[entityId];
				value.geometry = entityData.geometry;
				value.feedId = feedId
				value.disabled = false;
				value.isFeed = false
			}
			const feedObj = {
				[entityId]: value
			}
			result = { ...result, ...feedObj }


		}
	});
	return values(result);
};

export const unitMemberSelector = createSelector(
	(state, unitId, feedSettings) => getUnitsMemberByUnitId(state, unitId, feedSettings),
	(members) => {
		return members;
	}
);











