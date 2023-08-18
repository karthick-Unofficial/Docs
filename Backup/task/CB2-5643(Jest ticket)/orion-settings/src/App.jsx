import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// components
import AppBar from "./AppBar/SettingsAppBar";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "./appActions";

const App = ({ children }) => {
	const dispatch = useDispatch();

	const {
		hydrateUser,
		hydrateEcosystem,
		hydrateGlobalAppSettings,
		subscribeFeedPermissions,
		checkSharingTokenStatus,
		refreshAll
	} = actionCreators;

	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const username = useSelector(state => state.session.identity.userId);
	const orgIds = useSelector(state => Object.keys(state.globalData.orgs));
	const dialogOpen = useSelector(state => state.appState.dialog.openDialog);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const location = useLocation();

	useEffect(() => {
		dispatch(hydrateUser(username));
		dispatch(hydrateEcosystem());
		dispatch(hydrateGlobalAppSettings());
		dispatch(subscribeFeedPermissions());
		dispatch(checkSharingTokenStatus());
	}, []);

	useEffect(() => {
		dispatch(refreshAll(username));
	}, [children]);

	useEffect(() => {
		if (!dialogOpen) {
			const html = document.getElementsByTagName("html")[0];
			html.style.position = "static";
		}
	}, [dialogOpen]);

	return (
		<div className="settings-app">
			{isHydrated && (
				<div>
					<Services />
					<ErrorBoundary>
						<AppBar location={location.pathname} />
					</ErrorBoundary>
					<WavCam />
					<div style={{
						paddingTop: "52px",
						height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`,
						overflowY: "scroll"
					}}>
						{children}
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
