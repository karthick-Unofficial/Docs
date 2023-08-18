export default function(oldAssignments, newAssignments) {
	const result = {};

	const filtered = Object.values(newAssignments).filter(item => {
		if (
			!!oldAssignments[item.id] &&
			oldAssignments[item.id] !== newAssignments[item.id]
		) {
			return true;
		}
		return item.notifyEmail || item.notifyPush || item.notifySystem;
	});

	filtered.forEach(item => {
		result[item.id] = item;
	});

	return result;
}
