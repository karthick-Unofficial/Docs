import moment from "moment-timezone";
import isEmpty from "lodash/isEmpty";

export const appData = (entityType) => {
	let batchTypes = [];
	let isGlobal = true;

	switch (entityType) {
		case "camera":
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
const findNextLowestTime = (timeTransactions, time) => {
	let previousCheck = time;
	let i;
	for (i in timeTransactions) {
		if (previousCheck !== -1 && time < i) {
			return previousCheck;
		} else {
			previousCheck = i;
		}
	}
	return previousCheck;
};

export const getInitialPlayBarData = (playBarValue, timeTransactions) => {
	if (playBarValue && !isEmpty(timeTransactions)) {
		let time = moment(playBarValue).toISOString();
		if (!timeTransactions[time]) {
			time = findNextLowestTime(timeTransactions, playBarValue);
		}
		return timeTransactions[time];
	} else {
		return {};
	}
};
