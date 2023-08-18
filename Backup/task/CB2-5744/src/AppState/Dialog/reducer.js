const initialDialogState = {
	openDialog: null,
	dialogData: null
};

const dialog = (state = initialDialogState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "OPEN_DIALOG": {
			const { dialogRef, dialogData } = payload;
			return {
				...state,
				openDialog:
					state.openDialog === null ? dialogRef : state.openDialog,
				dialogData: dialogData
			};
		}

		case "CLOSE_DIALOG": {
			const { dialogRef } = payload;
			return {
				...state,
				openDialog:
					state.openDialog === dialogRef ? null : state.openDialog,
				dialogData: null
			};
		}

		default:
			return state;
	}
};

export default dialog;
