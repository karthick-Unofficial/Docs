import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./multiSelectionDialogActions";
import MultiSelectionDialog from "./MultiSelectionDialog";

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

const MultiSelectionDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MultiSelectionDialog);

export default MultiSelectionDialogContainer;
