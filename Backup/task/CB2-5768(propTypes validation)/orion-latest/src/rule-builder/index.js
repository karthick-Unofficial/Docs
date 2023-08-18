import trackMovement from "./track-movement-builder.js";
import systemHealth from "./system-health-builder.js";
import vesselEvent from "./vessel-event.js";
import alarm from "./alarm.js";
import createEvent from "./create-event";

const builder = (rule, collections, targetAction, hasLinks) => {
	switch (rule.type) {
		case "track-movement":
			return trackMovement(rule, collections, targetAction, hasLinks);

		case "system-health":
			return systemHealth(rule, collections, targetAction, hasLinks);

		case "vessel-event":
			return vesselEvent(rule, collections);

		case "alarm":
			return alarm(rule, collections);

		case "create-event":
			return createEvent(rule, collections);

		default:
			return "";
	}
};

export default builder;
