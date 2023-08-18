import React, { Fragment, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBar from "./AppBar/AppBar";
import { Canvas } from "orion-components/CBComponents";
import { Services } from "orion-components/Services";
import SearchForm from "./SearchForm/SearchForm";
import SearchResults from "./SearchResults/SearchResults";
import SearchPanel from "./SearchPanel/SearchPanel";
import { WavCam } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { hydrateUser } from "./appActions";
import { subscribeFeedPermissions } from "./appActions";
import {
	getGlobalAppState,
	getAppState
} from "./appActions";


const App = () => {
	const primaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.primaryOpen);
	const xOffset = primaryOpen ? 360 : 60;
	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		const { userId } = identity;
		dispatch(hydrateUser(userId));
		dispatch(subscribeFeedPermissions(userId));
		dispatch(getGlobalAppState());
		dispatch(getAppState("law-enforcement-search-app"));
	}, [getAppState, getGlobalAppState, hydrateUser, identity, subscribeFeedPermissions]);

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
			<Services />
			<ErrorBoundary>
				<AppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={styles.wrapper}>
				<SearchPanel />
				<Canvas xOffset={xOffset} dir={dir}>
					<SearchForm />
					<SearchResults />
				</Canvas>
			</div>
		</div>
	) : (
		<Fragment />
	);
};


export default memo(App);
