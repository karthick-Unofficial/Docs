import * as actionTypes from "../../actionTypes";

export const setTraceMapFeatures = (lineFeatures, pointFeatures) => {
	return {
		type: actionTypes.TRACE_FEATURES_SET,
		lineFeatures,
		pointFeatures
	};
};
