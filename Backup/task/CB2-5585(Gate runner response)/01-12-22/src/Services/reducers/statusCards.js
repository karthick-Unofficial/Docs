import arrayMove from "array-move";

const initialState = {
	initialReceived: false,
	orgsById: {},
	cards: [],
	searchValue: "",
	orgFilters: []
};

const statusCards = (state = initialState, action) => {
	const { payload, type } = action;

	switch (type) {
		// Initial batch
		case "INITIAL_STATUS_CARDS_RECEIVED": {

			const orgsById = {};
			payload.forEach((card) => {
				orgsById[card.ownerOrg] = card.ownerOrgName;
			});

			return {
				...state,
				initialReceived: true,
				orgsById: orgsById,
				cards: payload
			};
		}
		// Add or Change
		case "STATUS_CARD_UPDATE_RECEIVED": {
			const newState = [...state.cards];
			const newOrgState = { ...state.orgsById };
			const index = newState.findIndex((item) => item.id === payload.id);
			const orgId = payload.ownerOrg;

			if (index > -1) {
				newState[index] = payload;
			}
			else {
				newState.push(payload);
			}

			newOrgState[payload.ownerOrg] = payload.ownerOrgName;

			return {
				...state,
				cards: newState,
				orgsById: newOrgState
			};
		}
		// Sort
		case "STATUS_CARDS_SORTED": {
			const newState = [...state.cards];

			return {
				...state,
				cards: arrayMove(newState, payload.oldIndex, payload.newIndex)
			};
		}
		// Remove
		case "STATUS_CARD_REMOVED": {
			const newState = [...state.cards];
			const removedState = newState.filter((item) => item.id !== payload);

			const orgsById = {};
			removedState.forEach((card) => {
				orgsById[card.ownerOrg] = card.ownerOrgName;
			});

			return {
				...state,
				cards: newState.filter((item) => item.id !== payload),
				orgsById: orgsById
			};
		}
		case "SEARCH_UPDATED": {
			return {
				...state,
				searchValue: payload
			};
		}
		case "ORG_FILTERS_CHANGED": {
			return {
				...state,
				orgFilters: payload
			};
		}
		default:
			return state;
	}
};

export default statusCards;