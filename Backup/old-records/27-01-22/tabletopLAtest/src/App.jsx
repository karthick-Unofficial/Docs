import React, { Fragment, useEffect, memo } from "react";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import ErrorBoundary from "../src/shared/components/ErrorBoundary";
import { Services } from "orion-components/Services";
import AppBarContainer from "./TabletopAppBar/TabletopAppBarContainer";
import { appendReducer, removeReducer } from "./index.js";
import TabletopSessionListContainer from "./TabletopSessionList/TabletopSessionListContainer";
import TabletopSessionContainer from "./TabletopSession/TabletopSessionContainer";
import sessionListReducer from "./reducers/sessionList";
import sessionReducer from "./reducers/session";
import ErrorDialogContainer from "./shared/components/ErrorDialog/ErrorDialogContainer";
import KeyboardShortCutKeysContainer from "./shared/KeyboardShortCutKeys/KeyboardShortCutKeysContainer";

const propTypes = {
	children: PropTypes.node,
	getGlobalAppState: PropTypes.func.isRequired,
	getAppState: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	location: PropTypes.object,
	subscribeFeedPermissions: PropTypes.func.isRequired,
	fetchUsers: PropTypes.func.isRequired
};

const defaultProps = {
	location: null
};

const App = ({
	children,
	getGlobalAppState,
	getAppState,
	hydrateUser,
	identity,
	isHydrated,
	subscribeFeedPermissions,
	location,
	fetchUsers
}) => {
	// Setup the appropriate reducer depending on the child component
	useEffect(() => {
		if (children.type === TabletopSessionListContainer) {
			removeReducer("tabletopSession");
			appendReducer("tabletopSessions", sessionListReducer);
		} else if (children.type === TabletopSessionContainer) {
			removeReducer("tabletopSessions");
			appendReducer("tabletopSession", sessionReducer);
		}
	}, [children.type]);

	useEffect(() => {
		const { userId } = identity;
		fetchUsers();
		hydrateUser(userId);
		subscribeFeedPermissions(userId);
		getAppState("tabletop-app");
		getGlobalAppState();
	}, [getGlobalAppState, hydrateUser, identity, subscribeFeedPermissions, fetchUsers]);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "block"
		}
	};
	return isHydrated ? (
		<div style={{ overflow: "hidden" }}>
			<Services />
			<ErrorDialogContainer />
			<ErrorBoundary  componentName="AppBarContainer">
				<AppBarContainer location={location} />
			</ErrorBoundary>
			<KeyboardShortCutKeysContainer/>
			<ToastContainer/>
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
