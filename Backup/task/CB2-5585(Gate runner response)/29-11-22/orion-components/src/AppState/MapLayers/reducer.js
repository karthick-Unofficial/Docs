import concat from "lodash/concat";
import includes from "lodash/includes";
import pull from "lodash/pull";

const initialMapLayersState = {
	disabledFeeds: [],
	layerOpacity: 1,
	nauticalChartLayerOpacity: 1,
	roadAndLabelLayerOpacity: 1,
	weatherRadarLayerOpacity: 1,
	ssrRadarLayerOpacity: 1,
	activeCameraFOVs: []
};

const mapLayers = (state = initialMapLayersState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "TOGGLE_FEED": {
			const { feedId } = payload;
			let disabled = [...state.disabledFeeds];

			includes(disabled, feedId)
				? pull(disabled, feedId)
				: (disabled = concat(disabled, feedId));

			return {
				...state,
				disabledFeeds: disabled
			};
		}

		default:
			return state;
	}
};

export default mapLayers;
