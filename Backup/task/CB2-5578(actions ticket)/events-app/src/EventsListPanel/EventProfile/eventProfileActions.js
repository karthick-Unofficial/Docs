import { eventService } from "client-app-core";

export { updateListCheckbox, selectWidget } from "../../appActions";

export const deleteEvent = id => {
	return dispatch => {
		eventService.deleteEvent(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				console.log(response);
				dispatch(hideEventProfile());
				dispatch(closeSecondary());
			}
		});
	};
};