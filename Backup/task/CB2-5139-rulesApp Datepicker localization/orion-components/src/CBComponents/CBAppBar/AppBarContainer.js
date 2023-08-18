import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appBarActions";
import _ from "lodash";
import CBAppBar from "./AppBar";

const mapStateToProps = state => {
	const { globalData } = state;
	const alertCount = _.size(
		_.pickBy(globalData.notifications.activeItemsById, item => item.isPriority)
	);
	return {
		user: state.user,
		alertCount
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CBAppBar);

export default AppBarContainer;
