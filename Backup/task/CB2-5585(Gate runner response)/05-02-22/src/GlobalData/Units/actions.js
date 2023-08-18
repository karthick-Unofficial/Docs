import * as t from "./actionTypes";
import { unitService } from "client-app-core";

/*
* Add or update a unit  in state
*/
const unitReceived = unit => {
	return {
		type: t.UNIT_RECEIVED,
		payload: { unit }
	};
};

/*
* Remove a unit in state 
*/
const unitRemoved = unitId => {
	return {
		type: t.UNIT_REMOVED,
		payload: { unitId }
	};
};

/*
* Subscribe to units
*/
export const subscribeUnits = () => {
	return (dispatch, getState) => {
		unitService.streamUnits((err, response) => {
			if (err) console.log(err);
			else {
				if (!response) return;
				switch (response.type) {
					case "initial":
						dispatch(unitReceived(response.new_val));
						break;
					case "add":
						dispatch(unitReceived(response.new_val));
						break;
					case "remove":
						dispatch(unitRemoved(response.old_val.id));
						break;
					case "change":
						dispatch(unitReceived(response.new_val));
						break;

					default:
				}
			}
		});
	};
};
