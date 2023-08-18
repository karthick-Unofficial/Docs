import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const ApplicationProfileService = ({ setReady }) => {
	const dispatch = useDispatch();
	const { getApplicationProfile } = actionCreators;

	useEffect(() => {
		dispatch(getApplicationProfile(setReady));
	}, []);

	return <Fragment />;
};

export default ApplicationProfileService;