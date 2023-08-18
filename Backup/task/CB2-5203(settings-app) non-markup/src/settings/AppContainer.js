// redux
import { connect } from "react-redux";
import {
	hydrateUser,
	hydrateEcosystem,
	refreshAll,
	startNotificationStream,
	getGlobalAppState,
	getAllOrgApps,
	subscribeFeedPermissions,
	checkSharingTokenSystemStatus
} from "./appActions";

import App from "./App.jsx";

const mapStateToProps = state => {
	return {
		isHydrated: state.session.user.isHydrated,
		username: state.session.identity.userId,
		orgIds: Object.keys(state.globalData.orgs),
		dialogOpen: state.appState.dialog.openDialog,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		store: state
	};
};

const mapDispatchToProps = dispatch => {
	return {
		hydrateUser: userId => {
			dispatch(hydrateUser(userId));
		},
		hydrateEcosystem: () => {
			dispatch(hydrateEcosystem());
		},
		refreshAll: userId => {
			dispatch(refreshAll(userId));
		},
		startNotificationStream: userId => {
			dispatch(startNotificationStream(userId));
		},
		hydrateGlobalAppSettings: () => {
			dispatch(getGlobalAppState());
		},
		subscribeFeedPermissions: () => {
			dispatch(subscribeFeedPermissions());
		},
		checkSharingTokenStatus: () => {
			dispatch(checkSharingTokenSystemStatus());
		}
	};
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

export default AppContainer;
