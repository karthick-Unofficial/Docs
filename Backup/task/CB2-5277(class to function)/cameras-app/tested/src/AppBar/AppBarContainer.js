// redux
import { connect } from "react-redux";
import { logOut } from "./appBarActions";

// components
import CamerasAppBar from "./CamerasAppBar";

import { mapObject } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

// Reads routing prop and renders correct App Bar title
const mapStateToProps = (state, ownProps) => {
	let title = "Cameras";
	const { baseMaps } = state;
	if (ownProps.location.state && ownProps.location.state.name) {
		title = ownProps.location.state.name;
	}
	else if (state.application && state.application.name) {
		title = state.application.name;
	}

	return {
		user: state.session.user,
		title,
		map: mapObject(state),
		baseMaps,
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

const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
	CamerasAppBar
);

export default AppBarContainer;
