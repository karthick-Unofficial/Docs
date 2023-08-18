import React, { Fragment, useEffect } from "react";

const BaseMapsService = ({ getBaseMapConfigurations, setReady }) => {

	useEffect(() => {
		getBaseMapConfigurations(setReady);
	}, []);

	return <Fragment />;
};

export default BaseMapsService;