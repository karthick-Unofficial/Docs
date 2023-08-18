import React from "react"; 
import { connect } from "react-redux";

import NotAuthorized from "../shared/components/NotAuthorized";

export const AuthorizeEcoAdmin = (WrappedComponent) => {
	class WithAuthorization extends React.Component {
		
		// === No useless constructors ===
		// constructor(props) {
		// 	super(props);
		// }

		render () {
			if (this.props.ecoAdmin) {
				return <WrappedComponent {...this.props} />;
			}
			else {
				return <NotAuthorized />;
			}
		}
	}


	const mapStateToProps = (state) => {
		return {
			ecoAdmin: state.session.user.profile.ecoAdmin
		};
	};


	return connect(mapStateToProps, null)(WithAuthorization);
};