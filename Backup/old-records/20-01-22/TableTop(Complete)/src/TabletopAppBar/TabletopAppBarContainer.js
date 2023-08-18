import { connect } from "react-redux";
import { logOut } from "./tabletopAppBarActions";
import TabletopAppBar from "./TabletopAppBar";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const location = ownProps.location.state
		? ownProps.location.state.name
		: "Tabletop";

	return {
		user: state.session.user,
		location,
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

const TabletopAppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TabletopAppBar);

export default TabletopAppBarContainer;
