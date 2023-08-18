// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as actionCreators from "./entityProfileActions.js";
// import { appData } from "../../shared/utility/utilities";
// import { EntityProfile } from "orion-components/Profiles";
// import {
// 	collectionsSelector,
// 	feedInfoSelector
// } from "orion-components/GlobalData/Selectors";
// import {
// 	widgetStateSelector,
// 	persistedState,
// 	trackHistoryDuration,
// 	fullscreenCameraOpen
// } from "orion-components/AppState/Selectors";
// import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
// import _ from "lodash";
// import { getDir } from "orion-components/i18n/Config/selector";

// const mapStateToProps = state => {
// 	const { session, appState, globalData, mapState } = state;
// 	const user = session.user.profile;
// 	const context = selectedContextSelector(state);
// 	const { entity } = context;
// 	const isLoaded = _.isObject(context) && entity;
// 	const dialog = appState.dialog.openDialog;
// 	const dialogData = appState.dialog.dialogData;
// 	const { activityFilters } = persistedState(state);
// 	const trackHistDuration = trackHistoryDuration(state);

// 	if (isLoaded) {
// 		const { orgId } = user;
// 		const { ownerOrg, entityType, feedId } = entity;
// 		const { displayProperties, marineTrafficVisible, profileIconTemplate } = feedInfoSelector(feedId)(state);

// 		const widgetState = widgetStateSelector(state);

// 		// Check which org created camera
// 		const fromOrg = ownerOrg === orgId;
// 		const fromEco = ownerOrg !== orgId;

// 		return {
// 			entityCollections: collectionsSelector(state),
// 			user,
// 			feedDisplayProps: displayProperties,
// 			notifications: globalData.notifications,
// 			sidebarOpen: appState.dock.dockData.isOpen,
// 			dockedCameras: appState.dock.cameraDock.dockedCameras,
// 			dialog,
// 			dialogData,
// 			widgetState,
// 			context,
// 			contextId: entity.id,
// 			entityType,
// 			fromOrg,
// 			fromEco,
// 			activityFilters,
// 			mapVisible: mapState.baseMap.visible,
// 			trackHistDuration,
// 			fullscreenCamera: fullscreenCameraOpen(state),
// 			appData,
// 			appId: state.appId,
// 			widgetsLaunchable: true,
// 			marineTrafficVisible,
// 			profileIconTemplate,
// 			timeFormatPreference: state.appState.global.timeFormat,
// 			dir: getDir(state)
// 		};
// 	} else {
// 		return {};
// 	}
// };

// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators(actionCreators, dispatch);
// };

// const EntityContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(EntityProfile);

// export default EntityContainer;
