import React from "react"; 
import { connect } from "react-redux";

import NotAuthorized from "../shared/components/NotAuthorized";

export const AuthorizeAdmin = (WrappedComponent) => {
	class WithAuthorization extends React.Component {
		
		// === No useless constructors ===
		// constructor(props) {
		// 	super(props);
		// }

		render () {
			if (this.props.admin) {
				return <WrappedComponent {...this.props} />;
			}
			else {
				return <NotAuthorized />;
			}
		}
	}


	const mapStateToProps = (state) => {
		return {
			admin: state.session.user.profile.admin
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};