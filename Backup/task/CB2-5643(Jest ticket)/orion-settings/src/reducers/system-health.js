export const initialState = {
	healthSystems: [],
	healthSystemsByID: {}
};

// -- Performs a deep copy. Useful for copying an array of objects.
const copy = item => {
	let output, v, key;
	output = item.constructor === Array ? [] : {};
	for (key in item) {
		v = item[key];
		output[key] = (typeof v === "object") ? copy(v) : v;
	}
	return output;
};

const containsGroup = (item, groupList) => {
	let resultingIndex = null;
	groupList.forEach((obj, index) => {
		if (obj.group.toString() === item.group.toString()) {
			resultingIndex = index ;
		}
	});

	return resultingIndex;
};

const containsSystem = (item, systemList) => {
	let resultingIndex = null;
	systemList.forEach((obj, index) => {
		if (obj.id.toString() === item.id.toString()) {
			resultingIndex = index ;
		}
	});

	return resultingIndex;
};

const containsCheck = (check, checkList) => {
	let resultingIndex = null;
	checkList.forEach((obj, index) => {
		if (obj.name === check.name) {
			resultingIndex = index ;
		}
	});

	return resultingIndex;
};

const systemHealth = (state = initialState, action) => {
	switch (action.type) {
		case "HEALTH_DATA_RECEIVED": {
			const healthSystems = copy(state.healthSystems);
			const groupIndex = containsGroup(action.healthData, healthSystems);
			const checkIndexes = [];

			// -- Check to see if this is a new group or if it's in healthSystems already
			if (groupIndex > -1 && groupIndex !== null) {
				healthSystems[groupIndex].lastUpdated = action.healthData.lastUpdated;

				// -- If it does exist then we need to see if the checks already exist and need to be updated, or if we can just push them on
				const systemIndex = containsSystem(action.healthData, healthSystems[groupIndex].systems);
				if (systemIndex > -1 && systemIndex !== null) {
					action.healthData.checks.forEach((check) => {
						const checkIndex = containsCheck(check, healthSystems[groupIndex].systems[systemIndex].checks);
						if (checkIndex > -1 && checkIndex !== null) {
							checkIndexes.push({index: checkIndex, check: check});
						} else	
							healthSystems[groupIndex].systems[systemIndex].checks.push(check);
					});
					
					// -- If checks already exist, update them with new data
					if (checkIndexes.length > 0) {
						checkIndexes.forEach(checkIndex => {
							healthSystems[groupIndex].systems[systemIndex].checks[checkIndex.index] = checkIndex.check; 
						});
					}
				} else	
					healthSystems[groupIndex].systems.push(action.healthData);

			} else {
				healthSystems.push(
					{ 
						group: action.healthData.group, 
						systems: [action.healthData], 
						lastUpdated: action.healthData.lastUpdated 
					}
				);
			}

			return Object.assign({}, ...state, { healthSystems: healthSystems });
		}

		default:
			return state;

	}
};

export default systemHealth;
