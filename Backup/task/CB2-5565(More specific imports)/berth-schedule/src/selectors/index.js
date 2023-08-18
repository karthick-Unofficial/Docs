import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import unionBy from "lodash/unionBy";
import isEqual from "react-fast-compare";
import moment from "moment";

const berthGroups = state => state.berthGroups;
const orderedGroups = state => state.appState.persisted.orderedGroups;
const allAssignments = state => state.assignments.allAssignments;
const dailyAssignments = state => state.assignments.dailyAssignments;
const berths = state => state.berths;
const date = state => state.date;

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

export const orderedGroupSelector = createSelector(
	berthGroups,
	orderedGroups,
	(groups, ordered) => {
		let data = [];
		if (ordered) {
			data = unionBy([...ordered, ...groups], "id");
		} else if (!ordered) {
			data = groups.map((group, index) => {
				return {
					...group,
					order: index
				};
			});
		}
		return data;
	}
);

export const getPending = createSelector(
	allAssignments,
	assignments => {
		return Object.values(assignments).filter(assignment => !assignment.approved);
		// return Object.values(assignments).filter(assignment => !assignment.approved);
	}
);

export const getScheduledPending = createSelector(
	allAssignments,
	dailyAssignments,
	berths,
	date,
	(allAssignments, dailyAssignments, berths, date) => {
		let offset = 0;

		const startDate = moment(date).subtract(2, "days");
		const endDate = moment(date).add(6, "days");
		let totalFiltered = [];

		// -- loop through visible days
		while (startDate.isSameOrBefore(endDate)) {
			// -- get list of ids from dailyAssignments
			const currentAssignmentIds = dailyAssignments[moment(startDate).format("MM/DD/YYYY")];
			if (currentAssignmentIds && currentAssignmentIds.length > 0) {
				// -- grab full assignment objects if present on current day
				const currentAssignments = currentAssignmentIds.map(id => allAssignments[id]);
				const filtered = currentAssignments.filter(assignment => {
					return !assignment.approved &&
						assignment.schedule.eta &&
						assignment.schedule.etd;
				});

				// -- add new assignments and make sure we don't get duplicates
				totalFiltered = unionBy(filtered, totalFiltered, "id");
			}
			startDate.add(1, "days");
		}

		// -- handle offset math
		totalFiltered = totalFiltered
			.map((current, index) => {
				const prev = totalFiltered[index - 1];
				if (prev && current.schedule.eta < prev.schedule.etd) {
					current.offset = prev.offset + 1;
					if (!offset) {
						offset++;
					} else if (current.offset > offset) {
						offset = current.offset;
					}
					return current;
				} else {
					current.offset = 0;
					return current;
				}
			});
		return { assignments: totalFiltered, offset };
	}
);

const getGroupId = (state, props) => {
	return props.groupId;
};

export const getBerthsByGroup = createDeepEqualSelector(
	getGroupId,
	berths,
	(groupId, berths) => {
		const filtered = berths.filter(berth => berth.berthGroupId === groupId);
		return filtered;
	}
);

export const getApprovedAssignments = createSelector(
	allAssignments,
	assignments => {
		return Object.values(assignments).filter(
			assignment =>
				assignment.schedule.eta &&
				assignment.schedule.etd &&
				assignment.approved
		);
	}
);

export const getTimelineAssignmentsByBerth = createDeepEqualSelector(
	allAssignments,
	dailyAssignments,
	getBerthsByGroup,
	date,
	(allAssignments, dailyAssignments, berths, date) => {
		const startDate = moment(date).subtract(2, "days");
		const endDate = moment(date).add(6, "days");
		let totalFiltered = [];

		// -- loop through visible days
		while (startDate.isSameOrBefore(endDate)) {
			// -- get list of ids from dailyAssignments
			const currentAssignmentIds = dailyAssignments[moment(startDate).format("MM/DD/YYYY")];
			if (currentAssignmentIds && currentAssignmentIds.length > 0) {
				// -- grab full assignment objects if present on current day
				const currentAssignments = currentAssignmentIds.map(id => allAssignments[id]);
				const filtered = currentAssignments.filter(assignment => {
					return assignment.approved &&
						assignment.schedule.eta &&
						assignment.schedule.etd &&
						berths.map(berth => berth.id).includes(assignment.berth.id);
				});

				totalFiltered = unionBy(filtered, totalFiltered, "id");
			}
			startDate.add(1, "days");
		}
		return totalFiltered;
	}
);

export const getDailyAgendaAssignments = createSelector(
	getApprovedAssignments,
	date,
	(assignments, date) => {
		const now = moment();
		const dailyAssignments = [];
		assignments.forEach(assignment => {
			// -- handle arrivals
			let relevantTime = null;
			let action = null;
			let overdue = false;
			if (assignment.schedule.ata) {
				if (moment(assignment.schedule.ata).isSame(date, "day")) {
					relevantTime = assignment.schedule.ata;
					action = "arrived";
				}
			}
			else {
				if (moment(assignment.schedule.eta).isSameOrBefore(date, "day")) {
					relevantTime = assignment.schedule.eta;
					action = "arriving";
					overdue = moment(assignment.schedule.eta).isBefore(now, "day");
				}
			}

			// -- add arrival if relevant
			if (relevantTime) {
				dailyAssignments.push({
					...assignment,
					relevantTime: moment(relevantTime),
					action: action,
					overdue: overdue
				});
			}

			// -- handle depatures
			relevantTime = null;
			action = null;
			overdue = false;
			if (assignment.schedule.atd) {
				if (moment(assignment.schedule.atd).isSame(date, "day")) {
					relevantTime = assignment.schedule.atd;
					action = "departed";
				}
			}
			else {
				if (moment(assignment.schedule.etd).isSameOrBefore(date, "day")) {
					relevantTime = assignment.schedule.etd;
					action = "departing";
					overdue = moment(assignment.schedule.etd).isBefore(now, "day");
				}
			}

			// -- add departure if relevant
			if (relevantTime) {
				dailyAssignments.push({
					...assignment,
					relevantTime: moment(relevantTime),
					action: action,
					overdue: overdue
				});
			}
		});

		return dailyAssignments.sort((a, b) => a.relevantTime - b.relevantTime);
	}
);

export const getVesselAssignmentsInPort = createSelector(
	getApprovedAssignments,
	berths,
	date,
	(assignments, berths, date) => {
		return assignments.filter(assignment => {
			// -- skip vessels that havent arrived
			if (!assignment.schedule.ata) {
				return false;
			}

			const arrivalTime = new Date(assignment.schedule.ata);
			const depatureTime = new Date(assignment.schedule.atd || assignment.schedule.etd);
			const startDate = new Date(date), endDate = new Date(date);
			startDate.setUTCHours(0, 0, 0, 0);
			endDate.setUTCHours(24, 0, 0, 0);

			// -- retrieve any assignment with a berth that arrived before the selected day and won't depart till after the selected day
			return arrivalTime &&
				depatureTime &&
				arrivalTime < startDate &&
				depatureTime > endDate &&
				berths.map(berth => berth.id).includes(assignment.berth.id);
		});
	}
);
