import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./actions.js";

const SystemNotificationService = () => {
	const dispatch = useDispatch();
	const { subscribeToSystemNotifications } = actionCreators;

	const userId = useSelector((state) => state.session.user.profile.id);

	useEffect(() => {
		if (userId) {
			dispatch(subscribeToSystemNotifications(userId));
		}
	}, [userId]);

	return <Fragment />;
};

export default SystemNotificationService;
