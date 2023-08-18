import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./columnDeleteActions";
import { getDir } from "orion-components/i18n/Config/selector";

import ColumnDelete from "./ColumnDelete";

const mapStateToProps = state => {
	const dialog = state.appState.dialog.openDialog;

	return { dialog, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ColumnDeleteContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ColumnDelete);

export default ColumnDeleteContainer;
