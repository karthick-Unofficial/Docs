import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./singleSelectionDialogActions";
import SingleSelectionDialog from "./SingleSelectionDialog";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.appState.dialog.openDialog,
		typeAheadFilterValue: state.appState.indexPage.typeAheadFilter
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		actionCreators,
		dispatch
	);
}

const SingleSelectionDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SingleSelectionDialog);

export default SingleSelectionDialogContainer;
