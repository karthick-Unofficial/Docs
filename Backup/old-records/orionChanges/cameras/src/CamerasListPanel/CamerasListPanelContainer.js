import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./camerasListPanelActions.js";
import {
	collectionsSelector,
	feedEntitiesByTypeSelector
} from "orion-components/GlobalData/Selectors";
import {
	listPanelState,
	searchValueSelector,
	viewingHistorySelector
} from "orion-components/ContextPanel/Selectors";
import {
	selectedContextSelector,
	selectedEntityState
} from "orion-components/ContextPanel/Selectors";

import _ from "lodash";

import CamerasListPanel from "./CamerasListPanel";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const searchValue = searchValueSelector(state);
	const cameras = feedEntitiesByTypeSelector("camera")(state);
	const collections = collectionsSelector(state);
	const filterCount = _.size(listPanelState(state).mapFilters);
	const profileMode = selectedEntityState(state)
		? selectedEntityState(state).type
		: null;
	const { mapTools } = state.mapState;
	return {
		searchValue,
		cameras,
		collections,
		profileMode,
		history: viewingHistorySelector(state),
		filterCount,
		profileLoaded:
			!state.appState.loading.profileLoading &&
			!!selectedContextSelector(state),
		drawingToolsActive: !!mapTools.type,
		widgetLaunchData: state.userAppState.widgetLaunchData,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CamerasListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CamerasListPanel);

export default CamerasListPanelContainer;
