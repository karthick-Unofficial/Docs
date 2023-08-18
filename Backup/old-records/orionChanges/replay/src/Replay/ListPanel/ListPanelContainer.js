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

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const collections = window.api ? [] : collectionsSelector(state);
	
	// const profileMode = null;
	const profileMode = selectedEntityState(state)
		? selectedEntityState(state).type
		: null;
	const profileLoaded =
		!state.appState.loading.profileLoading &&
		Boolean(selectedContextSelector(state));
	const drawingToolsActive = false;
	const ownedEvents = window.api ? [] : activeOwnedEventsSelector(state);
	const sharedEvents = window.api ? [] : activeSharedEventsSelector(state);
	const { orgRole } = state.session.user.profile;
	const exclusions = window.api ? [] : userExclusionSelector(state);
	return {
		collections,
		ownedEvents,
		sharedEvents,
		filterCount: _.size(listPanelState(state).mapFilters),
		profileMode,
		profileLoaded,
		drawingToolsActive,
		user,
		orgRole,
		exclusions
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
