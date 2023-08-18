// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as actionCreators from "./facilityProfileActions";
// import { appData } from "../../shared/utility/utilities";
// import { FacilityProfile } from "orion-components/Profiles";
// import { selectedFacilitySelector, contextPanelState } from "orion-components/ContextPanel/Selectors";
// import { widgetStateSelector } from "orion-components/AppState/Selectors";
// import {
// 	persistedState
// } from "orion-components/AppState/Selectors";
// import _ from "lodash";
// import { getDir } from "orion-components/i18n/Config/selector";

// const mapStateToProps = state => {
// 	const fullContext = selectedFacilitySelector(state);
// 	const { session, globalData } = state;
// 	const user = session.user.profile;
// 	const entity = fullContext ? fullContext.entity : null;
// 	const dialog = state.appState.dialog.openDialog;
// 	const isLoaded = _.isObject(fullContext) && entity;
// 	const view = state.userAppState.facilityView;
// 	const { floorPlans } = globalData;
// 	let widgetState = [];
// 	if (isLoaded) {
// 		const { orgId } = user;
// 		const { ownerOrg } = entity;
// 		const { activityFilters } = persistedState(state);
// 		const contextId = entity.id;
// 		const isPrimary =
// 			contextId === contextPanelState(state).selectedContext.primary;
// 		const fromOrg = ownerOrg === orgId;
// 		const fromEco = ownerOrg !== orgId;
// 		widgetState = widgetStateSelector(state);
// 		return {
// 			context: fullContext,
// 			activityFilters,
// 			user,
// 			appData,
// 			actionOptions: ["edit", "hide", "delete"],
// 			view,
// 			sidebarOpen: state.appState.dock.dockData.isOpen,
// 			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
// 			facilityId: entity.id,
// 			isPrimary,
// 			fromEco,
// 			fromOrg,
// 			floorPlans,
// 			dialog,
// 			widgetState,
// 			widgetsLaunchable: false,
// 			timeFormatPreference: state.appState.global.timeFormat,
// 			dir: getDir(state),
// 			locale: state.i18n.locale
// 		};
// 	}
// 	return {

// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators(actionCreators, dispatch);
// };

// const FacilityProfileContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(FacilityProfile);

// export default FacilityProfileContainer;
