import { connect } from "react-redux";
import SideNavigation from "./SideNavigation";

const mapStateToProps = (state, ownProps) => {
	const isEcoAdmin = (state.session.user.profile.ecoAdmin);
	const isAdmin = state.session.user.profile.admin;

	// ---------------------------------------------------------------

	return {
		isEcoAdmin,
		isAdmin,
		location: ownProps.location
	};
};

const SideNavigationContainer = connect(
	mapStateToProps
)(SideNavigation);

export default SideNavigationContainer;