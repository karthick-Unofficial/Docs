import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login";
import {
	loginUser,
	requestReset,
	resetError
} from "./loginActions";

import { routes as r } from "../routes.js";
import { useSelector, useDispatch } from "react-redux";

const LoginContainer = ({ children }) => {
	const dispatch = useDispatch();

	const identity = useSelector(state => state.session.identity);
	const { isAuthenticated } = identity;
	const errorMessage = useSelector(state => state.session.login.auth.errorMessage);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = () => {
		console.log("#login", isAuthenticated);
		if (isAuthenticated) {
			window.location = r.MY_ACCOUNT;
		}
	};

	return (
		<div className="login-app app">
			<Login
				errorMessage={errorMessage}
				dispatch={dispatch}
				children={children}
			>
				<Outlet
					context={{
						dispatch: dispatch,
						children: children,
						errorMessage: errorMessage,
						onLoginClick: creds => dispatch(loginUser(creds)),
						onForgotClick: (username, navigate) => dispatch(requestReset(username, navigate)),
						resetError: () => dispatch(resetError())
					}}>
				</Outlet>
			</Login>
			<div className="container" />
		</div>
	);
};

export default LoginContainer;