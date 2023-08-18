import * as t from "./actionTypes";

export const setMapOverlays = ({ overlays }) => {
    return {
        type: t.SET_MAP_OVERLAYS,
        payload: { overlays }
    };
};
