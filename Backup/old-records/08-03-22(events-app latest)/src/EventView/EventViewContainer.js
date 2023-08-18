import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventViewActions.js";
import {
	unsubscribeFromFeed,
	startProximityEntitiesStream
} from "orion-components/ContextualData/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { persistedState } from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";

import $ from "jquery";

import EventView from "./EventView";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const user = state.session.user.profile;
	const { orgId } = user;
	const { clientConfig } = state;
	const { contextualData } = state;
	const primaryId = primaryContextSelector(state);
	const context = contextualData[primaryId];
	const view = context ? state.userAppState.eventView : "Map Planner";
	const isLoaded = _.isObject(context) && context.entity;
	const { activityFilters } = persistedState(state);
	let lookupData = {};
	if (state.globalData) {
		lookupData = state.globalData.listLookupData ?
			state.globalData.listLookupData : {};
	}
	let event;
	let fromOrg;
	let fromEco;
	let contextId;
	let isPrimary;
	let feeds;

	if (isLoaded) {
		const { entity } = context;
		const { ownerOrg } = entity;
		event = entity;
		contextId = entity.id;
		isPrimary = contextId === contextPanelState(state).selectedContext.primary;
		// Check which org created event
		fromOrg = ownerOrg === orgId;
		fromEco = ownerOrg !== orgId;
		feeds = userFeedsSelector(state);
	}

	let viewWidth;

	// Set view width based on which panels are open
	if (view === "Map Planner") {
		viewWidth = "full";
	} else if (!state.appState.contextPanel.contextPanelData.primaryOpen) {
		if (state.appState.contextPanel.contextPanelData.secondaryOpen && state.appState.contextPanel.contextPanelData.secondaryExpanded) {
			viewWidth = "onlySecondaryExpanded";
		} else if (state.appState.contextPanel.contextPanelData.secondaryOpen) {
			viewWidth = "onlySecondary";
		} else {
			viewWidth = "wide";
		}
	} else if (state.appState.contextPanel.contextPanelData.secondaryOpen && state.appState.contextPanel.contextPanelData.secondaryExpanded) {
		viewWidth = "secondaryExpanded";
	} else if (state.appState.contextPanel.contextPanelData.secondaryOpen) {
		viewWidth = "narrow";
	} else if (state.appState.contextPanel.contextPanelData.primaryOpen) {
		viewWidth = "normal";
	}

	return {
		viewWidth,
		view,
		fromOrg,
		lookupData,
		defaultListPagination: clientConfig.defaultListPagination,
		listPaginationOptions: clientConfig.listPaginationOptions,
		fromEco,
		activityFilters,
		event,
		context,
		contextId,
		dialog: state.appState.dialog.openDialog,
		isPrimary,
		mobile: $(window).width() <= 1023,
		user,
		feeds,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	const actions = {
		...actionCreators,
		startProximityEntitiesStream,
		unsubscribeFromFeed,
		openDialog,
		closeDialog
	};
	return bindActionCreators(actions, dispatch);
};

const EventViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventView);

export default EventViewContainer;
