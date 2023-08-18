import * as t from "./actionTypes";
import * as actions from "./formPanelActions";

describe("FormPanel Sync Actions", () => {
    it("Should fire an action to close event form", () => {
        const expectedAction = {
            type: t.CLOSE_EVENT_FORM
        };
        expect(actions.closeEventForm()).toEqual(expectedAction);
    });
});