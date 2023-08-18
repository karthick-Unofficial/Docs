import React, { Fragment, useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import ReplayAppBarContainer from "./ReplayAppBar/ReplayAppBarContainer";
import { WavCam } from "orion-components/Dock";
import { appendReducer } from "./index.js";
import { Services } from "orion-components/Services";
import {
	notifications,
	dataByFeed,
	events,
	gisData,
	exclusions,
	listLookupData
} from "orion-components/GlobalData/Reducers";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import floorPlans from "./reducers/floorPlans";
import ReplayTopBarContainer from "./Replay/ReplayTopBar/ReplayTopBarContainer";
import SettingsMenuContainer from "./Replay/SettingsMenu/SettingsMenuContainer";
import querystring from "querystring";

const propTypes = {
	children: PropTypes.node,
	getGlobalAppState: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	setUserProfile: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	location: PropTypes.object,
	subscribeAppFeedPermissions: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool,
	getAppState: PropTypes.func.isRequired
};

const defaultProps = {
	location: null
};

const App = ({
	children,
	getGlobalAppState,
	hydrateUser,
	setUserProfile,
	identity,
	isHydrated,
	subscribeAppFeedPermissions,
	setFeedPermissions,
	location,
	WavCamOpen,
	getAppState
}) => {
	const [service, setService] = useState(false);
	// if loading in electron from file:// path derive querystring values differently
	if (location && Object.keys(location.query).length === 0 && window.api) {
		const q = querystring.parse(window.location.search.substr(1));
		location.query = q;
	}

	useEffect(() => {
		if (window.api) {
			setUserProfile(window.api.getState("profile"));
			setFeedPermissions(window.api.getState("userFeeds"));
		}
		else {
			const { userId } = identity;
			const globalFeeds = [
				{ notifications: notifications },
				{ events: events },
				{ gisData: gisData },
				{ exclusions: exclusions },
				{ floorPlans: floorPlans },
				{ listLookupData: listLookupData }
			];
			globalFeeds.forEach(globalFeed => {
				const name = "globalData." + Object.keys(globalFeed)[0];
				const reducer = Object.values(globalFeed)[0];
				appendReducer(name, reducer);
			});
			hydrateUser(userId);
			subscribeAppFeedPermissions(userId, "map-app");
			getGlobalAppState();
			getAppState("replay-app");
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
			<Services>
				<BaseMapservice setReady={() => setService(true)} />
			</Services>
			<ErrorBoundary>
				{location && location.pathname && location.pathname !== "/replay" && !window.api ? (
					<Fragment>
						<ReplayAppBarContainer location={location} />
						<WavCam />
					</Fragment>
				) : (
					<Fragment>
						<ReplayTopBarContainer location={location} />
						<SettingsMenuContainer />
					</Fragment>
				)}
			</ErrorBoundary>
			<div style={styles.wrapper}>
				{children}
			</div>
		</div>
	) : (
		<Fragment />
	);
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default memo(App);
