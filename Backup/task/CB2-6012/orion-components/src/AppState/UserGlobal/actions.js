import * as t from "./actionTypes";
import { userService } from "client-app-core";

const eventTemplates = (payload) => {
	return {
		type: t.GET_FAV_EVENT_TEMPLATE,
		payload: payload
	};
};

export const getFavEventTemplates = () => {
	return (dispatch) => {
		const app = "global";
		return new Promise((resolve) => {
			userService.getAppState(app, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(eventTemplates(result?.state));
					resolve();
				}
			});
		});
	};
};
