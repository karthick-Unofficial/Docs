import React, { Fragment, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBar from "orion-components/AppBar/AppBar";
import { WavCam } from "orion-components/Dock";
import { appendReducer } from "./index.js";
import { Services } from "orion-components/Services";
import { notifications, events, gisData, exclusions, listLookupData } from "orion-components/GlobalData/Reducers";
import BaseMapService from "orion-components/Services/BaseMapService/BaseMapsService";
import floorPlans from "./reducers/floorPlans";
import ReplayTopBar from "./Replay/ReplayTopBar/ReplayTopBar";
import SettingsMenu from "./Replay/SettingsMenu/SettingsMenu";
import querystring from "querystring";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "./appActions";

const propTypes = {
	children: PropTypes.node
};

const App = ({ children }) => {
	const dispatch = useDispatch();

	const {
		setFeedPermissions,
		subscribeAppFeedPermissions,
		getGISServices,
		getAppState,
		getGlobalAppState,
		hydrateUser,
		setUserProfile
	} = actionCreators;
	const identity = useSelector((state) =>
		window.api ? { userId: "mock", email: "mock@mock.com", isAuthenticated: true } : state.session.identity
	);
	const isHydrated = useSelector((state) => (window.api ? true : state.session.user.isHydrated));
	const WavCamOpen = useSelector((state) => (window.api ? false : state.appState.dock.dockData.WavCam));

	const location = useLocation();
	// if loading in electron from file:// path derive querystring values differently
	// if (location && location.query && Object.keys(location.query).length === 0 && window.api) {
	// 	const q = querystring.parse(window.location.search.substr(1));
	// 	location.query = q;
	// }

	const loc = {};
	if (window.api) {
		// portable
		loc.query = querystring.parse(window.location.search.substr(1));
	} else {
		loc.query = querystring.parse(location.search.substr(1));
	}

	const globalFeeds = [
		{ notifications: notifications },
		{ events: events },
		{ gisData: gisData },
		{ exclusions: exclusions },
		{ floorPlans: floorPlans },
		{ listLookupData: listLookupData }
	];
	globalFeeds.forEach((globalFeed) => {
		const name = "globalData." + Object.keys(globalFeed)[0];
		const reducer = Object.values(globalFeed)[0];
		appendReducer(name, reducer);
	});

	useEffect(() => {
		if (window.api) {
			dispatch(setUserProfile(window.api.getState("profile")));
			dispatch(setFeedPermissions(window.api.getState("userFeeds")));
		} else {
			const { userId } = identity;
			dispatch(hydrateUser(userId));
			dispatch(subscribeAppFeedPermissions(userId, "map-app"));
			dispatch(getGlobalAppState());
			dispatch(getAppState("replay-app"));
			dispatch(getGISServices());
		}
	}, []);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "block",
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		}
	};

	return isHydrated ? (
		<div>
			<Services exclude={window.api ? ["health", "systemNotification", "applicationProfile"] : []}>
				<BaseMapService />
			</Services>
			<ErrorBoundary>
				{location && location.pathname && location.pathname !== "/replay" && !window.api ? (
					<Fragment>
						<AppBar titleText="Replay" />
						<WavCam />
					</Fragment>
				) : (
					<Fragment>
						<ReplayTopBar location={loc} />
						<SettingsMenu />
					</Fragment>
				)}
			</ErrorBoundary>
			<div style={styles.wrapper}>{children}</div>
		</div>
	) : (
		<Fragment />
	);
};

App.propTypes = propTypes;

export default memo(App);
