export const appData = (entityType) => {
	let batchTypes = [];
	let isGlobal = false;

	switch (entityType) {
		case "camera":
			isGlobal = true;
			batchTypes = ["globalGeo", "globalData"];
			break;
			// These are all stored in fovItems 
		case "shape":
		case "shapes":
		case "track":
			isGlobal = false;
			break;
		default:
			console.log(`Batch type for ${entityType} not found`);
			break;
	}

	return {
		appSpecifics: isGlobal ? batchTypes : "cameras", 
		isGlobal
	};
};