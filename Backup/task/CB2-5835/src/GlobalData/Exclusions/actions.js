import * as t from "./actionTypes";
import { authExclusionService } from "client-app-core";

/**
 * Add an excluded entity to state
 * @param {object} exclusion
 */
const exclusionReceived = (exclusion) => {
	return {
		type: t.EXCLUSION_RECEIVED,
		payload: { exclusion }
	};
};

/**
 * Remove an excluded entity from state
 * @param {string} exclusionId
 */
const exclusionRemoved = (exclusion) => {
	return {
		type: t.EXCLUSION_REMOVED,
		payload: { exclusion }
	};
};

/**
 * Subscribe to entities a user has chosen to exclude from their application
 */
export const subscribeExclusions = () => {
	return (dispatch) => {
		authExclusionService.subscribeExclusions((err, res) => {
			if (err) {
				console.log("Error subscribing exclusions:", err);
			}
			switch (res.type) {
				case "initial":
				case "add":
				case "change": {
					const exclusion = res.new_val;
					dispatch(exclusionReceived(exclusion));
					break;
				}
				case "remove": {
					const exclusion = res.old_val;
					dispatch(exclusionRemoved(exclusion));
					break;
				}
				default:
					break;
			}
		});
	};
};
