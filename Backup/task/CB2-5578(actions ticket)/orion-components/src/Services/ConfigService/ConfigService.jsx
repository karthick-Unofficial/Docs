import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const ConfigService = ({ setReady }) => {
	const dispatch = useDispatch();
	const { getClientConfig } = actionCreators;
	
	useEffect(() => {
		dispatch(getClientConfig(setReady));
	}, []);

	return <Fragment />;
};

export default ConfigService;