import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./mapAppBarActions.js";
import MapAppBar from "./MapAppBar";

import {
	mapObject,
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";

import {
	userFeedsSelector,
	gisDataSelector,
	gisStateSelector,
	floorPlanSelector
} from "orion-components/GlobalData/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	let title = "Map";
	const { baseMaps, clientConfig } = state;
	if (state.application && state.application.name) {
		title = state.application.name;
	}

	const settings = mapSettingsSelector(state);

	const userFeeds = userFeedsSelector(state);
	const floorPlansWithFacilityFeed = floorPlanSelector(state);
	const { nauticalChartsEnabled, weatherEnabled } = clientConfig.mapSettings;

	return {
		user: state.session.user,
		gisData: gisDataSelector(state),
		gisState: gisStateSelector(state),
		map: mapObject(state),
		entityLabelsVisible: settings.entityLabelsVisible || false,
		nauticalChartsVisible: settings.nauticalChartsVisible || false,
		roadsVisible: settings.roadsVisible || false,
		weatherVisible: settings.weatherVisible || false,
		ssrRadarVisible: settings.ssrRadarVisible || false,
		mapLabel: settings.mapStyle,
		mapName: settings.mapStyle,
		showAllFOVs: persistedState(state).showAllFOVs || false,
		userFeeds,
		disabledFeeds: disabledFeedsSelector(state),
		nauticalChartLayerOpacity: nauticalChartLayerOpacitySelector(state),
		roadAndLabelLayerOpacity: roadAndLabelLayerOpacitySelector(state),
		weatherRadarLayerOpacity: weatherRadarLayerOpacitySelector(state),
		ssrRadarLayerOpacity: ssrRadarLayerOpacitySelector(state),
		ssrRadarOverlayEnabled: !!state.clientConfig.ssrRadarOverlayEnabled,
		title,
		baseMaps,
		dir: getDir(state),
		floorPlansWithFacilityFeed,
		nauticalChartsEnabled,
		weatherEnabled
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapAppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapAppBar);

export default MapAppBarContainer;
