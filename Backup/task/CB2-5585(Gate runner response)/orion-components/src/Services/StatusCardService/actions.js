import { statusBoardService } from "client-app-core";
import * as t from "./actionTypes";

const initialCardsReceived = cards => {
	return {
		type: t.INITIAL_STATUS_CARDS_RECEIVED,
		payload: cards
	};
};

// Initial, add, change
const cardUpdateReceived = card => {
	return {
		type: t.STATUS_CARD_UPDATE_RECEIVED,
		payload: card
	};
};

// Remove
const cardRemoved = cardId => {
	return {
		type: t.STATUS_CARD_REMOVED,
		payload: cardId
	};
};

/**
 * Stream a user's status cards
 */
export const streamStatusCards = () => {
	return dispatch => {
		statusBoardService.streamStatusCards(
			(err, res) => {
				if (err) {
					console.log("Error streaming status cards", err);
				}
				else {
					if (res.batch && res.batch === "initial") {
						const { changes } = res;
						const initialValues = changes.map(change => change.new_val);
						dispatch(initialCardsReceived(initialValues));
					}
					else {
						const { type, new_val, old_val } = res;

						if (["initial", "add", "change"].includes(type)) {
							dispatch(cardUpdateReceived(new_val));
						}
						else if (type === "remove") {
							dispatch(cardRemoved(old_val.id));
						}
					}
				}
			}
		);
	};
};