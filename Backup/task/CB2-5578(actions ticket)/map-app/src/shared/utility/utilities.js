export const appData = (entityType) => {
	let batchTypes = [];
	let isGlobal = true;

	switch (entityType) {
		case "camera":
		case "accessPoint":
		case "shape":
		case "shapes":
		case "track":
		case "facility":
			batchTypes = ["globalData", "globalGeo"];
			break;
		case "event":
			batchTypes = ["globalData"];
			break;
		default:
			isGlobal = false;
			console.log(`Batch type for ${entityType} not found`);
			break;
	}

	return { appSpecifics: batchTypes, isGlobal };
};