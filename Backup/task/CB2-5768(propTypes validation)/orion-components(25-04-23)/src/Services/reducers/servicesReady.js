const servicesReady = (state = false, action) => {
	const { type } = action;
	switch (type) {
		case "SERVICES_READY": {
			return true;
		}
		default:
			return state;
	}
};

export default servicesReady;
