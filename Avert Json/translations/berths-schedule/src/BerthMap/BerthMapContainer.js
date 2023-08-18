import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthMapActions";
import BerthMap from "./BerthMap.jsx";
const mapStateToProps = state => {
	const { clientConfig, map } = state;
	const { mapSettings } = clientConfig;

	return { mapSettings, map };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthMap);

export default BerthMapContainer;
