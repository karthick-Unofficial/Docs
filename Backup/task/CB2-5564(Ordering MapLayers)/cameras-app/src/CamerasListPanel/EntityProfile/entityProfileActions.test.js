import * as t from "../../actionTypes.js";
import * as actions from "./entityProfileActions";

describe("EntityProfile Sync Actions", () => {
    it("Should fire an action to update viewing history", () => {
        const expectedAction = {
            type: t.UPDATE_VIEWING_HISTORY,
            payload: {
                id: "",
                name: "",
                type: "",
                item: {}
            }
        };
        expect(actions.updateViewingHistory({ id: "", name: "", type: "", item: {} })).toEqual(expectedAction);
    });

    it("Should fire an action on camera in range video stream received", () => {
        const expectedAction = {
            type: t.CAMERA_IN_RANGE_VIDEO_STREAM_RECEIVED,
            payload: {
                cameraId: "",
                stream: ""
            }
        };
        expect(actions.cameraInRangeVideoReceived("", "")).toEqual(expectedAction);
    });

    it("Should fire an action on camera in range subscription received", () => {
        const expectedAction = {
            type: t.CAMERA_IN_RANGE_SUBSCRIPTION_RECEIVED,
            payload: {
                sub: {}
            }
        };
        expect(actions.cameraInRangeStreamReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on cameras in range received", () => {
        const expectedAction = {
            type: t.CAMERAS_IN_RANGE_RECEIVED,
            payload: []
        };
        expect(actions.camerasInRangeReceived([])).toEqual(expectedAction);
    });

    it("Should fire an action on cameras in range removed", () => {
        const expectedAction = {
            type: t.CAMERAS_IN_RANGE_REMOVED,
            payload: []
        };
        expect(actions.camerasInRangeRemoved([])).toEqual(expectedAction);
    });

    it("Should fire an action to set cameras in range subscription", () => {
        const expectedAction = {
            type: t.SET_CAMERAS_IN_RANGE_SUBSCRIPTION,
            payload: []
        };
        expect(actions.setCamerasInRangeSubscription([])).toEqual(expectedAction);
    });
});