import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appBarActions";
import AppBar from "./AppBar";
import { getDir } from "orion-components/i18n/Config/selector";
import { floorPlanSelector } from "orion-components/GlobalData/Selectors";


const mapStateToProps = (state) => {
	const floorPlansWithFacilityFeed = floorPlanSelector(state);
	return {
		floorPlansWithFacilityFeed,
		user: state.session.user,
		dir: getDir(state)

	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppBar);

export default AppBarContainer;
