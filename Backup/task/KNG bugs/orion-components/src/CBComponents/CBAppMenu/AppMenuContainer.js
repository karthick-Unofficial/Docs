import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appMenuActions";

import CBAppMenu from "./AppMenu";

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.session.user
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AppMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CBAppMenu);

export default AppMenuContainer;
