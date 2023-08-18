import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions";
import App from "./App.jsx";

const mapStateToProps = state => {
	const { map, session, view } = state;
	const { user, identity } = session;
	return {
		identity,
		isHydrated: user.isHydrated,
		map,
		view,
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
