import React from "react";
import { render } from "react-dom";
import "./index.css";

// redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import optimisticSwitchboard from "./middleware/optimisticSwitchboard.js";
import optimisticAppToggles from "./middleware/optimisticAppToggles.js";

// material ui
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

import customTheme from "./customTheme";
import { default as loginTheme } from "./Login/customTheme";
import theme from "orion-components/theme";

// router
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import metricsMiddleware from "browser-metrics/lib/reduxMetricsMiddleware";

// components
import App from "./App";
import UserAccount from "./UserAccount/UserAccount";
import ManageOrganization from "./Organization/ManageOrganization";
import ManageEcosystemContainer from "./Ecosystem/ManageEcosystem";
import EditUser from "./UserAccount/EditUser/EditUser";
import {
	EditOrgProfileContainer,
	EditActiveDirectoryContainer,
	ManageUserRolesContainer,
	ManageUsersContainer,
	SharingConnectionsContainer,
	ManageFeedSharingPoliciesContainer,
	FeedSharingPolicies
} from "./Organization/components";
import {
	EditEcosystemOrg
} from "./Ecosystem/components";

// login
import LoginContainer from "./Login/LoginContainer";
import LoginForm from "./Login/components/LoginForm";
import Forgot from "./Login/components/Forgot";
import Sent from "./Login/components/Sent";
import InvalidReset from "./Login/components/InvalidReset";
import Reset from "./Login/Reset/Reset";
import SetInitialPassword from "./Login/SetInitial/SetInitialPassword";

// authentication
import requireAuthentication from "orion-components/Authenticate";

// authorization
import { AuthorizeAdmin } from "./HOC/AuthorizeAdmin.js";
import { AuthorizeEcoAdmin } from "./HOC/AuthorizeEcoAdmin.js";

import Apm from "orion-components/Apm";

// import injectTapEventPlugin from "react-tap-event-plugin";
// injectTapEventPlugin();

//i18n
import I18n from "orion-components/i18n";
import { routes as r } from "./routes.js";
const AuthAppContainer = requireAuthentication(App);

const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(
			thunk,
			optimisticAlerts,
			optimisticSwitchboard,
			optimisticAppToggles,
			metricsMiddleware({
				trackTiming: (category, name, duration) => {
					// Display metric in a table for legibility
					// Uncomment to log in console
					// console.table([{['name']: name, ['duration']: duration}])
				},
				minDuration: 0
			})
		)
	)
);

window.redux = store;

// Check user profile to see if we should redirect

// const checkUserOnTransition = (nextState, replace) => {
// 	console.log(nextState.location.pathname);
// 	const id = store.getState().identity.userId;
// 	if (id === nextState.params.id && nextState.params.id !== "undefined") {
// 		replace("/my-profile" + (nextState.location.pathname.includes("/edit") ? "/edit" : "/"));
// 	}
// };

// Splitting out separate mui themes for settings and login
const MuiAuthAppContainer = props => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={createTheme(customTheme)}>
				<ThemeProvider theme={createTheme(theme)}>
					<AuthAppContainer {...props} />
				</ThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

const MuiLoginContainer = props => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={createTheme(loginTheme)}>
				<ThemeProvider theme={createTheme(theme)}>
					<LoginContainer {...props} />
				</ThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

// Profile and org components are written with stateless component syntax because otherwise we
// could not pass props into them with react-router

//change r.HOME to have no trailing slash and update routes (may fix)

const ManageOrg = AuthorizeAdmin(ManageOrganization);
const EditProfile = AuthorizeAdmin(EditOrgProfileContainer);
const EditActiveDirectory = AuthorizeAdmin(EditActiveDirectoryContainer);
const ManageUserRoles = AuthorizeAdmin(ManageUserRolesContainer);
const ManageUsers = AuthorizeAdmin(ManageUsersContainer);
const SharingConnections = AuthorizeAdmin(SharingConnectionsContainer);
const ManageFeedSharingPolicies = AuthorizeAdmin(ManageFeedSharingPoliciesContainer);
const FeedSharingPols = AuthorizeAdmin(FeedSharingPolicies);
const ManageEcosystem = AuthorizeEcoAdmin(ManageEcosystemContainer);
const EditEcoOrg = AuthorizeEcoAdmin(EditEcosystemOrg);

render(
	<Apm serviceName="settings-app-client">
		<Provider store={store}>
			<I18n appId="settings-app">
				<BrowserRouter>
					<ErrorBoundary>
						<Routes>
							{/*This nesting of routes requires authentication*/}
							{/*The /settings-app/ route is just a container, redirect to my-org from this route} */}
							<Route replace path="*" element={<Navigate from={r.SETTINGS} to={"/settings-app/my-account-settings"} />} />
							<Route path={r.SETTINGS} element={<MuiAuthAppContainer><Outlet /></MuiAuthAppContainer>}>
								<Route element={<UserAccount><Outlet /></UserAccount>} >
									<Route index path={r.MY_ACCOUNT} />
								</Route>
								<Route path={r.EDIT_MY_PROFILE} element={<EditUser />} />
								<Route path={r.MANAGE_ORGANIZATION} element={<ManageOrg />} />
								<Route path={`${r.MANAGE_ORGANIZATION}/:orgId`} element={<ManageOrg />} />
								<Route path={r.EDIT_MY_ORGANIZATION} element={<EditProfile />} />
								<Route path={r.ACTIVE_DIRECTORY} element={<EditActiveDirectory />} />
								<Route path={r.MANAGE_USER_ROLES} element={<ManageUserRoles />} />
								<Route path={r.MANAGE_USERS} element={<ManageUsers />} />
								<Route path={r.SHARING_CONNECTIONS} element={<SharingConnections />} />
								<Route path={r.MANAGE_FEED_SHARING_POLICIES} element={<ManageFeedSharingPolicies />} />
								<Route path={`${r.MANAGE_FEED_SHARING_POLICIES}/:intId`} element={<FeedSharingPols />} />
								<Route path={`${r.USER_BY_ID}`} element={<UserAccount />} />
								<Route path={`${r.EDIT_USER_BY_ID}`} element={<EditUser />} />
								<Route path={r.MANAGE_ECOSYSTEM} element={<ManageEcosystem />} />
								<Route path={`${r.MANAGE_ECOSYSTEM}/:orgId`} element={<EditEcoOrg />} />
							</Route>

							{/*These routes are not auth-protected*/}
							<Route path="/login" element={<MuiLoginContainer><Outlet /></MuiLoginContainer>}>
								{/* <IndexRoute component={LoginForm} /> */}
								<Route index element={<LoginForm />} />
								<Route path="forgot-password" element={<Forgot />} />
								<Route path="reset/:token" element={<Reset />} />
								<Route
									path="set-password/:token"
									element={<SetInitialPassword />}
								/>
								<Route path="invalid-reset" element={<InvalidReset />} />
								<Route path="sent" element={<Sent />} />
							</Route>
							{/* Redirect any non-specified routes back to my profile */}
							<Route replace element={<Navigate from="*" to={r.MY_ACCOUNT} />} />
							{/* <Redirect from="*" to={r.MY_ACCOUNT} /> */}
						</Routes>
					</ErrorBoundary>
				</BrowserRouter>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
