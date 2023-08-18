import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./settingsMenuActions";
import SettingsMenu from "./SettingsMenu";
import {
	replayMapObject,
	persistedState,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import {
	userFeedsSelector,
	gisDataSelector,
	gisStateSelector
} from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { open } = state.appState.settingsMenu;
	const { baseMaps } = state;
	const userFeeds = userFeedsSelector(state);
	const { clientConfig } = state;
	const { nauticalChartsEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	return {
		open,
		gisData: window.api ? null : gisDataSelector(state),
		gisState: window.api ? null : gisStateSelector(state),
		map: replayMapObject(state),
		showAllFOVs: persistedState(state).showAllFOVs || false,
		userFeeds,
		disabledFeeds: disabledFeedsSelector(state),
		baseMaps,
		dir: getDir(state),
		nauticalChartsEnabled
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SettingsMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsMenu);

export default SettingsMenuContainer;
