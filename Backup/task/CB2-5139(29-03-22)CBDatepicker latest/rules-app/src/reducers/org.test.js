import { fetchOrgUsersSuccess } from "../appActions";

import org from "./org.js";

const seedState = { orgUsers: null };

describe("org reducer", () => {

	it("Should initialize with expected initial state.", () => {
		expect(org(undefined, {})).toEqual(seedState);
	});

	it("Should update the orgUsers state with a payload.", () => {
		const action = fetchOrgUsersSuccess([{}]);
		const expectedState = {...seedState, orgUsers: [{}]};
		expect(org(seedState, action)).toEqual(expectedState);
	});

});