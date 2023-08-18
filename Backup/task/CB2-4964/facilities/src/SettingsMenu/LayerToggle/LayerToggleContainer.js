import { connect } from "react-redux";
import LayerToggle from "./LayerToggle.jsx";
import { bindActionCreators } from "redux";
import * as actionCreators from "./layerToggleActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const { updateKey } = ownProps;
	const { mapSettings } = state.appState.persisted;
	if (mapSettings && mapSettings[updateKey]) {
		const { opacity, visible } = mapSettings[updateKey];
		return { opacity, visible, dir: getDir(state) };
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
