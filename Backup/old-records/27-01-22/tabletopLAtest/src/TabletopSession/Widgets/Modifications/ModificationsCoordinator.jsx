import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";

const propTypes = {
	sessionId: PropTypes.string.isRequired,
	modificationsActive: PropTypes.bool.isRequired,
	modificationSubscription: PropTypes.object,
	subscribeModifications: PropTypes.func.isRequired,
	unsubscribeModifications: PropTypes.func.isRequired
};

const ModificationsCoordinator = ({ 
	sessionId,
	modificationsActive,
	modificationSubscription, 
	subscribeModifications,
	unsubscribeModifications 
}) => {
	useEffect(() => {
		if (modificationsActive && !modificationSubscription) {
			subscribeModifications(sessionId);
		}
	
		if (!modificationsActive && modificationSubscription) {
			unsubscribeModifications(modificationSubscription);
		}
	}, [ modificationsActive, modificationSubscription ]);

	return (
		<Fragment />
	);
};

ModificationsCoordinator.propTypes = propTypes;
export default ModificationsCoordinator;