import ModificationService from "../../../services/modificationService";
import * as actionTypes from "../../../actionTypes";
import { unsubscribe } from "orion-components/ContextualData/contextStreaming";
import { operationFailed } from "../../tabletopSessionActions";
import * as utilities from "../../../shared/utility/utilities";

// Modifications subscription
export const subscribeModifications = (sessionId) => {
	return dispatch => {
		ModificationService.subscribeModifications(sessionId, (err, response) => {
			if (err) {
				console.log(err);
				dispatch(operationFailed(err));
			}
			if (!response) {
				return;
			}
			switch (response.type) {
				case "initial":
				case "add":
					dispatch(modificationAdded(response.new_val));
					break;
				case "change":
					dispatch(modificationUpdated(response.new_val));
					break;
				case "remove":
					dispatch(modificationDeleted(response.old_val.id));
					break;
				default:
					break;
			}
		})
			.then(subscription => {
				dispatch(modificationsSubscribed(subscription));
			});
	};
};

const modificationsSubscribed = (subscription) => {
	return {
		type: actionTypes.MODIFICATIONS_SUBSCRIBED,
		subscription
	};
};

const modificationAdded = (modification) => {
	return {
		type: actionTypes.MODIFICATION_ADDED,
		modification
	};
};

const modificationUpdated = (modification) => {
	return {
		type: actionTypes.MODIFICATION_UPDATED,
		modification
	};
};

const modificationDeleted = (modificationId) => {
	return {
		type: actionTypes.MODIFICATION_DELETED,
		modificationId
	};
};

// Unsubscribe modifications
export const unsubscribeModifications = (subscription) => {
	return dispatch => {
		dispatch(unsubscribe(subscription.channel));
		dispatch(modificationsUnsubscribed());
	};
};

const modificationsUnsubscribed = () => {
	return {
		type: actionTypes.MODIFICATIONS_UNSUBSCRIBED
	};
};

// Enable modifications
export const enableModifications = (sessionId) => {
	return dispatch => {
		ModificationService.enableModifications(sessionId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modifications enabled");
			}
		});
	};
};

// Modification Timer Set
export const setModificationsData = (sessionId, modificationsData) => {
	return dispatch => {
		ModificationService.setModificationsData(sessionId, modificationsData, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modifications Timer enabled");
			}
		});
	};
};

// Cancel modifications
export const cancelModifications = (sessionId) => {
	return dispatch => {
		ModificationService.cancelModifications(sessionId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modifications cancelled");
			}
		});
	};
};

// Create modification
export const createModification = (sessionId, modification) => {
	return dispatch => {
		ModificationService.createModification(sessionId, modification, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modification creation successful");
			}
		});
	};
};

// Update modification
export const updateModification = (sessionId, modification) => {
	return dispatch => {
		ModificationService.updateModification(sessionId, modification, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modification update successful");
			}
		});
	};
};

// Submit modifications to controller
export const submitModificationsToController = (sessionId) => {
	return dispatch => {
		ModificationService.submitModificationsToController(sessionId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modifications submission to controller successful");
			}
		});
	};
};

// Submit modifications to Avert
export const submitModificationsToAvert = (sessionId, childSimName, simTime) => {
	return dispatch => {
		ModificationService.submitModificationsToAvert(sessionId, childSimName, simTime, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modifications submission to AVERT successful");
			}
		});
	};
};

// Approve modification
export const approveModification = (sessionId, modificationId) => {
	return dispatch => {
		ModificationService.approveModification(sessionId, modificationId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modification approval successful");
			}
		});
	};
};

// Reject modification
export const rejectModification = (sessionId, modificationId) => {
	return dispatch => {
		ModificationService.rejectModification(sessionId, modificationId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modification rejection successful");
			}
		});
	};
};

// Revert modification decision
export const revertModificationDecision = (sessionId, modificationId) => {
	return dispatch => {
		ModificationService.revertModificationDecision(sessionId, modificationId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Modification decision revert successful");
			}
		});
	};
};

// Set modification comment
export const setModificationComment = (sessionId, modificationId, comment) => {
	return dispatch => {
		ModificationService.setModificationComment(sessionId, modificationId, comment, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Set modification comment successful");
			}
		});
	};
};

// Delete modification
export const deleteModification = (sessionId, modificationId) => {
	return dispatch => {
		ModificationService.deleteModification(sessionId, modificationId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Delete modification successful");
			}
		});
	};
};

// Trigger create modification
export const triggerCreateModification = (modificationCommand, entity, location, conditionDef, resultDef) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: "modifyExercise",
				widgetData: {
					command: "triggerCreateModification",
					modificationCommand,
					entity,
					location,
					conditionDef,
					resultDef
				}
			}
		}
	};
};