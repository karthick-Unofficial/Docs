import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./subjectDialogActions";
import SubjectDialog from "./SubjectDialog";

const mapStateToProps = (state, ownProps) => {
	return {
		trackList: state.appState.profilePage.searchResults,
		isQuerying: state.appState.profilePage.isQuerying,
		error: state.appState.profilePage.queryDialogError
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const SubjectDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SubjectDialog);

export default SubjectDialogContainer;