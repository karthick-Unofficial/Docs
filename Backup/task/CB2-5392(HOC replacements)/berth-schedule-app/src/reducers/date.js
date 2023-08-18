import moment from "moment";
const initialState = new Date();

const date = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "SET_NEXT_DAY": {
			return moment(state)
				.add(1, "d")
				.toDate();
		}
		case "SET_PREVIOUS_DAY": {
			return moment(state)
				.subtract(1, "d")
				.toDate();
		}
		case "SET_TODAY": {
			return new Date();
		}
		case "SET_DAY": {
			const { date } = payload;
			return date.toDate();
		}
		default:
			return state;
	}
};

export default date;
