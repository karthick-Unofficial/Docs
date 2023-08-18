import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./optionsDrawerActions.js";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import OptionsDrawer from "./OptionsDrawer";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const settings = mapSettingsSelector(state);	
	return {
		entityLabelsVisible: settings.entityLabelsVisible || false,
		nauticalChartsVisible: settings.nauticalChartsVisible || false,
		roadsVisible: settings.roadsVisible || false,
		weatherVisible: settings.weatherVisible || false,
		mapLabel: _.capitalize(settings.mapStyle),
		mapName: settings.mapStyle,
		baseMaps: state.baseMaps,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const OptionsDrawerContainer = connect(mapStateToProps, mapDispatchToProps)(
	OptionsDrawer
);

export default OptionsDrawerContainer;
