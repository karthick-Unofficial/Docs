
const integrations = (state = [], action) => {
	switch (action.type) {
		case "HYDRATE_ECOSYSTEM_SUCCESS":
		case "REFRESH_ECOSYSTEM_SUCCESS":
			return action.integrations.map(int => {
				return int;
			});
		default:
			return state;
	}
};

export default integrations;