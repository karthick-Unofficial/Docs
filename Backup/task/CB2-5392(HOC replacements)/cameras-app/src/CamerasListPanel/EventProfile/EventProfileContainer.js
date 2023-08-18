// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import _ from "lodash";
// import * as actionCreators from "./eventProfileActions.js";
// import { EventProfile } from "orion-components/Profiles";
// import { appData } from "../../shared/utility/utilities";
// import { widgetStateSelector } from "orion-components/AppState/Selectors";
// import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
// import {
// 	selectedContextSelector,
// 	contextPanelState
// } from "orion-components/ContextPanel/Selectors";
// import {
// 	startListStream,
// 	startEventActivityStream,
// 	startAttachmentStream,
// 	startEventPinnedItemsStream
// } from "orion-components/ContextualData/Actions";
// import { openDialog, closeDialog } from "orion-components/AppState/Actions";
// import { mapState, persistedState } from "orion-components/AppState/Selectors";
// import {
// 	userFeedsSelector,
// 	eventTypesSelector
// } from "orion-components/GlobalData/Selectors";
// import { userApplicationArraySelector } from "orion-components/Session/Selectors";
// import $ from "jquery";
// import { getDir } from "orion-components/i18n/Config/selector";

// const mapStateToProps = state => {
// 	const user = state.session.user.profile;
// 	const externalSystems = state.session.organization.externalSystems;
// 	const context = selectedContextSelector(state);
// 	const { clientConfig } = state;
// 	const { entity } = context;
// 	const isLoaded = _.isObject(context) && entity;
// 	const { activityFilters } = persistedState(state);
// 	const dialog = state.appState.dialog.openDialog;
// 	const mapStatus = mapState(state);
// 	let lookupData = {};
// 	const view = state.userAppState.eventView;
// 	if (isLoaded) {
// 		const { orgId } = user;
// 		const { ownerOrg } = entity;
// 		const contextId = entity.id;
// 		if (state.globalData) {
// 			lookupData = state.globalData.listLookupData ?
// 				state.globalData.listLookupData : {};
// 		}
// 		const isPrimary =
// 			contextId === contextPanelState(state).selectedContext.primary;
// 		const fromOrg = ownerOrg === orgId;
// 		const fromEco = ownerOrg !== orgId;
// 		const types = eventTypesSelector(state);
// 		const widgetState = widgetStateSelector(state);
// 		const feeds = userFeedsSelector(state);
// 		const mobile = $(window).width() <= 1023;
// 		return {
// 			context,
// 			contextId: context.entity.id,
// 			dialog,
// 			isPrimary,
// 			event: entity,
// 			defaultListPagination: clientConfig.defaultListPagination,
// 			listPaginationOptions: clientConfig.listPaginationOptions,
// 			lookupData,
// 			fromOrg,
// 			fromEco,
// 			activityFilters,
// 			widgetState,
// 			mapVisible: mapStatus.visible,
// 			user,
// 			types,
// 			feeds,
// 			widgetsExpandable: !mobile,
// 			widgetsLaunchable: true,
// 			view,
// 			appData,
// 			appId: state.appId,
// 			timeFormatPreference: state.appState.global.timeFormat,
// 			externalSystems,
// 			dir: getDir(state)
// 		};
// 	} else {
// 		return {};
// 	}
// };

// const mapDispatchToProps = dispatch => {
// 	const actions = {
// 		...actionCreators,
// 		startListStream,
// 		startEventActivityStream,
// 		startAttachmentStream,
// 		startEventPinnedItemsStream,
// 		unsubscribeFromFeed,
// 		openDialog,
// 		closeDialog
// 	};
// 	return bindActionCreators(actions, dispatch);
// };

// const EventProfileContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(EventProfile);

// export default EventProfileContainer;
