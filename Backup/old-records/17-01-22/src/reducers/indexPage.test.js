import { typeAheadFilter } from "../TypeAheadFilter/typeAheadFilterActions";

import indexPage, {initialState as seedState} from "./indexPage.js";

describe("indexPage reducer", () => {

	it("Should initialize with expected initial state (empty object).", () => {
		expect(indexPage(undefined, seedState)).toEqual(seedState);
	});

	it("Should update the typeAheadFilter value correctly.", () => {
		const action = typeAheadFilter("Hello world.");
		const expectedState = {...seedState, typeAheadFilter: "Hello world."};
		expect(indexPage(seedState, action)).toEqual(expectedState);
	});
	
});