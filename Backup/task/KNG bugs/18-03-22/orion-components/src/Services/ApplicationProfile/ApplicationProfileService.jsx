import React, { Fragment, useEffect } from "react";

const ApplicationProfileService = ({getApplicationProfile, setReady}) => {

	useEffect(() => {
	    getApplicationProfile(setReady);
	}, []);

	return <Fragment />;
};

export default ApplicationProfileService;