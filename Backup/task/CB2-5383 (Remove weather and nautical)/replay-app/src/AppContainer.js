import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions";
import App from "./App.jsx";

const mapStateToProps = state => {
	return {
		identity: window.api ? { userId: "mock", email: "mock@mock.com", isAuthenticated: true } : state.session.identity,
		isHydrated: window.api ? true : state.session.user.isHydrated,
		WavCamOpen: window.api ? false : state.appState.dock.dockData.WavCam
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
