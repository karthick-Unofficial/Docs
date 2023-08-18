import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayArchiveActions";
import ReplayArchive from "./ReplayArchive.jsx";

const mapStateToProps = state => {
	return {
		identity: state.session.identity,
		isHydrated: state.session.user.isHydrated,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dialog: state.appState.dialog.openDialog
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ReplayArchiveContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayArchive);

export default ReplayArchiveContainer;
