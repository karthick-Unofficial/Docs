import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions";
import { startNotificationStream } from "./Notifications/actions";
import { getAllCameras } from "./Cameras/actions";
import { userCamerasSelector } from "./Cameras/selectors";
import { acknowledgeSystemNotification, clearSystemNotifications } from "../Services/SystemNotificationService/actions";
import DockWrapper from "./DockWrapper";
import { userIntegrationsOfEntityTypeSelector } from "orion-components/Session/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { dockData } = state.appState.dock; //TODO: dockdata.newalerts
	const { notifications } = state.globalData;
	const { locale } = state.i18n;
	let allNotifications = [];

	if (notifications) {	
		const activeNotifications = notifications.activeItems.map(
			id => notifications.activeItemsById[id]
		);
		const archiveNotifications = notifications.archiveItems.map(
			id => notifications.archiveItemsById[id]
		);

		allNotifications = activeNotifications.concat(archiveNotifications);
	}

	const cameraIntegrations = userIntegrationsOfEntityTypeSelector("camera")(
		state
	);
	const userCameras = userCamerasSelector(state);

	const { user } = state.session;
	const { profile, firstUseText } = user;
	const { sessionEnded } = user;
	const { firstUseAck, id } = profile;

	const hasSysHealthError = state.systemHealth.hasHealthError;

	const externalSystems = (state.session && state.session.organization && state.session.organization.externalSystems) || [];

	return {		
		notifications: allNotifications,
		componentState: dockData,
		userHasCameras: cameraIntegrations && cameraIntegrations.length > 0,
		userCameras,
		sessionEnded,
		firstUseAck,
		firstUseText,
		userId: id,
		hasSysHealthError,
		timeFormatPreference: state.appState.global.timeFormat,
		systemNotifications: state.systemNotifications,
		externalSystems,
		dir: getDir(state),
		locale
	};
};

const mapDispatchToProps = dispatch => {
	const actions = {
		...actionCreators,
		startNotificationStream,
		getAllCameras,
		acknowledgeSystemNotification,
		clearSystemNotifications
	};
	return bindActionCreators(actions, dispatch);
};

const DockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DockWrapper);

export default DockContainer;
