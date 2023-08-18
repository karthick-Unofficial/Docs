import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./contextMenuActions.js";
import ContextMenu from "./ContextMenu";
import { trackHistoryDuration } from "orion-components/AppState/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";

const mapStateToProps = state => {
	const { profile } = state.session.user;
	const trackHistory = trackHistorySelector(state);
	const trackHistDuration = trackHistoryDuration(state);
	
	return { 
		profile,
		trackHistory,
		trackHistoryDuration: trackHistDuration
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const ContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContextMenu);

export default ContextMenuContainer;
