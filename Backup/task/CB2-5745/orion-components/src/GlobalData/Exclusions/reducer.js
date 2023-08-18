import cloneDeep from "lodash/cloneDeep";

const initialExclusionState = {};

const exclusions = (state = initialExclusionState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "EXCLUSION_RECEIVED": {
			const { exclusion } = payload;
			const userId = exclusion.userId;

			const newState = cloneDeep(state);

			if (!newState[userId]) {
				newState[userId] = [exclusion];
			} else {
				const newExclusions = newState[userId].filter(
					(exc) => exc.entityId !== exclusion.entityId
				);
				newExclusions.push(exclusion);
				newState[userId] = newExclusions;
			}

			return newState;
		}

		case "EXCLUSION_REMOVED": {
			const { exclusion } = payload;
			const userId = exclusion.userId;

			const hasMultiple = !!(state[userId] && state[userId].length > 1);
			const newState = { ...state };

			if (!hasMultiple) {
				delete newState[userId];
			} else {
				newState[userId] = newState[userId].filter(
					(item) => item.id !== exclusion.id
				);
			}

			return newState;
		}

		default:
			return state;
	}
};

export default exclusions;
