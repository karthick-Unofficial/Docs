import { fetchHealthSystemsSuccess } from "../appActions";

import healthSystems from "./healthSystems.js";

const seedState = { items: [], itemsById: {} };

describe("healthSystems reducer", () => {

	it("Should initialize with expected initial state.", () => {
		expect(healthSystems(undefined, {})).toEqual(seedState);
	});

	it("Should assign its payload as an array of ids and object of objects by id.", () => {
		const action = fetchHealthSystemsSuccess([{ id: "123" }]);
		const expectedState = { ...seedState, items: ["123"], itemsById: { "123": { id: "123" } } };
		expect(healthSystems(seedState, action)).toEqual(expectedState);
	});

});