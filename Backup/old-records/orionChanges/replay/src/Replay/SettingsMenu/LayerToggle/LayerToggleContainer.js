import { connect } from "react-redux";
import LayerToggle from "./LayerToggle.jsx";
import { bindActionCreators } from "redux";
import * as actionCreators from "./layerToggleActions";

const mapStateToProps = (state, ownProps) => {
	const { updateKey } = ownProps;
	const { mapSettings } = state.appState.persisted;
	if (mapSettings && mapSettings[updateKey]) {
		const { opacity, visible } = mapSettings[updateKey];
		return { opacity, visible: ownProps.visible ? ownProps.visible : visible };
	}
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const LayerToggleContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LayerToggle);

export default LayerToggleContainer;
