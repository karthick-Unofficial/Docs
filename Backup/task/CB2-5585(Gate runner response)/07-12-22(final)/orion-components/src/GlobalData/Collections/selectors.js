import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import { feedEntitiesSelector } from "orion-components/GlobalData/Selectors";
import isEqual from "react-fast-compare";
import values from "lodash/values";
import pickBy from "lodash/pickBy";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

const collectionState = state => state.globalData.collections;

export const collectionsSelector = createSelector(
	collectionState,
	collections => {
		return values(collections);
	}
);

const getCollectionById = (state, props) => {
	const collection = state.globalData.collections[props.id];
	return collection;
};

export const makeGetCollection = () => {
	return createSelector(
		getCollectionById,
		collection => {
			return collection;
		}
	);
};

const getCollectionMembers = (state, props) => {
	return props.collection.members;
};

export const makeGetCollectionMembers = () => {
	return createDeepEqualSelector(
		getCollectionMembers,
		feedEntitiesSelector,
		(members, entities) => {
			const fullItems = pickBy(entities, entity =>
				members.includes(entity.id)
			);

			return fullItems;
		}
	);
};
