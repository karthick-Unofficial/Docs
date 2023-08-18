import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const HealthService = () => {
	const dispatch = useDispatch();
	const { startHealthPolling } = actionCreators;

	useEffect(() => {
		dispatch(startHealthPolling());
	}, []);

	return <Fragment />;
};

export default HealthService;
