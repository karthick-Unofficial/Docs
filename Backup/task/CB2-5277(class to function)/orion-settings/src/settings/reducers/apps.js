const apps = (state = [], action) => {
	switch (action.type) {
		case "HYDRATE_ECOSYSTEM_SUCCESS":
		case "REFRESH_ECOSYSTEM_SUCCESS":
			return action.apps.map(app => {
				return app;
			});

		default:
			return state;
	}
};

export default apps;