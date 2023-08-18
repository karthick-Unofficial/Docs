import user, { initialState as seedState } from "./user.js";

import * as actions from "../actions";


describe("user reducer", () => {

    																																																												it("should initialize with expected initial state", () => {
        																																																												expect(user(undefined, {})).toEqual(seedState);
	});

    																																																												it("Should handle hydrateUserSuccess", () => {
        																																																												const sampleUser = {
            																																																												"name": "Test man",
            																																																												"id": "789"
		};
        																																																												let action;
        																																																												let expectedState;

        																																																												action = actions.hydrateUserSuccess(sampleUser);
        																																																												expectedState = {
                																																																												...seedState, 
                																																																												profile: sampleUser,
                																																																												isHydrated: true};
        																																																												expect(user(seedState, action)).toEqual(expectedState);

	});

	// it('Should handle refreshUserSuccess', () => {
	//     const sampleUser = {
	//         "name": "Test man",
	//         "id": "456"
	//     }
	//     let action;
	//     let expectedState;

	//     action = actions.refreshUserSuccess(sampleUser);
	//     expectedState = {
	//             ...seedState, 
	//             profile: sampleUser};
	//     expect(user(seedState, action)).toEqual(expectedState);

	// })

});