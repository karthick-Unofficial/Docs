import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./columnAddActions";
import { getDir } from "orion-components/i18n/Config/selector";

import ColumnAdd from "./ColumnAdd";

const mapStateToProps = state => {
	const dialog = state.appState.dialog.openDialog;
	const user = state.session.user.profile;
	const timeFormatPreference = state.appState.global.timeFormat;
	return {
		dialog,
		user,
		timeFormatPreference,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ColumnAddContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ColumnAdd);

export default ColumnAddContainer;
