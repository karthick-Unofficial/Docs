// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as actionCreators from "./camerasMapLayersActions.js";
// import { cameraMapFeatures, accessPointMapFeatures } from "orion-components/Map/Selectors";
// import {
// 	mapSettingsSelector,
// 	layerOpacitySelector,
// 	nauticalChartLayerOpacitySelector,
// 	roadAndLabelLayerOpacitySelector,
// 	weatherRadarLayerOpacitySelector
// } from "orion-components/AppState/Selectors";
// import {
// 	primaryContextSelector,
// 	contextPanelState,
// 	selectedContextSelector
// } from "orion-components/ContextPanel/Selectors";
// import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
// import CamerasMapLayers from "./CamerasMapLayers";
// import _ from "lodash";

// const mapStateToProps = state => {
// 	const {
// 		entityLabelsVisible,
// 		nauticalChartsVisible,
// 		roadsVisible,
// 		weatherVisible,
// 		mapStyle
// 	} = mapSettingsSelector(state);
// 	const contextId = primaryContextSelector(state);
// 	const context = selectedContextSelector(state);
// 	const trackHistory = trackHistorySelector(state);
// 	const items = Object.assign({}, cameraMapFeatures(contextId)(state), accessPointMapFeatures(contextId)(state));
// 	const { clientConfig, mapState, appState, contextualData, baseMaps } = state;
// 	const { mapSettings } = clientConfig;
// 	const { nauticalChartsEnabled, weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;

// 	// -- get a list of all unique track feedIds and grab the mapIconTemplate from those feedTypes
// 	return {
// 		context,
// 		primaryContext: contextualData[contextId],
// 		items,
// 		trackHistory,
// 		entityLabelsVisible: !!entityLabelsVisible,
// 		nauticalChartsVisible: !!nauticalChartsVisible,
// 		roadsVisible: !!roadsVisible,
// 		weatherVisible: !!weatherVisible,
// 		mapLabel: _.capitalize(mapStyle),
// 		mapName: mapStyle,
// 		primaryOpen: contextPanelState(state).primaryOpen,
// 		secondaryOpen: contextPanelState(state).secondaryOpen,
// 		aerisKey: mapSettings.AERIS_API_KEY,
// 		mapState,
// 		spotlightProximity: appState.global.spotlightProximity,
// 		layerOpacity: layerOpacitySelector(state),
// 		nauticalChartLayerOpacity: nauticalChartLayerOpacitySelector(state),
// 		roadAndLabelLayerOpacity: roadAndLabelLayerOpacitySelector(state),
// 		weatherRadarLayerOpacity: weatherRadarLayerOpacitySelector(state),
// 		baseMaps,
// 		nauticalChartsEnabled,
// 		weatherEnabled
// 	};
// };

// function mapDispatchToProps(dispatch) {
// 	return bindActionCreators(actionCreators, dispatch);
// }

// const CamerasMapLayersContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(CamerasMapLayers);

// export default CamerasMapLayersContainer;
