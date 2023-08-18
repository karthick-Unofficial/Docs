import React, { Fragment, useEffect, memo } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBarContainer from "./AppBar/AppBarContainer";
import { Canvas } from "orion-components/CBComponents";
import { Services } from "orion-components/Services";
import { default as SearchForm } from "./SearchForm/SearchFormContainer";
import { default as SearchResults } from "./SearchResults/SearchResultsContainer";
import { default as SearchPanel } from "./SearchPanel/SearchPanelContainer";
import { WavCam } from "orion-components/Dock";
const propTypes = {
	getAppState: PropTypes.func.isRequired,
	getGlobalAppState: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	location: PropTypes.object,
	subscribeFeedPermissions: PropTypes.func.isRequired,
	xOffset: PropTypes.number.isRequired,
	WavCamOpen: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	location: null
};

const App = ({
	getAppState,
	getGlobalAppState,
	hydrateUser,
	identity,
	isHydrated,
	subscribeFeedPermissions,
	location,
	xOffset,
	WavCamOpen,
	dir
}) => {
	useEffect(() => {
		const { userId } = identity;
		hydrateUser(userId);
		subscribeFeedPermissions(userId);
		getGlobalAppState();
		getAppState("law-enforcement-search-app");
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
				<AppBarContainer location={location} />
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

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default memo(App);
