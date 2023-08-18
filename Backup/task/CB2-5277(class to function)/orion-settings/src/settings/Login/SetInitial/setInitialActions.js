import { authService } from "client-app-core";

export function setInitialPassword (password, token) {
	return (dispatch) => {
		authService.setInitialPassword(password, token, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
}