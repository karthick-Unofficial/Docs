import * as t from "./actionTypes";
import * as actions from "./floorPlanFormActions";

describe("FloorPlan Form Redux Actions", () => {
	it("Should create an action to add image", () => {
		const image = {};
		const expectedAction = {
			type: t.IMAGE_ADD,
			payload: { image }
		};

		expect(actions.addImage(image)).toEqual(expectedAction);
	});

	it("Should create an action to clear image", () => {
		const expectedAction = {
			type: t.CLEAR_IMAGE
		};

		expect(actions.clearImage()).toEqual(expectedAction);
	});

	it("Should create an action to remove floorPlan", () => {
		const floorPlanId = "";
		const expectedAction = {
			type: t.FLOOR_PLAN_REMOVE,
			payload: { floorPlanId }
		};

		expect(actions.removeFloorPlan(floorPlanId)).toEqual(expectedAction);
	});

	it("Should create an action to clear floorPlan", () => {
		const expectedAction = {
			type: t.FLOOR_PLAN_CLEAR
		};

		expect(actions.clearFloorPlan()).toEqual(expectedAction);
	});

	it("Should create an action to add floorPlan", () => {
		const floorPlan = {};
		const expectedAction = {
			type: t.FLOOR_PLAN_ADD,
			payload: { floorPlan }
		};

		expect(actions.addFloorPlan(floorPlan)).toEqual(expectedAction);
	});

	it("Should create an action to toggle create floorPlan", () => {
		const expectedAction = {
			type: t.CREATING_FLOORPLAN
		};

		expect(actions.toggleCreate()).toEqual(expectedAction);
	});
});
