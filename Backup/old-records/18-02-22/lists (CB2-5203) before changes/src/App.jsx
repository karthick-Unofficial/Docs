import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";

// Components
import AppBarContainer from "./AppBar/AppBarContainer";
import ListPanelContainer from "./ListPanel/ListPanelContainer";
import ListViewContainer from "./ListView/ListViewContainer";
import { appendReducer } from "./index.js";
import { feedService } from "client-app-core";
import {
	dataByFeed,
	notifications,
	listCategories,
	listLookupData
} from "orion-components/GlobalData/Reducers";
import { WavCam } from "orion-components/Dock";

class App extends Component {
	componentDidMount() {
		const {
			hydrateUser,
			identity,
			getAppState,
			getGlobalAppState,
			subscribeFeedPermissions
		} = this.props;
		const { userId } = identity;
		const feeds = [
			{
				notifications: notifications
			},
			{
				listCategories: listCategories
			},
			{
				listLookupData: listLookupData
			}
		];
		feeds.forEach(feed => {
			appendReducer("globalData." + Object.keys(feed)[0], Object.values(feed)[0]);
		});
		Promise.all([
			hydrateUser(userId),
			getAppState("lists-app"),
			getGlobalAppState(),
			subscribeFeedPermissions(userId)
		]).then(() => {
			this.props.getAllListCategories();
			feedService.getUserAppIntegration(userId, "lists-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.config.canView) {
							const geoName = "globalGeo." + feed.intId;
							const dataName = "globalData." + feed.intId;
							const geoReducer = dataByFeed(feed.intId, "globalGeo");
							const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(geoName, geoReducer);
							appendReducer(dataName, dataReducer);
							this.props.subscribeFeed(feed.intId);
						}
					});
				}
			});
		});
	}

	render() {
		const { location, isHydrated, WavCamOpen} = this.props;

		const styles = {
			wrapper: {
				position: "relative",
				width: "100%",
				display: "block",
				height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}`
			}
		};

		return isHydrated ? (
			<div className="app-wrapper" style={{ overflow: "hidden" }}>
				<Services />
				<ErrorBoundary>
					<AppBarContainer location={location} />
				</ErrorBoundary>
				<WavCam />
				<div className="content-wrapper" style={styles.wrapper}>
					<ErrorBoundary>
						<ListPanelContainer />
					</ErrorBoundary>
					<ErrorBoundary>
						<ListViewContainer />
					</ErrorBoundary>
				</div>
			</div>
		) : (
			<div className="app-wrapper" />
		);
	}
}

export default App;
