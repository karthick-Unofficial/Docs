import * as actionTypes from "../actionTypes";

const initialState = {};

const facilitiesImport = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case actionTypes.IMPORT_FLOORPLAN_ADDED: {
			const { facilityId, floorPlanName } = payload;
			return { 
				...state, 
				[facilityId]: [...(state[facilityId] || []), floorPlanName]
			};
		}
		case actionTypes.IMPORT_FACILITIES_DONE:
			return initialState;
		case actionTypes.IMPORT_FACILITIES_ERROR:
			return {
				...state,
				error: payload.error
			};

		default:
			return state;
	}
};

export default facilitiesImport;
