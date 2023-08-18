import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./mapControlsActions.js";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import MapControls from "./MapControls";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const context = selectedContextSelector(state);
	const { mapState, session, appState } = state;
	const { dockData } = appState.dock;
	const user = session.user.profile;
	const { mapTools, distanceTool } = mapState;
	const entityData = context ? { entity: context.entity, fov: context.fov } : {};
	let canEdit = false;
	const dialog = state.appState.dialog.openDialog;
	if (entityData.entity) {
		canEdit = user.integrations
			&& user.integrations.find(int => int.intId === entityData.entity.feedId)
			&& user.integrations.find(int => int.intId === entityData.entity.feedId).permissions
			&& user.integrations.find(int => int.intId === entityData.entity.feedId).permissions.includes("manage");
	}
	const { spotlightProximity } = appState.global;

	return {
		canEdit,
		dialog,
		...entityData,
		toolType: mapTools.type,
		activePath: distanceTool.activePath,
		spotlightProximity,
		dockOpen: dockData.isOpen,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapControlsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapControls);

export default MapControlsContainer;
