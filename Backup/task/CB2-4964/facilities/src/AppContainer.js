import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions";
import App from "./App.jsx";
import _ from "lodash";

const mapStateToProps = state => {
	const { session, servicesReady } = state;
	return {
		identity: session.identity,
		isHydrated: session.user.isHydrated,
		orgId: session.user.profile.orgId,
		servicesReady,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

export default AppContainer;
