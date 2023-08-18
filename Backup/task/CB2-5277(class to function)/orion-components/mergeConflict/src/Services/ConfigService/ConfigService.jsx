import React, { Fragment, useEffect } from "react";

const ConfigService = ({getClientConfig, setReady}) => {

	useEffect(() => {
	    getClientConfig(setReady);
	}, []);

	return <Fragment />;
};

export default ConfigService;