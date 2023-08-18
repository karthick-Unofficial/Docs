import * as t from "./actionTypes";
import { openEventForm } from "../BerthToolbar/berthToolbarActions";
export const loadFormData = data => {
	return {
		type: t.LOAD_FORM_DATA,
		payload: { data }
	};
};
export const editAssignment = (assignment) => {
	return dispatch => {
		dispatch(openEventForm());
		dispatch(loadFormData(assignment));
	};
};