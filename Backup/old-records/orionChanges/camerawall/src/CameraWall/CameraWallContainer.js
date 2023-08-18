import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraWallActions";
import CameraWall from "./CameraWall";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { primaryOpen } = state.appState.contextPanel.contextPanelData;
	const { selectedPinnedItem } = state.appState.persisted;
	const { stagedItem } = state.cameraWall;
	let cameras = [];
	if (selectedPinnedItem) {
		cameras = state.camerasByContext[selectedPinnedItem.id];
	} else if (stagedItem) {
		cameras = state.camerasByContext[stagedItem.id];
	}

	return {
		cameras,
		primaryOpen: primaryOpen,
		selectedPinnedItem,
		stagedItem,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraWallContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraWall);

export default CameraWallContainer;
