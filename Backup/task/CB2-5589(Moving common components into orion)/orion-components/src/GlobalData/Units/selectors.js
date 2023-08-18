import {
	createSelectorCreator,
	defaultMemoize,
	createSelector
} from "reselect";
import forOwn from "lodash/forOwn";
import values from "lodash/values";
import { getUnAssignedMemberFeed } from "../UnitMembers/selectors";
import isEqual from "lodash/isEqual";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);



const getAllUnitMembers = state => state.globalData.unitMembers;

const units = state => state.globalData.units

export const getAllUnits = (state) => {
	const unitData = values(units(state));
	return unitData;
}

const getUnitsMemberByUnitId = (state, unitId, feedSettings) => {
	const unitMembers = getAllUnitMembers(state);
	const unitMemberFeed = getUnAssignedMemberFeed(state, feedSettings);
	let result = {};
	forOwn(unitMembers, function (value, key) {
		const { targetEntityId } = value;
		if (value.unitId === unitId) {
			if (unitMemberFeed[targetEntityId]) {
				const { entityData, feedId } = unitMemberFeed[targetEntityId];
				value.geometry = entityData.geometry;
				value.feedId = feedId
				value.disabled = false;
				value.isFeed = false
			}
			const feedObj = {
				[targetEntityId]: value
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

export const unitMemberMemoized = () => createDeepEqualSelector(
	unitMemberSelector,
	(result) => {
		return result;
	});

export const getUnits = () => {
	return createDeepEqualSelector(
		getAllUnits,
		(units) => {
			return units;
		}
	);
};











