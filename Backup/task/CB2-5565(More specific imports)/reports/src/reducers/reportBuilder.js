const requestDialog = (
	state = {
		isOpen: false,
		isSubmitting: false,
		error: null,
		toast: false
	},
	action
) => {
	switch (action.type) {
		case "OPEN_REQUEST_DIALOG":
			return Object.assign({}, state, {
				isOpen: true
			});

		case "CLOSE_REQUEST_DIALOG":
			return Object.assign({}, state, {
				isOpen: false,
				isSubmitting: false,
				toast: false,
				error: null
			});

		case "REQUEST_DIALOG_SUBMIT_SUCCESS":
			return Object.assign({}, state, {
				isSubmitting: false,
				error: null,
				toast: true
			});

		case "REQUEST_DIALOG_IS_SUBMITTING":
			return Object.assign({}, state, {
				isSubmitting: true,
				error: null
			});

		case "REQUEST_DIALOG_SUBMIT_ERROR":
			return Object.assign({}, state, {
				error: action.payload,
				isSubmitting: false
			});


		default:
			return state;
	}
};

const pdfRequestDialog = (
	state = {
		isOpen: false,
		isSubmitting: false,
		error: null,
		toast: false
	},
	action
) => {
	switch (action.type) {
		case "OPEN_PDF_REQUEST_DIALOG":
			return Object.assign({}, state, {
				isOpen: true
			});

		case "CLOSE_PDF_REQUEST_DIALOG":
			return Object.assign({}, state, {
				isOpen: false,
				isSubmitting: false,
				toast: false,
				error: null
			});

		case "PDF_REQUEST_DIALOG_SUBMIT_SUCCESS":
			return Object.assign({}, state, {
				isSubmitting: false,
				error: null,
				toast: true
			});

		case "PDF_REQUEST_DIALOG_IS_SUBMITTING":
			return Object.assign({}, state, {
				isSubmitting: true,
				error: null
			});

		case "PDF_REQUEST_DIALOG_SUBMIT_ERROR":
			return Object.assign({}, state, {
				error: action.payload,
				isSubmitting: false
			});


		default:
			return state;
	}
};

export const initialState = {
	fieldData: {},
	isSubmitting: false,
	error: null,
	requestDialog: {
		isOpen: false,
		isSubmitting: false,
		error: null,
		toast: false
	},
	pdfRequestDialog: {
		isOpen: false,
		isSubmitting: false,
		error: null,
		toast: false
	}
};

const reportBuilder = (state = initialState, action) => {
	switch (action.type) {
		case "FIELD_DATA_RECEIVED":
		{
			const data = {
				[action.payload.name]: action.payload.data
			};

			return {
				...state,
				fieldData: { ...state.fieldData,
					...data
				}
			};
		}
		case "WIPE_ALL_FIELD_DATA":
		{
			return {
				...state,
				fieldData: {}
			};
		}
		case "WIPE_FIELD_DATA":
		{
			return {
				...state,
				fieldData: { ...state.fieldData,
					[action.payload.name]: []
				}
			};
		}

		case "SUBMITTING_REPORT":
		{
			return {
				...state,
				isSubmitting: true,
				error: null
			};
		}

		case "REPORT_DATA_RECEIVED":
			return {
				...state,
				isSubmitting: false,
				error: null
			};

		case "BUILDER_ERROR":
			return {
				...state,
				error: action.error,
				isSubmitting: false
			};

		case "WIPE_REPORTS":
		{
			return {
				...state,
				isSubmitting: false,
				error: null
			};
		}

		case "OPEN_REQUEST_DIALOG":
		case "REQUEST_DIALOG_IS_SUBMITTING":
		case "REQUEST_DIALOG_SUBMIT_SUCCESS":
		case "REQUEST_DIALOG_SUBMIT_ERROR":
		case "CLOSE_REQUEST_DIALOG":
		{
			return {
				...state,
				requestDialog: requestDialog(state.requestDialog, action)
			};
		}

		case "OPEN_PDF_REQUEST_DIALOG":
		case "PDF_REQUEST_DIALOG_IS_SUBMITTING":
		case "PDF_REQUEST_DIALOG_SUBMIT_SUCCESS":
		case "PDF_REQUEST_DIALOG_SUBMIT_ERROR":
		case "CLOSE_PDF_REQUEST_DIALOG":
		{
			return {
				...state,
				pdfRequestDialog: pdfRequestDialog(state.pdfRequestDialog, action)
			};
		}

		default:
			return state;
	}
};

export default reportBuilder;