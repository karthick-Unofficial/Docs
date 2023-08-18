import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./rulesAppBarActions";
import RulesAppBar from "./RulesAppBar";

const mapStateToProps = (state, ownProps) => {
	let title = "Rules";
	if (ownProps.location.state && ownProps.location.state.name) {
		title = ownProps.location.state.name;
	}
	else if (state.application && state.application.name) {
		title = state.application.name;
	}

	return {
		user: state.session.user,
		title
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const RulesAppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RulesAppBar);

export default RulesAppBarContainer;