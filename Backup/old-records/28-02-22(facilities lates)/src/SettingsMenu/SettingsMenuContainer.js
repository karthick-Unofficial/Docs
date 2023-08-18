import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./settingsMenuActions";
import SettingsMenu from "./SettingsMenu";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { open } = state.appState.settingsMenu;
	const { baseMaps } = state;

	return { open, baseMaps, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SettingsMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsMenu);

export default SettingsMenuContainer;
