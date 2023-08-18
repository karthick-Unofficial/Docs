import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./createRuleActions";
import CreateEditRule from "./CreateEditRule";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const rules = Object.keys(state.globalData.rules).map(key => {
		return state.globalData.rules[key];
	});
	const { landUnitSystem } = state.appState.global.unitsOfMeasurement;
	const timeFormatPreference = state.appState.global.timeFormat;
	const orgUsers = _.filter(state.globalData.org.orgUsers, u => {
		return (!u.disabled);
	});

	return {
		user: state.session.user,
		orgUsers,
		entityCollections: state.globalData.collections,
		rules,
		params: ownProps.params,
		isOpen: state.appState.dialog.openDialog,
		landUnitSystem,
		timeFormatPreference,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state),
		locale: state.i18n.locale
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ ...actionCreators, openDialog, closeDialog },
		dispatch
	);
}

const CreateRuleContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateEditRule);

export default CreateRuleContainer;
