import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./resumeSpotlightActions";
import ResumeSpotlightDialog from "./ResumeSpotlightDialog";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = (state, ownProps) => {
	return {
		dialogOpen: state.appState.dialog.openDialog === "resumeSpotlightDialog",
		dialogData: state.appState.dialog.dialogData,
		dir: getDir(state)
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const ResumeSpotlightDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ResumeSpotlightDialog);

export default ResumeSpotlightDialogContainer;