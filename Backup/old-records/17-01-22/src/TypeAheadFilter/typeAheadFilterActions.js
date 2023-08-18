import * as t from "../actionTypes";

export function typeAheadFilter(textEntry) {
	return {
		type: t.TYPEAHEAD_FILTER,
		textEntry: textEntry
	};
}