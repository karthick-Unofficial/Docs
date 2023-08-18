import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./tileOptionsActions";
import TileOptions from "./TileOptions.jsx";

const mapStateToProps = state => {
	const { mapSettings } = state.appState.persisted;
	const { baseMaps } = state;
	return { selected: mapSettings ? mapSettings.mapStyle : undefined, baseMaps };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TileOptionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TileOptions);

export default TileOptionsContainer;
