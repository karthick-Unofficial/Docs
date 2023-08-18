import identity, { initialState as seedState } from "./identity.js";

import * as actions from "../actions";


describe("identity reducer", () => {

    																																																												it("should initialize with expected initial state", () => {
        																																																												expect(identity(undefined, {})).toEqual(seedState);
	});

    																																																												it("Should handle identityInvalidated", () => {

        																																																												let action;
        																																																												let expectedState;

        																																																												action = actions.identityInvalidated();
        																																																												expectedState = {
                																																																												...seedState, 
                																																																												isAuthenticated: false,
                																																																												userId: null,
                																																																												email: null};
        																																																												expect(identity(seedState, action)).toEqual(expectedState);

	});

	// it('Should handle loginRequest', () => {

	//     let action;
	//     let expectedState;

	//     action = actions.requestLogin();
	//     expectedState = {
	//             ...seedState, 
	//             isFetching: true,
	//             isAuthenticated: false,
	//             errorMessage: ''
	//         };
	//     expect(identity(seedState, action)).toEqual(expectedState);

	// })

	// it('Should handle loginSuccess', () => {

	//     let action;
	//     let expectedState;

	//     action = actions.loginSuccess();
	//     expectedState = {
	//             ...seedState, 
	//             isFetching: false,
	//             isAuthenticated: true,
	//             errorMessage: ''
	//         };
	//     expect(identity(seedState, action)).toEqual(expectedState);

	// })

	// it('Should handle loginFailure', () => {
	//     const errorMessage = 'no good';

	//     let action;
	//     let expectedState;

	//     action = actions.loginFailure(errorMessage);
	//     expectedState = {
	//             ...seedState, 
	//             isFetching: false,
	//             isAuthenticated: false,
	//             errorMessage: errorMessage
	//         };
	//     expect(identity(seedState, action)).toEqual(expectedState);

	// })
});