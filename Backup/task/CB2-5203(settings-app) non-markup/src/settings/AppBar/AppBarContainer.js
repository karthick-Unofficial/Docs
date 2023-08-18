// redux
import { connect } from "react-redux";
import { logOut, updateGlobalUserAppSettings}  from "./appBarActions";

// components
import SettingsAppBar from "./SettingsAppBar";

// routing
import { routes as r } from "../routes.js";
import { getDir } from "orion-components/i18n/Config/selector";

// Reads routing prop and renders correct App Bar title
const mapStateToProps = (state, ownProps) => {
	let title = "Settings";
	if (ownProps.location.state && ownProps.location.state.name) {
		title = ownProps.location.state.name;
	}
	else if (state.application && state.application.name) {
		title = state.application.name;
	}

	const notifications = state.globalData.notifications.activeItems.map((id) => {
		return state.globalData.notifications.activeItemsById[id];
	});

	const globalState = state.appState.global;


	return {
		user: state.session.user,
		title,
		notifications,
		globalState,
		dir: getDir(state)
	};
		
	
};

const mapDispatchToProps = (dispatch) => {
	return {
		logOut: () => {
			dispatch(logOut());
		}
	};
};

const AppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsAppBar);

export default AppBarContainer;