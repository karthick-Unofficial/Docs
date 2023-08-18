import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBaseMapConfigurations } from "./actions";

const BaseMapsService = ({ setReady }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getBaseMapConfigurations(setReady));
	}, []);

	return <Fragment />;
};

export default BaseMapsService;
