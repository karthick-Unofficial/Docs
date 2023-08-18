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
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import customTheme from "./customTheme";
import { default as loginTheme } from "./Login/customTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";

// router
import {
	Router,
	Route,
	Redirect,
	IndexRedirect,
	IndexRoute,
	browserHistory
} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import metricsMiddleware from "browser-metrics/lib/reduxMetricsMiddleware";

// components
import AppContainer from "./AppContainer";
import UserAccountContainer from "./UserAccount/UserAccountContainer";
import ManageOrganizationContainer from "./Organization/ManageOrganizationContainer";
import ManageEcosystemContainer from "./Ecosystem/ManageEcosystemContainter";
import EditUserContainer from "./UserAccount/EditUser/EditUserContainer";
import { 
	EditOrgProfileContainer,
	EditActiveDirectoryContainer,
	ManageUserRolesContainer,
	ManageUsersContainer,
	SharingConnectionsContainer,
	ManageFeedSharingPoliciesContainer,
	FeedSharingPoliciesContainer 
} from "./Organization/components";
import {
	EditEcosystemOrgContainer
} from "./Ecosystem/components";

// login
import { LoginContainer } from "./Login/LoginContainer";
import LoginForm from "./Login/components/LoginForm";
import Forgot from "./Login/components/Forgot";
import Sent from "./Login/components/Sent";
import InvalidReset from "./Login/components/InvalidReset";
import ResetContainer from "./Login/Reset/ResetContainer";
import SetInitialContainer from "./Login/SetInitial/SetInitialContainer";

// authentication
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(AppContainer);

// authorization
import { AuthorizeAdmin } from "./HOC/AuthorizeAdmin.js";
import { AuthorizeEcoAdmin } from "./HOC/AuthorizeEcoAdmin.js";

import Apm from "orion-components/Apm";

// import injectTapEventPlugin from "react-tap-event-plugin";
// injectTapEventPlugin();

//i18n
import I18nContainer from "orion-components/i18n/I18nContainer";

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

export const history = syncHistoryWithStore(browserHistory, store);
import { routes as r } from "./routes.js";

// Check user profile to see if we should redirect

// const checkUserOnTransition = (nextState, replace) => {
// 	console.log(nextState.location.pathname);
// 	const id = store.getState().identity.userId;
// 	if (id === nextState.params.id && nextState.params.id !== "undefined") {
// 		replace("/my-profile" + (nextState.location.pathname.includes("/edit") ? "/edit" : "/"));
// 	}
// };

// Splitting out separate mui themes for settings and login
const muiAuthAppContainer = props => {
	return (
		<LegacyMuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
			<MuiThemeProvider theme={createMuiTheme(theme)}>
				<AuthAppContainer {...props} />
			</MuiThemeProvider>
		</LegacyMuiThemeProvider>
	);
};

const muiLoginContainer = props => {
	return (
		<LegacyMuiThemeProvider muiTheme={getMuiTheme(loginTheme)}>
			<MuiThemeProvider theme={createMuiTheme(theme)}>
				<LoginContainer {...props} />
			</MuiThemeProvider>
		</LegacyMuiThemeProvider>
	);
};

// Profile and org components are written with stateless component syntax because otherwise we
// could not pass props into them with react-router

//change r.HOME to have no trailing slash and update routes (may fix)

render(
	<Apm serviceName="settings-app-client">
		<I18nContainer store={store} appId="settings-app"/>
		<Provider store={store}>
			<Router history={history}>
				{/*This nesting of routes requires authentication*/}
				<ErrorBoundary>
					{/*The /settings-app/ route is just a container, redirect to my-org from this route} */}
					<Redirect exact from={r.SETTINGS} to="/settings-app/my-organization" />
					<Route path={r.SETTINGS} component={muiAuthAppContainer}>
						<ErrorBoundary>
							<Route  component={UserAccountContainer} >
								<Route path={r.MY_ACCOUNT} />
							</Route>
							<Route path={r.EDIT_MY_PROFILE} component={EditUserContainer} />
						</ErrorBoundary>
						<ErrorBoundary>
							<Route path={r.MANAGE_ORGANIZATION} component={AuthorizeAdmin(ManageOrganizationContainer)} />
							<Route path={`${r.MANAGE_ORGANIZATION}/:orgId`} component={AuthorizeAdmin(ManageOrganizationContainer)} />
							<Route path={r.EDIT_MY_ORGANIZATION} component={AuthorizeAdmin(EditOrgProfileContainer)} />
							<Route path={r.ACTIVE_DIRECTORY} component={AuthorizeAdmin(EditActiveDirectoryContainer)} />
							<Route path={r.MANAGE_USER_ROLES} component={AuthorizeAdmin(ManageUserRolesContainer)} />
							<Route path={r.MANAGE_USERS} component={AuthorizeAdmin(ManageUsersContainer)} />
							<Route path={r.SHARING_CONNECTIONS} component={AuthorizeAdmin(SharingConnectionsContainer)} />
							<Route path={r.MANAGE_FEED_SHARING_POLICIES} component={AuthorizeAdmin(ManageFeedSharingPoliciesContainer)} />
							<Route path={`${r.MANAGE_FEED_SHARING_POLICIES}/:intId`} component={AuthorizeAdmin(FeedSharingPoliciesContainer)} />
							<Route path={`${r.USER_BY_ID}`} component={UserAccountContainer} />
							<Route path={`${r.EDIT_USER_BY_ID}`} component={EditUserContainer} />
						</ErrorBoundary>
						<ErrorBoundary>
							<Route path={r.MANAGE_ECOSYSTEM} component={AuthorizeEcoAdmin(ManageEcosystemContainer)} />
							<Route path={`${r.MANAGE_ECOSYSTEM}/:orgId`} component={AuthorizeEcoAdmin(EditEcosystemOrgContainer)} />
						</ErrorBoundary>
					</Route>
				</ErrorBoundary>

				{/*These routes are not auth-protected*/}
				<ErrorBoundary>
					<Route path="/login" component={muiLoginContainer}>
						<IndexRoute component={LoginForm} />
						<Route path="forgot-password" component={Forgot} />
						<ErrorBoundary>
							<Route path="reset/(:token)" component={ResetContainer} />
						</ErrorBoundary>
						<ErrorBoundary>
							<Route
								path="set-password/(:token)"
								component={SetInitialContainer}
							/>
						</ErrorBoundary>
						<Route path="invalid-reset" component={InvalidReset} />
						<Route path="sent" component={Sent} />
					</Route>
				</ErrorBoundary>

				{/* Redirect any non-specified routes back to my profile */}
				<Redirect from="*" to={r.MY_ACCOUNT} />
			</Router>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
