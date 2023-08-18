import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./contextMenuActions.js";
import AppContextMenu from "./AppContextMenu";
import { trackHistoryDuration } from "orion-components/AppState/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { profile } = state.session.user;
	const { spotlights } = state;
	const trackHistory = trackHistorySelector(state);
	const trackHistDuration = trackHistoryDuration(state);
	return { 
		profile, 
		spotlights, 
		trackHistory,
		trackHistoryDuration: trackHistDuration,
		timeFormatPreference: state.appState.global.timeFormat,
		dir: getDir(state)
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const ContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppContextMenu);

export default ContextMenuContainer;
