//
// Role-based authorization for protected routes. Curried such that can be used two ways:
//
// <Route component={Authorize(["eco-admin, org-admin"])(MyComponent)}
//
// or 
//
// const Admin = Authorize(["eco-admin, org-admin"])
// <Route component={Admin(MyComponent)}
//


import React from "react"; // <---- removed {Component} : called but never used
import { connect } from "react-redux";

import NotAuthorized from "../NotAuthorized";

export const Authorize = (allowedRoles) => (WrappedComponent) => {
	const WithAuthorization = (props) => {

		if (allowedRoles.includes(props.role)) {
			return <WrappedComponent {...props} />;
		}
		else {
			return <NotAuthorized />;
		}
	};

	const mapStateToProps = (state) => {
		return {
			role: state.session.user.profile.role
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};