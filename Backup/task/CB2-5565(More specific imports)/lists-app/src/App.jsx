import React, { useEffect } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";

// Components
import AppBar from "./AppBar/AppBar";
import ListPanel from "./ListPanel/ListPanel";
import ListView from "./ListView/ListView.jsx";
import { appendReducer } from "./index.js";
import { feedService } from "client-app-core";
import {
	dataByFeed,
	notifications,
	listCategories,
	listLookupData
} from "orion-components/GlobalData/Reducers";
import { WavCam } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import { hydrateUser } from "./appActions";
import {
	streamLists,
	streamListCategories,
	getAllListCategories,
	subscribeFeed,
	subscribeFeedPermissions
} from "./appActions";
import {
	getAppState,
	getGlobalAppState
} from "./appActions";

const App = ({ location }) => {
	
	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dispatch = useDispatch();

	useEffect(() => {
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
			dispatch(hydrateUser(userId)),
			dispatch(getAppState("lists-app")),
			dispatch(getGlobalAppState()),
			dispatch(subscribeFeedPermissions(userId))
		]).then(() => {
			dispatch(getAllListCategories());
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
							dispatch(subscribeFeed(feed.intId));
						}
					});
				}
			});
		});
	}, []);

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
				<AppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div className="content-wrapper" style={styles.wrapper}>
				<ErrorBoundary>
					<ListPanel />
				</ErrorBoundary>
				<ErrorBoundary>
					<ListView />
				</ErrorBoundary>
			</div>
		</div>
	) : (
		<div className="app-wrapper" />
	);
};


export default App;
