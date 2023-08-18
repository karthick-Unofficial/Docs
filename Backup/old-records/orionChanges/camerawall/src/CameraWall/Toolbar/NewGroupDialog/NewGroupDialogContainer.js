import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newGroupDialogActions";
import NewGroupDialog from "./NewGroupDialog";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const open = state.appState.dialog.openDialog === "new-group-dialog";
	return { open, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewGroupDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewGroupDialog);

export default NewGroupDialogContainer;
