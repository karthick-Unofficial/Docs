import * as t from "./actionTypes";
import * as actions from "./lookupManagerActions";

describe("LookupManager Sync Actions", () => {
    it("Should fire an action to close manager", () => {
        const expectedAction = {
            type: t.CLOSE_MANAGER
        };
        expect(actions.closeManager()).toEqual(expectedAction);
    });

    it("Should fire an action to select manager", () => {
        const expectedAction = {
            type: t.SELECT_MANAGER,
            payload: { type: "" }
        };
        expect(actions.selectManager("")).toEqual(expectedAction);
    });
});