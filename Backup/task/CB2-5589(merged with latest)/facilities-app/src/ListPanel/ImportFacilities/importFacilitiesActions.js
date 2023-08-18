import { facilityService, attachmentService } from "client-app-core";
import * as actionTypes from "../../actionTypes";

export const createFacility = (facility) => {
	return (dispatch) => {
		facilityService.create(facility, (err) => {
			if (err) {
				dispatch(errorOccurred(err));
			}
		});
	};
};

export const createFloorPlan = (facilityId, floorPlan, file) => {
	return (dispatch) => {
		attachmentService.uploadFiles(null, "floor-plan", [file], (err, response) => {
			if (err) {
				dispatch(errorOccurred(err));
			} else {
				const { success, result } = response.result;
				if (success) {
					const attachmentId = result.generated_keys[0];
					floorPlan.attachmentId = attachmentId;
					facilityService.createFloorplan(facilityId, floorPlan, (err, response) => {
						if (err) {
							dispatch(errorOccurred(err));
						} else {
							const { success } = response;
							if (!success) {
								facilityService.deleteFloorPlanFile(facilityId, attachmentId, (err) => {
									if (err) {
										console.log("ERROR:", err);
									}
								});
								dispatch(errorOccurred("Creation of floor plan failed"));
							} else {
								dispatch(floorPlanAdded(facilityId, floorPlan.name));
							}
						}
					});
				}
			}
		});
	};
};

export const facilitiesImportDone = () => {
	return {
		type: actionTypes.IMPORT_FACILITIES_DONE
	};
};

const floorPlanAdded = (facilityId, floorPlanName) => {
	return {
		type: actionTypes.IMPORT_FLOORPLAN_ADDED,
		payload: {
			facilityId,
			floorPlanName
		}
	};
};

const errorOccurred = (error) => {
	return {
		type: actionTypes.IMPORT_FACILITIES_ERROR,
		payload: {
			error
		}
	};
};
