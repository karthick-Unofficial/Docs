import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./entityProfileActions.js";
import { appData } from "../../shared/utility/utilities";
import { EntityProfile } from "orion-components/Profiles";
import {
	collectionsSelector,
	feedInfoSelector,
	floorPlanSelector
} from "orion-components/GlobalData/Selectors";
import {
	mapState,
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
	const mapStatus = mapState(state);
	const trackHistDuration = trackHistoryDuration(state);
	const { locale } = state.i18n;
	const floorPlansWithFacilityFeed = floorPlanSelector(state);

	if (isLoaded) {
		const { orgId } = user;
		const { ownerOrg, entityType, feedId } = entity;
		const { displayProperties, marineTrafficVisible, profileIconTemplate } = feedInfoSelector(feedId)(state);

		const widgetState = widgetStateSelector(state);

		// Check which org created camera
		const fromOrg = ownerOrg === orgId;
		const fromEco = ownerOrg !== orgId;

		return {
			floorPlansWithFacilityFeed,
			entityCollections: collectionsSelector(state),
			user,
			feedDisplayProps: displayProperties,
			notifications: state.globalData.notifications,
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

const EntityContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EntityProfile);

export default EntityContainer;
