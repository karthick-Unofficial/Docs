import { FETCH_USERS_SUCCESS, REFRESH_USERS_SUCCESS } from "../actionTypes";

const users = (state = {}, action) => {
	const { type, payload } = action;
	switch (type) {
		case FETCH_USERS_SUCCESS:
		case REFRESH_USERS_SUCCESS:
		{
			const usersObj = state;
			payload.users.forEach(usr => {
				usersObj[usr.id] = usr;
			});
			return usersObj;
		}
		default:
			return state;
	}
};

export default users;
