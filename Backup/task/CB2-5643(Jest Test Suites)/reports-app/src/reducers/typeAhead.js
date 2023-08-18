export const initialState = {
	typeAheadFilter: ""
};

const typeAhead = (state = initialState, action) => {
	switch (action.type) {
		case "TYPEAHEAD_FILTER":
			return Object.assign({}, state, {
				typeAheadFilter: action.textEntry
			});

		default:
			return state;
	}
};

export default typeAhead;
