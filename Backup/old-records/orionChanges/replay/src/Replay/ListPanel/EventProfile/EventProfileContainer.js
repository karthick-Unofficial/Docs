import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventProfileActions.js";
import { appData } from "../../../shared/utility/utilities";
import { EventProfile } from "orion-components/Profiles";
import {
	persistedState,
	widgetStateSelector,
	replayMapState,
	fullscreenCameraOpen
} from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	userFeedsSelector,
	eventTypesSelector
} from "orion-components/GlobalData/Selectors";
import { userApplicationArraySelector } from "orion-components/Session/Selectors";
import _ from "lodash";
import { startProximityEntitiesStream } from "orion-components/ContextualData/Actions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const context = selectedContextSelector(state);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = persistedState(state);
	const dialog = state.appState.dialog.openDialog;
	const mapStatus = replayMapState(state);
	let lookupData = {};
	if (isLoaded) {
		const { orgId, orgRole } = user;
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
			contextId: context.entity.id,
			dialog,
			isPrimary,
			lookupData,
			defaultListPagination: clientConfig.defaultListPagination,
			listPaginationOptions: clientConfig.listPaginationOptions,
			event: entity,
			orgRole,
			fromOrg,
			fromEco,
			activityFilters,
			widgetState,
			widgetsLaunchable: false,
			mapVisible: mapStatus.visible,
			user,
			types,
			feeds,
			appData,
			appId: state.appId,
			dockedCameras: state.appState.dock.cameraDock.dockedCameras,
			fullscreenCamera: fullscreenCameraOpen(state),
			secondaryExpanded: contextPanelState(state).secondaryExpanded,
			timeFormatPreference: state.appState.global.timeFormat,
			dir: getDir(state)
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = dispatch => {
	const actions = {
		...actionCreators,
		startProximityEntitiesStream
	};

	return bindActionCreators(actions, dispatch);
};

const EventProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventProfile);

export default EventProfileContainer;
