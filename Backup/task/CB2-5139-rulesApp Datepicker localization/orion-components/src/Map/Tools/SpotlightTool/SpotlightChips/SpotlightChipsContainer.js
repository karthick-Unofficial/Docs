import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./spotlightChipsActions.js";
import SpotlightChips from "./SpotlightChips";
import { cameraMapFeatures } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { spotlights, mapState, session } = state;
	const user = session.user.profile;
	const cameras = cameraMapFeatures(null)(state);
	return {
		spotlights,
		mapTools: mapState.mapTools,
		cameras,
		user,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SpotlightChipsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpotlightChips);

export default SpotlightChipsContainer;
