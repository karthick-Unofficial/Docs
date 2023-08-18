import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./entityProfileActions.js";
import { appData, getInitialPlayBarData } from "../../../shared/utility/utilities";
import { EntityProfile } from "orion-components/Profiles";
import {
	collectionsSelector,
	feedInfoSelector
} from "orion-components/GlobalData/Selectors";
import {
	replayMapState,
	widgetStateSelector,
	trackHistoryDuration,
	persistedState,
	fullscreenCameraOpen
} from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = state => {
	const user = state.session.user.profile;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const dialog = state.appState.dialog.openDialog;
	const dialogData = state.appState.dialog.dialogData;
	const { activityFilters } = persistedState(state);
	const mapStatus = replayMapState(state);
	const trackHistDuration = trackHistoryDuration(state);

	let replayEntity = null;
	const timeData = getInitialPlayBarData(state.playBar.playBarValue, state.replay.timeTransactions);
	if (timeData) {
		if (timeData[entity.id]) {
			replayEntity = timeData[entity.id];
		}
	}

	if (isLoaded) {
		const { orgId } = user;
		const { ownerOrg, entityType, feedId } = entity;
		const { displayProperties, marineTrafficVisible, profileIconTemplate } = feedInfoSelector(feedId)(state);

		const widgetState = widgetStateSelector(state);

		// Check which org created camera
		const fromOrg = ownerOrg === orgId;
		const fromEco = ownerOrg !== orgId;

		return {
			user,
			feedDisplayProps: displayProperties,
			notifications: state.globalData ? state.globalData.notifications : [],
			sidebarOpen: state.appState.dock.dockData.isOpen,
			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
			dialog,
			dialogData,
			widgetState,
			widgetsLaunchable: true,
			context,
			contextId: entity.id,
			entityType,
			fromOrg,
			fromEco,
			activityFilters,
			mapVisible: mapStatus.visible,
			trackHistDuration,
			fullscreenCamera: fullscreenCameraOpen(state),
			appData,
			appId: state.appId,
			marineTrafficVisible,
			profileIconTemplate,
			timeFormatPreference: state.appState.global.timeFormat,
			replayEntity,
			dir: getDir(state)
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EntityContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EntityProfile);

export default EntityContainer;
