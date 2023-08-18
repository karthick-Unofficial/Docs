import * as t from "./actionTypes";
import * as actions from "./dateControlsActions";

describe("DateControls Sync Actions", () => {
    it("Should fire an action to set next day", () => {
        const expectedAction = {
            type: t.SET_NEXT_DAY
        };
        expect(actions.setNextDay()).toEqual(expectedAction);
    });

    it("Should fire an action to set previous day", () => {
        const expectedAction = {
            type: t.SET_PREVIOUS_DAY
        };
        expect(actions.setPreviousDay()).toEqual(expectedAction);
    });

    it("Should fire an action to set today", () => {
        const expectedAction = {
            type: t.SET_TODAY
        };
        expect(actions.setToday()).toEqual(expectedAction);
    });

    it("Should fire an action to set day", () => {
        const expectedAction = {
            type: t.SET_DAY,
            payload: { date: "" }
        };
        expect(actions.setDay("")).toEqual(expectedAction);
    });
});