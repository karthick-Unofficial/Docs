import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraProfileActions.js";
import { CameraProfile } from "orion-components/Profiles";
import { appData } from "../../shared/utility/util-functions";
import {
	mapState,
	widgetStateSelector,
	persistedState,
	fullscreenCameraOpen
} from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = persistedState(state);
	const dialog = state.appState.dialog.openDialog;
	const mapStatus = mapState(state);

	if (isLoaded) {
		const { orgId } = user;
		const { ownerOrg, entityType } = entity;
		const contextId = entity.id;
		const widgetState = widgetStateSelector(state);
		// Check if camera is the primary context
		const isPrimary =
			contextId === contextPanelState(state).selectedContext.primary;
		const fromOrg = ownerOrg === orgId;
		const fromEco = ownerOrg !== orgId;
		const feeds = userFeedsSelector(state);
		const activeFOV = _.includes(_.keys(state.globalData.fovs.data), contextId);

		return {
			camera: entity,
			disableLinkedItems: true,
			context,
			contextId,
			user,
			entityType,
			widgetState,
			feeds,
			fromOrg,
			fromEco,
			activityFilters,
			widgetsExpandable: false,
			widgetsLaunchable: true,
			cameraPriority: state.appState.dock.cameraDock.cameraPriority,
			sidebarOpen: state.appState.dock.dockData.isOpen,
			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
			isPrimary,
			dialog,
			mapVisible: mapStatus.visible,
			activeFOV,
			fullscreenCamera: fullscreenCameraOpen(state),
			appData,
			appId: state.appId,
			timeFormatPreference: state.appState.global.timeFormat,
			dir: getDir(state)
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraProfile);

export default CameraProfileContainer;
