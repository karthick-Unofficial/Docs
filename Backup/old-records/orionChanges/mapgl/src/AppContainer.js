import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./appActions.js";
import App from "./App";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";

import _ from "lodash";

const mapStateToProps = state => {
	const userFeeds = userFeedsSelector(state);
	return {
		identity: state.session.identity,
		isHydrated: state.session.user.isHydrated,
		userId: state.session.user.profile.id,
		userFeeds,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		servicesReady: state.servicesReady,
		useFeedQueue: state.clientConfig.useFeedQueue || false
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
