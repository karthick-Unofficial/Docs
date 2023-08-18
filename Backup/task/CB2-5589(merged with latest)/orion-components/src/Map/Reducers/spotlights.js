const initialState = {
	blue: null,
	green: null,
	yellow: null
};

const spotlights = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "SPOTLIGHT_SET": {
			const { spotlight } = payload;
			let newState;
			Object.keys(state).forEach((key) => {
				if (newState) {
					return;
				}
				if (state[key] && state[key].id === spotlight.id) {
					newState = { ...state, [key]: spotlight };
				}
				if (!state[key]) {
					const strokeColor = key === "blue" ? "#0084BA" : key === "green" ? "#3AB55A" : "#EEA648";
					newState = {
						...state,
						[key]: {
							...spotlight,
							properties: { strokeColor, key }
						}
					};
				}
			});
			return newState || state;
		}
		case "SPOTLIGHT_RESTART": {
			const { spotlight } = payload;
			return {
				...state,
				[spotlight.properties.key]: spotlight
			};
		}
		case "SPOTLIGHT_REMOVE": {
			const { id } = payload;
			const newSpotlights = { ...state };
			const target = Object.values(state).find((s) => s && s.id === id);
			if (target) {
				newSpotlights[target.properties.key] = null;
			}
			return newSpotlights;
		}
		default:
			return state;
	}
};

export default spotlights;
