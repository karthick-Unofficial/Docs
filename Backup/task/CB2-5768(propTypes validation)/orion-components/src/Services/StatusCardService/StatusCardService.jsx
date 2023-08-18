import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const StatusCardService = () => {
	const dispatch = useDispatch();
	const { streamStatusCards } = actionCreators;

	const appId = useSelector((state) => state.application.appId);

	useEffect(() => {
		if (appId) {
			const globalOnly = appId !== "status-board-app";
			dispatch(streamStatusCards(globalOnly));
		}
	}, [appId]);

	return <Fragment />;
};

export default StatusCardService;
