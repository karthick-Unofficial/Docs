import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraViewActions.js";
import { persistedState } from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import CameraView from "./CameraView";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const user = state.session.user.profile;
	const { orgId } = user;
	const view = state.userAppState.cameraView;
	const { contextualData } = state;
	const primaryId = primaryContextSelector(state);
	const context = contextualData[primaryId];
	const isLoaded = _.isObject(context) && context.entity;
	const { activityFilters } = persistedState(state);

	let camera;
	let fromOrg;
	let fromEco;
	let contextId;
	let isPrimary;
	let feeds;

	if (isLoaded) {
		const { entity } = context;
		const { ownerOrg } = entity;
		camera = entity;
		contextId = entity.id;
		isPrimary = contextId === contextPanelState(state).selectedContext.primary;
		// Check which org created event
		fromOrg = ownerOrg === orgId;
		fromEco = ownerOrg !== orgId;
		feeds = userFeedsSelector(state);
	}

	let viewWidth;

	// Set view width based on which panels are open
	if (view === "map-view") {
		viewWidth = "full";
	} else if (!contextPanelState(state).primaryOpen) {
		viewWidth = "wide";
	} else if (state.appState.contextPanel.contextPanelData.secondaryOpen && state.appState.contextPanel.contextPanelData.secondaryExpanded) {
		viewWidth = "secondaryExpanded";
	} else if (contextPanelState(state).secondaryOpen) {
		viewWidth = "narrow";
	} else if (contextPanelState(state).primaryOpen) {
		viewWidth = "normal";
	}

	return {
		viewWidth,
		view,
		fromOrg,
		fromEco,
		activityFilters,
		camera,
		context,
		contextId,
		dialog: state.appState.dialog.openDialog,
		isPrimary,
		user,
		feeds,
		dockedCameras: state.appState.dock.cameraDock.dockedCameras,
		sidebarOpen: state.appState.dock.dockData.isOpen,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraView);

export default CameraViewContainer;
