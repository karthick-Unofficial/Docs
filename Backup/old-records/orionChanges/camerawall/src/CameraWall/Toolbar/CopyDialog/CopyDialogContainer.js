import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./copyDialogActions";
import CopyDialog from "./CopyDialog";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const open = state.appState.dialog.openDialog === "copy-dialog";
	return { open, dir: getDir(state)};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CopyDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CopyDialog);

export default CopyDialogContainer;
