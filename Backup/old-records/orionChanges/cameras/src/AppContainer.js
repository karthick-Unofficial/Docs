// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions.js";
import App from "./App.jsx";

const mapStateToProps = state => {
	return {
		identity: state.session.identity,
		isHydrated: state.session.user.isHydrated,
		orgId: state.session.user.profile.orgId,
		servicesReady: state.servicesReady,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
