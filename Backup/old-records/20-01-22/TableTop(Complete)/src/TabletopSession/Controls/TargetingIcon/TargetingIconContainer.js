import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { moveToTarget } from "orion-components/AppState/Actions";
import TargetingIcon from "./TargetingIcon";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		mapRefs: state.tabletopSession ? state.tabletopSession.mapRefs : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ moveToTarget }, dispatch);
};

const TargetingIconContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TargetingIcon);

export default TargetingIconContainer;
