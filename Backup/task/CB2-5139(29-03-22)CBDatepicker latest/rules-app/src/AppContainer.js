import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions";
import App from "./App";

const mapStateToProps = (state) => {
	// Pull out notifications because they have their own container and they block UI in the app itself

	const {notifications, ...remainder} = state.globalData;
	return {
		...state, 
		globalData: remainder,
		WavCamOpen: state.appState.dock.dockData.WavCam 
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

export default AppContainer;