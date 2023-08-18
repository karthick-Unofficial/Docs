import * as t from "./actionTypes";
import * as actions from "./facilityProfileActions";

describe("Facility Profile Redux Actions", () => {
	it("Should create an action to select floorPlan", () => {
		const floorPlan = {};
		const expectedAction = {
			type: t.FLOOR_PLAN_SELECT,
			payload: { floorPlan }
		};

		expect(actions.selectFloorPlan(floorPlan)).toEqual(expectedAction);
	});

	it("Should create an action to set floorPlans", () => {
		const floorPlans = {};
		const expectedAction = {
			type: t.FLOOR_PLANS_SET,
			payload: { floorPlans }
		};

		expect(actions.setFloorPlans(floorPlans)).toEqual(expectedAction);
	});
});
