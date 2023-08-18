import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraGroupActions";
import CameraGroup from "./CameraGroup";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const { selectedGroup } = state.appState.persisted;
	return {
		selected: Boolean(selectedGroup && selectedGroup.id === ownProps.id),
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraGroupContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraGroup);

export default CameraGroupContainer;
