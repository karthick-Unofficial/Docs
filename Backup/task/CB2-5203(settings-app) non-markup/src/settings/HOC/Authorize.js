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
	class WithAuthorization extends React.Component {
		
		// === No useless constructors ===
		// constructor(props) {
		// 	super(props);
		// }

		render () {
			if (allowedRoles.includes(this.props.role)) {
				return <WrappedComponent {...this.props} />;
			}
			else {
				return <NotAuthorized />;
			}
		}
	}


	const mapStateToProps = (state) => {
		return {
			role: state.session.user.profile.role
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};