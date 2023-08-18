import React, { useEffect } from "react";



// components
import AppBarContainer from "./AppBar/AppBarContainer";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";

const App = ({
	hydrateUser,
	username,
	hydrateEcosystem,
	hydrateGlobalAppSettings,
	subscribeFeedPermissions,
	checkSharingTokenStatus,
	children,
	dialogOpen,
	refreshAll,
	location,
	isHydrated,
	WavCamOpen
}) => {

	useEffect(() => {
		hydrateUser(username);
		hydrateEcosystem();
		hydrateGlobalAppSettings();
		subscribeFeedPermissions();
		checkSharingTokenStatus();
	}, []);

	useEffect(() => {
		refreshAll(username);
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
						<AppBarContainer location={location.pathname} />
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
