import * as t from "./actionTypes";
import * as actions from "./appActions";

describe("App Sync Actions", () => {
	it("Should create an action to set widget launch data", () => {
		const data = { entityId: "" };
		const expectedAction = {
			type: t.SET_WIDGET_LAUNCH_DATA,
			payload: data
		};

		expect(actions._setWidgetLaunchData(data)).toEqual(expectedAction);
	});
});
