import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions.js";

// New Orion-Components Actions
import {
	subscribeCameras,
	getAllEvents,
	getAllTemplates,
	subscribeCollections
} from "orion-components/GlobalData/Actions";

import App from "./App.jsx";

import { getAppState } from "orion-components/AppState/Actions";

const mapStateToProps = state => {
	const { user, identity } = state.session;

	return {
		identity: identity,
		isHydrated: user.isHydrated,
		orgId: user.profile.orgId,
		servicesReady: state.servicesReady,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			...actionCreators,
			getAllEvents,
			getAllTemplates,
			subscribeCameras,
			subscribeCollections,
			getAppState
		},
		dispatch
	);
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

export default AppContainer;
