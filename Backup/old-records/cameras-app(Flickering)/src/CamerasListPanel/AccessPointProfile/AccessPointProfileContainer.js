import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./accessPointProfileActions";
import { AccessPointProfile } from "orion-components/Profiles";
import {
	mapState,
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
	const user = state.session.user.profile;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = persistedState(state);
	const dialog = state.appState.dialog.openDialog;
	const mapStatus = mapState(state);
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
			accessPoint: entity,
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
			widgetsExpandable: false,
			widgetsLaunchable: true,
			cameraPriority: state.appState.dock.cameraDock.cameraPriority,
			sidebarOpen: state.appState.dock.dockData.isOpen,
			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
			isPrimary,
			dialog,
			mapVisible: mapStatus.visible,
			fullscreenCamera: fullscreenCameraOpen(state),
			appId: state.appId,
			timeFormatPreference: state.appState.global.timeFormat,
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

const AccessProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AccessPointProfile);

export default AccessProfileContainer;
