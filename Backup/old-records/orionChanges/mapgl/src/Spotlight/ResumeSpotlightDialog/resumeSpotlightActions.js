import { spotlightService } from "client-app-core";
export { closeDialog } from "orion-components/AppState/Actions";
export { restartSpotlight } from "orion-components/Map/Tools/Actions";
/**
 * Delete user's currently active spotlight sessions if user chooses not to resume
 * after the window was closed, or a crash occurred, during an active spotlight session
 */
export const deleteSpotlightSessions = (deletionIds) => {
	return (dispatch, getState) => {
		deletionIds.forEach(id => {
			spotlightService.delete(id, (err, res) => {
				if (err) {
					console.log("Error deleting spotlight", err);
				}
			});
		});
	};
};
