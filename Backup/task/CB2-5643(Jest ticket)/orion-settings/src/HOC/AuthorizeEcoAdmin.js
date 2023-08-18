import React from "react";
import { connect } from "react-redux";

import NotAuthorized from "../shared/components/NotAuthorized";

export const AuthorizeEcoAdmin = (WrappedComponent) => {
	const WithAuthorization = (props) => {

		if (props.ecoAdmin) {
			return <WrappedComponent {...props} />;
		}
		else {
			return <NotAuthorized />;
		}
	};


	const mapStateToProps = (state) => {
		return {
			ecoAdmin: state.session.user.profile.ecoAdmin
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};