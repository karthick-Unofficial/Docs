import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventProfileActions.js";
import { appData } from "../../shared/utility/utilities";
import { EventProfile } from "orion-components/Profiles";
import * as pinnedItemsActions from "./actions/pinned-items-dialog-actions";
import {
	persistedState,
	widgetStateSelector,
	mapState,
	fullscreenCameraOpen
} from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	userFeedsSelector,
	eventTypesSelector,
	floorPlanSelector
} from "orion-components/GlobalData/Selectors";
import { userApplicationArraySelector } from "orion-components/Session/Selectors";
import _ from "lodash";
import { startProximityEntitiesStream } from "orion-components/ContextualData/Actions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const externalSystems = state.session.organization.externalSystems;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = persistedState(state);
	const { appState } = state;
	const { locale } = state.i18n;
	const dialog = appState.dialog.openDialog;
	const mapStatus = mapState(state);
	let lookupData = {};
	const floorPlansWithFacilityFeed = floorPlanSelector(state);
	if (isLoaded) {
		const { orgId } = user;
		const { clientConfig } = state;
		const { ownerOrg } = entity;
		const contextId = entity.id;
		const isPrimary =
			contextId === contextPanelState(state).selectedContext.primary;
		const fromOrg = ownerOrg === orgId;
		const fromEco = ownerOrg !== orgId;
		const types = eventTypesSelector(state);
		const widgetState = widgetStateSelector(state);
		const feeds = userFeedsSelector(state);
		if (state.globalData) {
			lookupData = state.globalData.listLookupData ?
				state.globalData.listLookupData : {};
		}
		return {
			context,
			floorPlansWithFacilityFeed,
			contextId: context.entity.id,
			dialog,
			isPrimary,
			lookupData,
			defaultListPagination: clientConfig.defaultListPagination,
			listPaginationOptions: clientConfig.listPaginationOptions,
			event: entity,
			fromOrg,
			fromEco,
			activityFilters,
			widgetState,
			widgetsLaunchable: true,
			mapVisible: mapStatus.visible,
			user,
			types,
			feeds,
			appData,
			appId: state.appId,
			sidebarOpen: appState.dock.dockData.isOpen,
			dockedCameras: appState.dock.cameraDock.dockedCameras,
			fullscreenCamera: fullscreenCameraOpen(state),
			secondaryExpanded: contextPanelState(state).secondaryExpanded,
			timeFormatPreference: appState.global.timeFormat,
			externalSystems,
			dir: getDir(state),
			locale
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = dispatch => {
	const actions = {
		...actionCreators,
		...pinnedItemsActions,
		startProximityEntitiesStream
	};

	return bindActionCreators(actions, dispatch);
};

const EventProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventProfile);

export default EventProfileContainer;
