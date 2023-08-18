import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const StatusCardService = () => {
	const dispatch = useDispatch();
	const { streamStatusCards } = actionCreators;

	const userId = useSelector(state => state.session.user.profile.id);

	useEffect(() => {
		if (userId) {
			dispatch(streamStatusCards(userId));
		}
	}, [userId]);

	return <Fragment />;
};

export default StatusCardService;