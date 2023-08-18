import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actionCreators from "./listPanelActions.js";

import ListPanel from "./ListPanel";

import {
	collectionsSelector,
	activeOwnedEventsSelector,
	activeSharedEventsSelector,
	userExclusionSelector
} from "orion-components/GlobalData/Selectors";
import { listPanelState } from "orion-components/ContextPanel/Selectors";
import {
	selectedContextSelector,
	selectedEntityState
} from "orion-components/ContextPanel/Selectors";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const collections = collectionsSelector(state);
	const profileMode = selectedEntityState(state)
		? selectedEntityState(state).type
		: null;
	const profileLoaded =
		!state.appState.loading.profileLoading &&
		Boolean(selectedContextSelector(state));
	const context = selectedContextSelector(state);
	const drawingToolsActive = state.mapState.mapTools.type === "drawing";
	const ownedEvents = activeOwnedEventsSelector(state);
	const sharedEvents = activeSharedEventsSelector(state);
	const exclusions = userExclusionSelector(state);
	return {
		collections,
		ownedEvents,
		sharedEvents,
		filterCount: _.size(listPanelState(state).mapFilters),
		profileMode,
		profileLoaded,
		context,
		drawingToolsActive,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		user,
		exclusions,
		dir: getDir(state)
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const ListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListPanel);

export default ListPanelContainer;
