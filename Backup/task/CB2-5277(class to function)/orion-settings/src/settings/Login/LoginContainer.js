import React, { useEffect } from "react";
import { connect } from "react-redux";
import Login from "./Login";

import { routes as r } from "../routes.js";

const App = (props) => {
	const { dispatch, errorMessage, children } = props;
	
	useEffect(() => {
		checkAuth(props);
	}, [props]);

	const checkAuth = (props) => {
		if (props.isAuthenticated) {
			window.location = r.MY_ACCOUNT;
			// -- if we were using react-router could be something like this
			//let redirectAfterLogin = this.props.location.pathname
			//this.props.dispatch(pushState(null, `/auth-app/index.html?next=${redirectAfterLogin}`))
		}
	};
	return (
		<div className="login-app app">
			<Login
				errorMessage={errorMessage}
				dispatch={dispatch}
				children={children}
			/>
			<div className="container" />
		</div>
	);
};

function mapStateToProps(state) {
	const { identity } = state.session;
	const { isAuthenticated } = identity;
	const { errorMessage } = state.session.login.auth;

	return {
		isAuthenticated,
		errorMessage
	};
}
const LoginContainer = connect(mapStateToProps)(App);
export { LoginContainer };
