import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./optionsDrawerActions.js";

import { 
	mapSettingsSelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";

import OptionsDrawer from "./OptionsDrawer";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const settings = mapSettingsSelector(state);
	const globalState = state.appState.global;
	return {
		entityLabelsVisible: settings.entityLabelsVisible || false,
		nauticalChartsVisible: settings.nauticalChartsVisible || false,
		roadsVisible: settings.roadsVisible || false,
		weatherVisible: settings.weatherVisible || false,
		mapLabel: _.capitalize(settings.mapStyle),
		mapName: settings.mapStyle,
		globalState,
		nauticalChartLayerOpacity: nauticalChartLayerOpacitySelector(state),
		roadAndLabelLayerOpacity: roadAndLabelLayerOpacitySelector(state),
		weatherRadarLayerOpacity: weatherRadarLayerOpacitySelector(state),
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const OptionsDrawerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OptionsDrawer);

export default OptionsDrawerContainer;
