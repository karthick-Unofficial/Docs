import * as t from "../actionTypes";
import * as actions from "./typeAheadFilterActions";

describe("Type Ahead Filter Sync Actions", () => {

	it("Should create an action to update the type ahead filter", () => {
		const expectedAction = {
			type: t.TYPEAHEAD_FILTER,
			textEntry: "Apple Banana"
		};
		expect(actions.typeAheadFilter("Apple Banana")).toEqual(expectedAction);
	});
});