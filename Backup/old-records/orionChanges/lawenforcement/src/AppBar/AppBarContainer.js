import { connect } from "react-redux";
import { logOut } from "./appBarActions";
import AppBar from "./AppBar";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = (state, ownProps) => {
	let title = "Law Enforcement Search";
	if (ownProps.location.state && ownProps.location.state.name) {
		title = ownProps.location.state.name;
	}
	else if (state.application && state.application.name) {
		title = state.application.name;
	}

	return {
		user: state.session.user,
		title,
		dir: getDir(state)

	};
};

const mapDispatchToProps = dispatch => {
	return {
		logOut: () => {
			dispatch(logOut());
		}
	};
};

const AppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppBar);

export default AppBarContainer;
