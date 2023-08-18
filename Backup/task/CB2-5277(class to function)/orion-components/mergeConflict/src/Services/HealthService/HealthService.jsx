import React, { Fragment, useEffect } from "react";

const HealthService = ({startHealthPolling}) => {

	useEffect(() => {
	    startHealthPolling();
	}, []);

	return <Fragment />;
};

export default HealthService;