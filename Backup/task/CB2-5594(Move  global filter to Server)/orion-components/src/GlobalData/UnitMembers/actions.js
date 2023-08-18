import * as t from "./actionTypes";
import { unitService } from "client-app-core";

/*
* Add or update a unit member in state
* @param unit member: a unit member object
*/
const unitMemberReceived = member => {
	return {
		type: t.UNIT_MEMBER_RECEIVED,
		payload: { member }
	};
};

/*
* Removea unit member in state 
* @param unit member: ID of a unit member to be removed
*/
const unitMemberRemoved = unitMemberId => {
	return {
		type: t.UNIT_MEMBER_REMOVED,
		payload: { unitMemberId }
	};
};

/*
* Subscribe to unit member feed
*/
export const subscribeUnitMembers = () => {
	return dispatch => {
		unitService.streamUnitMembers((err, response) => {
			if (err) console.log(err);
			else {
				if (!response) return;
				switch (response.type) {
					case "initial":
					case "add":
					case "change":
						dispatch(unitMemberReceived(response.new_val));
						break;
					case "remove":
						dispatch(unitMemberRemoved(response.old_val.id));
						break;
					default:
				}
			}
		});
	};
};
