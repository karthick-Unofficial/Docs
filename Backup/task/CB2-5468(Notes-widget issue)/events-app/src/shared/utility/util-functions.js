export const sortEventsChronologically = (eventsArr) => {
	return eventsArr.sort((a, b) => {
		if (a.startDate < b.startDate) {
			return 1;
		}
		if (a.startDate > b.startDate) {
			return -1;
		}
		return 0;
	});
};

export const appData = (entityType) => {
	let batchTypes = [];
	let isGlobal = false;

	switch (entityType) {
		case "event":
			isGlobal = true;
			batchTypes = ["globalData"];
			break;
		case "shape":
		case "shapes":
		case "track":
		case "facility":
		case "camera":
			// These are all stored in pinned items
			isGlobal = false;
			break;
		default:
			isGlobal = false;
			console.log(`Batch type for ${entityType} not found`);
			break;
	}

	return {
		appSpecifics: isGlobal ? batchTypes : "events",
		isGlobal
	};
};