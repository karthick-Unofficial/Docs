import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./pinnedItemActions";
import PinnedItem from "./PinnedItem";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const { selectedPinnedItem } = state.appState.persisted;
	const cameraCount = state.camerasByContext[ownProps.id]
		? state.camerasByContext[ownProps.id].length
		: 0;
	return {
		cameraCount,
		selected: Boolean(
			selectedPinnedItem && selectedPinnedItem.id === ownProps.id
		),
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const PinnedItemContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PinnedItem);

export default PinnedItemContainer;
