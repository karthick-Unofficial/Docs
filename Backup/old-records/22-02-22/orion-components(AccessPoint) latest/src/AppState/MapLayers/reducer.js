import _ from "lodash";

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

			_.includes(disabled, feedId)
				? _.pull(disabled, feedId)
				: (disabled = _.concat(disabled, feedId));

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
