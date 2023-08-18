import { appData } from "../shared/utility/utilities";
import { authExclusionService, cameraService } from "client-app-core";
import { dataReceived } from "orion-components/GlobalData/Actions";
import { eventReceived } from "orion-components/GlobalData/Events/actions";

import { closeSecondary } from "orion-components/ContextPanel/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";
import { subscriptionDataBatchReceived } from "orion-components/ContextualData/contextStreaming";

export {
	openPrimary,
	closePrimary,
	clearMapFilters,
	loadProfile,
	viewPrevious
} from "orion-components/ContextPanel/Actions";

export { setMapOffset } from "orion-components/AppState/Actions";

export const closeProfile = () => {
	return (dispatch) => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};

/**
 * Remove entities from exclusion table and allow updates
 * In addition, re-add these entities directly into state via specific batch types
 * @param {array} entityIds
 */
export const unignoreEntities = (entityIds) => {
	return (dispatch, getState) => {
		const state = getState();
		authExclusionService.unignoreEntities(entityIds, (err, res) => {
			if (err) {
				console.log("Error removing entities from ignore list", err);
			} else {
				if (res.entities) {
					const { entities } = res;

					entities.forEach((ent) => {
						const entityType = ent.entityType;
						const appDataObj = appData(entityType);
						// Batch the entity is a part of
						appDataObj.appSpecifics.forEach((batch) => {
							// Events do not have a feedId
							if (entityType === "event") {
								dispatch(eventReceived(ent));
							} else {
								dispatch(
									dataReceived(
										ent,
										ent.feedId || "events",
										batch
									)
								);
								if (
									entityType === "camera" &&
									ent.entityData &&
									ent.entityData.displayType === "facility"
								) {
									const floorPlan =
										state.globalData &&
										state.globalData.floorPlans
											? state.globalData.floorPlans[
													ent.entityData
														.displayTargetId
											  ]
											: null;
									if (floorPlan) {
										dispatch(
											subscriptionDataBatchReceived(
												floorPlan.facilityId,
												[ent],
												"floorPlanCameras"
											)
										);
									}
								}
							}
						});
					});
				}
			}
		});
	};
};

export const updateCamera = (cameraId, camera) => {
	return (dispatch) => {
		cameraService.update(cameraId, camera, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};
