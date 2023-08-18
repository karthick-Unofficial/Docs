const initialState = {
	type: "person",
	person: {
		firstName: "",
		lastName: "",
		dOB: "",
		sex: "all",
		race: "all",
		keyword: ""
	},
	selected: null
};

const searchForm = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "SEARCH_FIELD_UPDATED": {
			const { field, value } = payload;
			const newFormState = { ...state[state.type] };
			newFormState[field] = value;
			return { ...state, [state.type]: newFormState };
		}
		case "SEARCH_FORM_RESET":
			return {
				...state,
				[state.type]: initialState[state.type],
				selected: null
			};
		case "SAVED_SEARCH_SELECTED": {
			const { id, type, values } = payload;
			const newFormState = { ...state[type], ...values };
			return {
				...state,
				selected: id,
				[type]: newFormState,
				type
			};
		}
		case "SAVED_SEARCH_CLEARED":
			return { ...state, selected: null };
		default:
			return state;
	}
};

export default searchForm;
