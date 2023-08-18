import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actionCreators from "./Actions";
import { setMapOffset } from "../AppState/Actions";

import ContextPanel from "./ContextPanel";
import $ from "jquery";
import {
	contextPanelState,
	viewingHistorySelector,
	selectedContextSelector
} from "./Selectors";

const mapStateToProps = state => {
	const panelState = contextPanelState(state);
	const primaryOpen = panelState ? panelState.primaryOpen : null;
	const secondaryOpen = panelState && ($(".secondary-panel").length || $(".secondary-panelRTL").length) ? panelState.secondaryOpen : null;
	const history = viewingHistorySelector(state);
	const context = Boolean(selectedContextSelector(state));

	return {
		primaryOpen,
		secondaryOpen,
		history,
		mapVisible: state.mapState ? state.mapState.baseMap.visible : false,
		context,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actionCreators, setMapOffset }, dispatch);
};

const ContextPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContextPanel);

export default ContextPanelContainer;
