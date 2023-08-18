import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

export default function requireAuthentication(Component) {
	const Authenticate = (props) => {
		const { isAuthenticated } = props;
		const [mounted, setMounted] = useState(false);

		useEffect(() => {
			checkAuth(props);
		}, [props]);

		useEffect(() => {
			setMounted(true);
		}, []);

		// shouldComponentUpdate(nextProps) {
		// 	return true;
		// }

		const checkAuth = () => {
			if (!isAuthenticated) {
				window.location = "/login";
				// -- if we were using react-router could be something like this
				//let redirectAfterLogin = this.props.location.pathname
				//this.props.dispatch(pushState(null, `/auth-app/index.html?next=${redirectAfterLogin}`))
			}
		};

		if (!mounted) {
			checkAuth(props);
			setMounted(true);
		}

		const component = isAuthenticated ? <Component {...props} /> : <div></div>;

		return component;
	};

	const mapStateToProps = (state) => ({
		userName: state.session.identity.userId,
		isAuthenticated: state.session.identity.isAuthenticated
	});

	return connect(mapStateToProps)(Authenticate);
}
