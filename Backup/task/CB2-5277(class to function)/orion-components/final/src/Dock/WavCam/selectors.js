import {
	createSelectorCreator,
	createSelector,
	defaultMemoize
} from "reselect";
import { contextById } from "orion-components/ContextualData/Selectors";

import _ from "lodash";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	_.isEqual
);

export const wavCamFOVItems = id => {
	return createDeepEqualSelector(
		contextById(id),
		(context) => {
			if (context) {
				const { fovItems } = context;
				return _.keyBy(fovItems, "id");
			}
		}
	);
};

export const getContext = id => {
	return createDeepEqualSelector(
		contextById(id),
		(context) => {
			if (context) {
				return context;
			}
		}
	);
};
