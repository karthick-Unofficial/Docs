import * as t from "../actionTypes";
import * as actions from "./rulesAppBarActions";

describe("Rules App Bar Sync Actions", () => {

	it("Should create an action to toggle the AppMenu.", () => {
		const expectedAction = {
			type: t.TOGGLE_APPS_MENU
		};
		expect(actions.toggleAppsMenu()).toEqual(expectedAction);
	});
});