import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./triggerDialogActions";
import TriggerDialog from "./TriggerDialog";

const mapStateToProps = (state, ownProps) => {
	return {
		shapeList: state.appState.profilePage.searchResults,
		typeAheadFilterValue: state.appState.indexPage.typeAheadFilter,
		isQuerying: state.appState.profilePage.isQuerying,
		error: state.appState.profilePage.queryDialogError
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const TriggerDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TriggerDialog);

export default TriggerDialogContainer;