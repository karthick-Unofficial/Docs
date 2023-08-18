import * as t from "./actionTypes";
import { openEventForm } from "../../BerthToolbar/berthToolbarActions";
import { openManager } from "../../appActions";
import { selectManager } from "../../LookupManager/lookupManagerActions";
export {
	setNextDay,
	setPreviousDay
} from "../../DateControls/dateControlsActions";
export const loadFormData = data => {
	return {
		type: t.LOAD_FORM_DATA,
		payload: { data }
	};
};
export const editAssignment = ({ assignment }) => {
	return dispatch => {
		dispatch(openEventForm());
		dispatch(loadFormData(assignment));
	};
};

export const openBerthManager = () => {
	return dispatch => {
		dispatch(openManager());
		dispatch(selectManager("berths"));
	};
};
