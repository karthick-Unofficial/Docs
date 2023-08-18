import * as t from "./actionTypes";

/**
 * Open a dialog via its reference, optionally passing data to it
 * @param {string} dialogRef -- string reference to dialog to open
 * @param {any} dialogData -- optional, additional data you'd like to pass to your dialog
 */
export const openDialog = (dialogRef, dialogData = null) => {
	return {
		type: t.OPEN_DIALOG,
		payload: { dialogRef, dialogData }
	};
};

/**
 * Close a dialog via its reference, and clear optional dialog data if it exists
 * @param {string} dialogRef -- string reference to dialog to close
 */
export const closeDialog = (dialogRef) => {
	return {
		type: t.CLOSE_DIALOG,
		payload: { dialogRef }
	};
};
