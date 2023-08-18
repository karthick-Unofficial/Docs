import { spotlightService } from "client-app-core";
import { openDialog } from "orion-components/AppState/Actions";
export { hydrateUser } from "orion-components/Session/Actions";
export {
	getAppState,
	toggleMapVisible,
	getGlobalAppState
} from "orion-components/AppState/Actions";
export {
	subscribeFeed,
	subscribeCollections,
	getAllEvents,
	subscribeFeedPermissions,
	subscribeAppFeedPermissions,
	getGISServices,
	getEventTypes,
	subscribeExclusions,
	runQueue
} from "orion-components/GlobalData/Actions";


export const checkActiveSpotlights = () => {
	return dispatch => {
		spotlightService.getAllActive((err, result) => {
			if (err) {
				console.log(err);
			}
			else {
				if (result.spotlights.length) {
					dispatch(openDialog("resumeSpotlightDialog", {activeSpotlights: result.spotlights}));
				}
			}
		});
	};
};

