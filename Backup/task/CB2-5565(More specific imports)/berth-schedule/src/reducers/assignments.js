import cloneDeep from "lodash/cloneDeep";
import moment from "moment";

const initialState = {
	allAssignments: {},
	dailyAssignments: {}
};

const assignments = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "BERTH_ASSIGNMENTS_RECEIVED": {
			const { data } = payload;
			const newState = cloneDeep(state);

			data.forEach(assignment => {
				// -- set all assignments
				newState.allAssignments[assignment.id] = assignment;

				// -- set daily assignments
				removeFromDays(newState.dailyAssignments, assignment.id);
				assignToDays(newState.dailyAssignments, assignment);
			});

			return newState;
		}
		case "BERTH_ASSIGNMENT_RECEIVED": {
			const { data } = payload;
			const newState = cloneDeep(state);

			// -- add/update all assignments
			newState.allAssignments[data.id] = data;

			// -- add/update daily assignments
			removeFromDays(newState.dailyAssignments, data.id);
			assignToDays(newState.dailyAssignments, data);

			return newState;
		}
		case "BERTH_ASSIGNMENT_REMOVED": {
			const { id } = payload;
			const newState = cloneDeep(state);

			// -- remove from all assignments
			delete newState.allAssignments[id];

			// -- remove from daily assignments
			removeFromDays(newState.dailyAssignments, id);

			return newState;
		}
		case "BERTH_ASSIGNMENT_UPDATED": {
			const { id, data } = payload;
			const newState = cloneDeep(state);

			// -- update all assignments
			newState.allAssignments[id] = data;

			// -- remove all instances of assignment in dailyAssignments and then re-add (due to possible changes in scheduled days)
			removeFromDays(newState.dailyAssignments, id);
			assignToDays(newState.dailyAssignments, data);

			return newState;
		}
		default:
			return state;
	}
};

const assignToDays = (dailyAssignments, newAssignment) => {
	const arrival = moment(newAssignment.schedule.ata || newAssignment.schedule.eta);
	const departure = moment(newAssignment.schedule.atd || newAssignment.schedule.etd);

	// -- loop through each day from arrival to departure and add the assignment 
	while (arrival.isSameOrBefore(departure, "day")) {
		// -- index assignments by date in "MM/DD/YYYY" format
		const arrivalFormat = arrival.format("MM/DD/YYYY");

		// -- add day index if not already present
		if (!dailyAssignments[arrivalFormat]) {
			dailyAssignments[arrivalFormat] = [];
		}

		// -- add/update assignment in daily index
		const index = dailyAssignments[arrivalFormat].indexOf(newAssignment.id);
		if (index === -1) {
			dailyAssignments[arrivalFormat].push(newAssignment.id);
		}

		// -- increment day
		arrival.add(1, "days");
	}

	return dailyAssignments;
};

const removeFromDays = (dailyAssignments, assignmentId) => {
	// -- loop through each day and remove assignment by id
	Object.keys(dailyAssignments).forEach(key => {
		const index = dailyAssignments[key].indexOf(assignmentId);
		if (index > -1) {
			dailyAssignments[key].splice(index, 1);
		}
	});
};

export default assignments;
