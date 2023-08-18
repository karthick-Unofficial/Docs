import * as t from "./actionTypes";
import { attachmentService, facilityService } from "client-app-core";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
export { setMapTools } from "orion-components/Map/Tools/Actions";
import { selectFloorPlan } from "../../ListPanel/FacilityProfile/facilityProfileActions";
export { selectFloorPlan } from "../../ListPanel/FacilityProfile/facilityProfileActions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";

export const addImage = (image) => {
	return {
		type: t.IMAGE_ADD,
		payload: { image }
	};
};

export const clearImage = () => {
	return {
		type: t.CLEAR_IMAGE
	};
};

export const removeFloorPlan = (floorPlanId) => {
	return {
		type: t.FLOOR_PLAN_REMOVE,
		payload: { floorPlanId }
	};
};

export const clearFloorPlan = () => {
	return {
		type: t.FLOOR_PLAN_CLEAR
	};
};

export const addFloorPlan = (floorPlan) => {
	return {
		type: t.FLOOR_PLAN_ADD,
		payload: { floorPlan }
	};
};

export const toggleCreate = () => {
	return {
		type: t.CREATING_FLOORPLAN
	};
};

export const saveFloorPlan = ({ name }) => {
	return (dispatch, getState) => {
		const { image, coordinates } = getState().floorPlan;
		const { entity } = selectedContextSelector(getState());
		attachmentService.uploadFiles(null, "floor-plan", [image], (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				const { success, attachmentId } = response.result;
				if (success) {
					const floorPlan = {
						name,
						attachmentId,
						geometry: {
							type: "Polygon",
							coordinates: [coordinates]
						}
					};
					facilityService.createFloorplan(entity.id, floorPlan, (err, response) => {
						if (err) {
							console.log("ERROR:", err);
						} else {
							const { success, result } = response;
							if (!success) {
								facilityService.deleteFloorPlanFile(entity.id, attachmentId, (err) => {
									if (err) {
										console.log("ERROR:", err);
									}
								});
							} else {
								dispatch(addFloorPlan(result));
								dispatch(selectFloorPlan(result));
							}
						}
					});
				}
			}
		});
	};
};

export const updateFloorPlan = ({ id, name }) => {
	return (dispatch, getState) => {
		const { image, coordinates } = getState().floorPlan;
		const { entity } = selectedContextSelector(getState());
		let attachmentId;
		if (typeof image !== "string") {
			attachmentService.uploadFiles(null, "floor-plan", [image], (err, response) => {
				if (err) {
					console.log("ERROR:", err);
				} else {
					const { success, result } = response.result;
					if (success) {
						attachmentId = result.generated_keys[0];
						const floorPlan = {
							name,
							attachmentId,
							geometry: {
								type: "Polygon",
								coordinates: [coordinates]
							}
						};
						facilityService.updateFloorplan(entity.id, id, floorPlan, (err, response) => {
							if (err) {
								console.log("ERROR:", err);
							} else {
								const { success, result } = response;
								if (!success) {
									facilityService.deleteFloorPlanFile(entity.id, attachmentId, (err) => {
										if (err) {
											console.log("ERROR:", err);
										}
									});
								} else {
									dispatch(addFloorPlan(result.changes[0].new_val));
									dispatch(clearFloorPlan());
									dispatch(selectFloorPlan(result.changes[0].new_val));
								}
							}
						});
					}
				}
			});
		} else {
			const floorPlan = {
				name,
				geometry: {
					type: "Polygon",
					coordinates: [coordinates]
				}
			};
			facilityService.updateFloorplan(entity.id, id, floorPlan, (err, response) => {
				if (err) {
					console.log("ERROR:", err);
				} else {
					const { success, result } = response;
					if (!success) {
						facilityService.deleteFloorPlanFile(entity.id, attachmentId, (err) => {
							if (err) {
								console.log("ERROR:", err);
							}
						});
					} else {
						dispatch(addFloorPlan(result.changes[0].new_val));
						dispatch(selectFloorPlan(result.changes[0].new_val));
					}
				}
			});
		}
	};
};

export const deleteFloorplan = (facilityId, floorPlanId) => {
	return (dispatch) => {
		facilityService.deleteFloorplan(facilityId, floorPlanId, (err) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				dispatch(removeFloorPlan(floorPlanId));
				dispatch(clearFloorPlan());
			}
		});
	};
};
