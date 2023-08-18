const eventClassifications = [
	{
		classification: "barrierBreach",
		description: "Barrier Breach",
		teams: [ "BLUE", "RED" ],
		traces: true
	},
	{
		classification: "detection",
		description: "Detection",
		teams: [ "BLUE", "RED" ],
		traces: true
	},
	{
		classification: "detectionComms",
		description: "Detection (Comms)",
		teams: [ "BLUE", "RED" ],
		traces: true
	},
	{
		classification: "neutralization",
		description: "Neutralization",
		teams: [ "BLUE", "RED" ],
		traces: false
	},
	{
		classification: "weaponFire",
		description: "Weapon Fire",
		teams: [ "BLUE", "RED" ],
		traces: true
	},
	{
		classification: "targetDestroyed",
		description: "Target Destroyed",
		teams: [ "RED" ],
		traces: true
	}
];

export const getEventClassifications = () => {
	return eventClassifications;
};

export const createDefaultObject = (defaultValue, forTraces = false) => {
	const defaultObject = {};
	eventClassifications.forEach(eventClassification => {
		eventClassification.teams.forEach(team => {
			if (!defaultObject[team]) {
				defaultObject[team] = {};
			}
			if (!forTraces || eventClassification.traces) {
				defaultObject[team][eventClassification.classification] = defaultValue;
			}
		});
	});
	return defaultObject;
};