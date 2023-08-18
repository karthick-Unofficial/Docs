import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions";
import App from "./App.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const primaryOpen = state.appState.contextPanel.contextPanelData.primaryOpen;
	const xOffset = primaryOpen ? 360 : 60;
	return {
		identity: state.session.identity,
		isHydrated: state.session.user.isHydrated,
		xOffset,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
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
