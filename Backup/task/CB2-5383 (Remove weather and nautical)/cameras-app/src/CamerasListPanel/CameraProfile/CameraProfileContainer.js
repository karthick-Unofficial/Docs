import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraProfileActions.js";
import { appData } from "../../shared/utility/utilities";
import { CameraProfile } from "orion-components/Profiles";
import {
	persistedState,
	widgetStateSelector,
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
	const { session, appState, userAppState, mapState } = state;
	const user = session.user.profile;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && !!entity;
	const { activityFilters } = persistedState(state);
	const dialog = appState.dialog.openDialog;
	const view = userAppState.cameraView;
	const { locale } = state.i18n;

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
		return {
			camera: entity,
			context,
			contextId,
			user,
			entityType,
			widgetState,
			feeds,
			facilityOption: true,
			fromOrg,
			fromEco,
			activityFilters,
			widgetsExpandable: true,
			widgetsLaunchable: false,
			cameraPriority: appState.dock.cameraDock.cameraPriority,
			sidebarOpen: appState.dock.dockData.isOpen,
			dockedCameras: appState.dock.cameraDock.dockedCameras,
			isPrimary,
			dialog,
			mapVisible: mapState.baseMap.visible,
			view,
			fullscreenCamera: fullscreenCameraOpen(state),
			appData,
			appId: state.appId,
			timeFormatPreference: state.appState.global.timeFormat,
			disabledLinkedItemTypes: ["facility"],
			dir: getDir(state),
			locale
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
