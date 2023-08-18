import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./modificationActions";
import ModificationsCoordinator from "./ModificationsCoordinator";

const mapStateToProps = state => {
	return {
		modificationsActive: state.tabletopSession.session.modificationsActive,
		modificationSubscription: state.tabletopSession.modificationSubscription
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ModificationsCoordinatorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ModificationsCoordinator);

export default ModificationsCoordinatorContainer;
