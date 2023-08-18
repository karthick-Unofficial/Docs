import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import * as actionCreators from "./eventProfileActions.js";
import { EventProfile } from "orion-components/Profiles";
import { appData } from "../../shared/utility/util-functions";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import {
	selectedContextSelector,
	contextPanelState
} from "orion-components/ContextPanel/Selectors";
import {
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startProximityEntitiesStream
} from "orion-components/ContextualData/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	mapState,
	persistedState,
	fullscreenCameraOpen,
	widgetStateSelector
} from "orion-components/AppState/Selectors";
import {
	userFeedsSelector,
	eventTypesSelector,
	templatesSelector
} from "orion-components/GlobalData/Selectors";
import { userApplicationArraySelector } from "orion-components/Session/Selectors";
import $ from "jquery";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const externalSystems = state.session.organization.externalSystems;
	const { locale } = state.i18n;	
	const context = selectedContextSelector(state);
	const { clientConfig, appState } = state;
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = persistedState(state);
	let lookupData = {};
	const dialog = appState.dialog.openDialog;
	const mapStatus = mapState(state);
	const view = state.userAppState.eventView;
	if (isLoaded) {
		const { orgId } = user;
		const { ownerOrg } = entity;
		const contextId = entity.id;
		const isPrimary =
			contextId === contextPanelState(state).selectedContext.primary;
		const fromOrg = ownerOrg === orgId;
		const fromEco = ownerOrg !== orgId;
		if (state.globalData) {
			lookupData = state.globalData.listLookupData ?
				state.globalData.listLookupData : {};
		}
		const types = eventTypesSelector(state);
		const templates = templatesSelector(state);
		const widgetState = widgetStateSelector(state);
		const feeds = userFeedsSelector(state);
		const mobile = $(window).width() <= 1023;
		return {
			context,
			contextId: context.entity.id,
			dialog,
			lookupData,
			isPrimary,
			event: entity,
			defaultListPagination: clientConfig.defaultListPagination,
			listPaginationOptions: clientConfig.listPaginationOptions,
			fromOrg,
			fromEco,
			activityFilters,
			widgetState,
			mapVisible: mapStatus.visible,
			user,
			types,
			templates,
			feeds,
			widgetsExpandable: !mobile,
			widgetsLaunchable: true,
			view,
			appData,
			appId: state.appId,
			fullscreenCamera: fullscreenCameraOpen(state),
			widgetLaunchData: state.userAppState.widgetLaunchData,
			secondaryExpanded: contextPanelState(state).secondaryExpanded,
			timeFormatPreference: appState.global.timeFormat,
			sidebarOpen: state.appState.dock.dockData.isOpen,
			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
			dir: getDir(state),
			externalSystems,
			locale
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = dispatch => {
	const actions = {
		...actionCreators,
		startListStream,
		startEventActivityStream,
		startAttachmentStream,
		startEventPinnedItemsStream,
		startProximityEntitiesStream,
		unsubscribeFromFeed,
		openDialog,
		closeDialog
	};
	return bindActionCreators(actions, dispatch);
};

const EventProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventProfile);

export default EventProfileContainer;
