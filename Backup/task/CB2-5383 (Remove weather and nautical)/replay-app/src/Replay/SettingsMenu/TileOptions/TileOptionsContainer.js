import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./tileOptionsActions";
import TileOptions from "./TileOptions.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { mapSettings } = state.appState.persisted;
	const { baseMaps } = state;
	return { selected: mapSettings ? mapSettings.mapStyle : undefined, baseMaps, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TileOptionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TileOptions);

export default TileOptionsContainer;
