import React, { Fragment, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";

import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBar from "./AppBar/AppBar";
import SortableGrid from "./SortableGrid/SortableGrid";
import CardSearchField from "./SearchField/CardSearchField";
import ListPanel from "./ListPanel/ListPanel";
import { Services } from "orion-components/Services";
import { WavCam } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import {
	hydrateUser,
	subscribeFeedPermissions,
	getGlobalAppState, 
	getAppState,
	streamStatusCards
} from "./appActions";


const App = () => {

	const dispatch = useDispatch();

	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const location = useLocation();

	useEffect(() => {
		const { userId } = identity;
		dispatch(hydrateUser(userId));
		dispatch(subscribeFeedPermissions(userId));
		dispatch(getGlobalAppState());
		dispatch(streamStatusCards());
		dispatch(getAppState("status-board-app"));
	}, [getGlobalAppState, hydrateUser, identity, subscribeFeedPermissions, streamStatusCards, getAppState]);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "block",
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		}
	};

	return isHydrated ? (
		<div style={{ overflow: "hidden" }}>
			<ErrorBoundary>
				<Services />
			</ErrorBoundary>
			<ErrorBoundary>
				<AppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={styles.wrapper} key={"wrapper-container"}>
				<ListPanel />
				<CardSearchField key={"card-search"} />
				<SortableGrid />
			</div>
		</div>
	) : (
		<Fragment />
	);
};

export default memo(App);
