const initialState = {
	open: false,
	editing: false,
	data: {
		agent: {
			name: { firstName: "", lastName: "" },
			email: "",
			company: "",
			phone: ""
		},
		requestedBy: {
			company: "",
			name: { firstName: "", lastName: "" },
			email: "",
			phone: ""
		},
		vessel: {
			name: "",
			mmsid: "",
			imo: "",
			loa: 0,
			type: "",
			grt: 0,
			draft: 0
		},
		barges: [],
		cargo: [],
		schedule: {
			eta: null,
			etd: null,
			ata: null,
			atd: null
		},
		berth: {
			id: "",
			footmark: ""
		},
		approved: false,
		primaryActivity: {
			id: ""
		}
	},
	isGeneratingPdf: false,
	exportingError: null
};

const formPanel = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "OPEN_EVENT_FORM": {
			return {
				...state,
				open: true
			};
		}
		case "CLOSE_EVENT_FORM":
			return initialState;
		case "LOAD_FORM_DATA": {
			const { data } = payload;
			return {
				...state,
				data,
				editing: true
			};
		}
		case "TOGGLE_GENERATING_PDF": {
			return {
				...state,
				isGeneratingPdf: !state.isGeneratingPdf,
				exportingError: null
			};
		}
		case "EXPORT_ERROR": {
			return {
				...state,
				exportingError: action.error
			};
		}
		default:
			return state;
	}
};

export default formPanel;
