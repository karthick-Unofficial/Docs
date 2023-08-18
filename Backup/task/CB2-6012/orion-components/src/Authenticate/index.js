import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { getIdentity } from "../Session/Identity/actions";

export default function requireAuthentication(Component) {
	const Authenticate = (props) => {
		const dispatch = useDispatch();

		const [mounted, setMounted] = useState(false);

		const isChecked = useSelector((state) => state.session.identity.isChecked);
		const isAuthenticated = useSelector((state) => state.session.identity.isAuthenticated);

		useEffect(() => {
			if (isChecked) checkAuth();
		}, [isChecked, isAuthenticated]);

		useEffect(() => {
			setMounted(true);
			dispatch(getIdentity());
		}, []);

		const checkAuth = () => {
			if (!isAuthenticated) {
				window.location = "/login";
			}
		};

		if (!mounted && isChecked) {
			checkAuth();
			setMounted(true);
		}

		const component = isAuthenticated ? <Component {...props} /> : <div></div>;

		return component;
	};

	const mapStateToProps = () => ({});

	return connect(mapStateToProps)(Authenticate);
}
