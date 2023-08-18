import { connect } from "react-redux";
import SubjectAttributes from "./SubjectAttributes";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./subjectAttributesActions.js";
import { bindActionCreators } from "redux";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.appState.dialog.openDialog
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...actionCreators, openDialog, closeDialog }, dispatch);
}

const SubjectContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SubjectAttributes);

export default SubjectContainer;