import { authService } from "client-app-core";

export function resetPassword (newPassword, token) {
	return (dispatch) => {
		authService.resetPassword(newPassword, token, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
}