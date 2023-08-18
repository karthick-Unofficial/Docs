import React from "react";
import {connect} from "react-redux";

export default function requireAuthentication(Component) {

    																																																												class Authenticate extends React.Component {

        																																																												componentWillMount() {
            																																																												this.checkAuth(this.props);
		}

        																																																												componentWillReceiveProps(nextProps) {
            																																																												this.checkAuth(nextProps);
		}

		// shouldComponentUpdate(nextProps) {
		// 	return true;
		// }

        																																																												checkAuth(props) {
            																																																												if (!props.isAuthenticated) {
                																																																												window.location = "/login";
				// -- if we were using react-router could be something like this
				//let redirectAfterLogin = this.props.location.pathname
				//this.props.dispatch(pushState(null, `/auth-app/index.html?next=${redirectAfterLogin}`))
			}
		}

        																																																												render() {
            																																																												const component = this.props.isAuthenticated ?
				<Component {...this.props}/>
				:
				(<div>
				</div>);


            																																																												return component;
    
		}
	}

	const mapStateToProps = (state) => ({
    																																																																																																																							userName: state.session.identity.userId,
    																																																																																																																							isAuthenticated: state.session.identity.isAuthenticated
	});

	return connect(mapStateToProps)(Authenticate);
}