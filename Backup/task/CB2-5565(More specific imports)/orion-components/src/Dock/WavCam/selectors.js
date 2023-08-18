import {
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import { contextById } from "orion-components/ContextualData/Selectors";

import keyBy from "lodash/keyBy";
import isEqual from "lodash/isEqual";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

export const wavCamFOVItems = id => {
	return createDeepEqualSelector(
		contextById(id),
		(context) => {
			if (context) {
				const { fovItems } = context;
				return keyBy(fovItems, "id");
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
