import * as t from "./actionTypes";
import * as actions from "./appActions";

describe("App Sync Actions", () => {
	it("Should fire an action to set widget launch data", () => {
		const expectedAction = {
			type: t.SET_WIDGET_LAUNCH_DATA,
			payload: { widgetLaunchData: {} }
		};
		expect(actions._setWidgetLaunchData({ widgetLaunchData: {} })).toEqual(expectedAction);
	});
});
