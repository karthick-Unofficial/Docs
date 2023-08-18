const initialState = {
    overlays: [] //initial overlays state
};

const mapOverlays = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case "SET_MAP_OVERLAYS": {
            const { overlays = null } = payload;
            return {
                overlays
            };
        }
        default:
            return state;
    }
};

export default mapOverlays;
