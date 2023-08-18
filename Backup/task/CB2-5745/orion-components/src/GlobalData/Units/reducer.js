const initialUnitState = {};

const units = (state = initialUnitState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "UNIT_RECEIVED": {
			const { unit } = payload;
			return {
				...state,
				[unit.id]: unit
			};
		}

		case "UNIT_REMOVED": {
			const { unitId } = payload;
			const newState = { ...state };

			delete newState[unitId];

			return newState;
		}

		default:
			return state;
	}
};

export default units;
