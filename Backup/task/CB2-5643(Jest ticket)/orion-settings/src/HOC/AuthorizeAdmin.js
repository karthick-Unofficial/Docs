import React from "react";
import { connect } from "react-redux";

import NotAuthorized from "../shared/components/NotAuthorized";

export const AuthorizeAdmin = (WrappedComponent) => {
	const WithAuthorization = (props) => {

		if (props.admin) {
			return <WrappedComponent {...props} />;
		}
		else {
			return <NotAuthorized />;
		}
	};


	const mapStateToProps = (state) => {
		return {
			admin: state.session.user.profile.admin
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};