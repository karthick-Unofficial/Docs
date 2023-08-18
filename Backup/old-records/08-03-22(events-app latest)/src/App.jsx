import React, { Component } from "react";
import { hashHistory } from "react-router";
import { Services } from "orion-components/Services";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";

// if (process.env.NODE_ENV !== "production") {
// 	const {whyDidYouUpdate} = require("why-did-you-update");
// 	whyDidYouUpdate(React);
// }

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Components
import EventsAppBarContainer from "./EventsAppBar/EventsAppBarContainer";
import EventsListPanelContainer from "./EventsListPanel/EventsListPanelContainer";
import EventViewContainer from "./EventView/EventViewContainer";
import ShapePanelContainer from "./ShapePanel/ShapePanelContainer";
import { WavCam } from "orion-components/Dock";


class App extends Component {
	state = {
		serviceReady: false
	}

	componentDidMount() {
		const { identity, getEventTypes, params } = this.props;
		const { entityId, widget } = params;

		Promise.all([
			this.props.getAppState("events-app"),
			this.props.getGlobalAppState(),
			this.props.getMapAppState(),
			this.props.hydrateUser(identity.userId),
			this.props.subscribeAppFeedPermissions(identity.userId, "events-app")
		]).then(() => {
			// New Orion-Components actions
			this.props.subscribeCameras();
			this.props.getAllEvents();
			this.props.getAllTemplates();
			this.props.subscribeCollections();
			getEventTypes();
			this.props.toggleMapVisible();
		});

		if (entityId && widget) {
			// -- store entityId and widget in local state
			const data = { entityId, widget };
			this.props.updateWidgetLaunchData(data);

			// -- remove params from URL
			hashHistory.push({
				pathname: "/"
			});
		}
	}

	render() {
		const { location, isHydrated, servicesReady, WavCamOpen } = this.props;

		return isHydrated ? (
			<div className="app-wrapper">
				<Services>
					<BaseMapservice setReady={() => this.setState({ serviceReady: true })} />
				</Services>
				<ErrorBoundary>
					<EventsAppBarContainer location={location} />
				</ErrorBoundary>
				<WavCam />
				<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="content-wrapper">
					<ErrorBoundary>
						<EventsListPanelContainer />
					</ErrorBoundary>

					<ErrorBoundary>
						<ShapePanelContainer />
					</ErrorBoundary>

					{servicesReady && (
						<ErrorBoundary>
							<EventViewContainer />
						</ErrorBoundary>
					)}
				</div>
			</div >
		) : (
			<div className="app-wrapper" />
		);
	}
}

export default App;
