import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./editGroupDialogActions";
import EditGroupDialog from "./EditGroupDialog";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const open = state.appState.dialog.openDialog === "edit-group-dialog";
	const { selectedGroup } = state.appState.persisted;
	return { open, selectedGroup, dir: getDir(state)};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EditGroupDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditGroupDialog);

export default EditGroupDialogContainer;
