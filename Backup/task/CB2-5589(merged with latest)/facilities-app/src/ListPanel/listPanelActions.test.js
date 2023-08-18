import * as t from "../actionTypes";
import * as actions from "./listPanelActions";

describe("List Panel Redux Actions", () => {
	it("Should create an action to set preloaded", () => {
		const expectedAction = {
			type: t.SET_PRELOADED
		};

		expect(actions.setPreLoaded()).toEqual(expectedAction);
	});
});
