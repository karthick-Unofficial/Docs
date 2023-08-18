import React, { Fragment, useEffect } from "react";

const SystemNotificationService = ({ userId, subscribeToSystemNotifications }) => {

	useEffect(() => {
		if (userId) {
			subscribeToSystemNotifications(userId);
		}
	}, [userId]);

	return <Fragment />;
};

export default SystemNotificationService;