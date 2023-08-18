import React, { Component } from "react";



// components
import AppBarContainer from "./AppBar/AppBarContainer";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";

class App extends Component {
	componentDidMount() {
		this.props.hydrateUser(this.props.username);
		this.props.hydrateEcosystem();
		this.props.hydrateGlobalAppSettings();
		this.props.subscribeFeedPermissions();
		this.props.checkSharingTokenStatus();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.children !== nextProps.children)
			this.props.refreshAll(nextProps.username);
		if (!nextProps.dialogOpen) {
			const html = document.getElementsByTagName("html")[0];
			html.style.position = "static";
		}
	}

	render() {
		const { location, children, isHydrated, WavCamOpen } = this.props;
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
	}
}

export default App;
