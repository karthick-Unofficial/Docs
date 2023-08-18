export const initialState = {
	typeAheadFilter: "",
	filterTriggerEnter: false,
	filterTriggerExit: false,
	filterTriggerCross: false,
	filterTriggerSystemHealth: false,
	filterTriggerLoiter: false,
	filterTriggerNewRequest: false,
	filterTriggerRequestApproval: false,
	filterTriggerBerthUpdates: false,
	filterTriggerArrivals: false,
	filterTriggerDepartures: false,
	filterTriggerSecurityViolations: false
};

const indexPage = (state = initialState, action) => {
	switch (action.type) {
		case "TYPEAHEAD_FILTER":
			return Object.assign({}, state, {
				typeAheadFilter: action.textEntry
			});

		case "FILTER_TRIGGER_TOGGLE": {
			const { payload } = action;

			return {
				...state,
				[`filterTrigger${payload.type}`]: !state[`filterTrigger${payload.type}`]
			};
		}

		default:
			return state;
	}
};

export default indexPage;