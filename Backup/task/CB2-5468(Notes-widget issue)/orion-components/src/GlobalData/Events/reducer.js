import _ from "lodash";
const initialState = {
	events: {},
	eventStatistics: {},
	types: {},
	templates: {}
};

const events = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "INITIAL_EVENT_BATCH_RECEIVED": {
			const newEvents = { ...state.events };

			for(const event of payload) {
				newEvents[event.id] = event;
			}

			return {
				...state,
				events: newEvents
			};
		}

		case "EVENT_RECEIVED": {
			const newEvents = { ...state.events };

			newEvents[payload.id] = payload;

			return {
				...state,
				events: newEvents
			};
		}

		case "EVENT_REMOVED": {
			const eventId = payload.eventId;

			const newEvents = { ...state.events };
			const newEventStatistics = { ...state.eventStatistics };

			delete newEvents[eventId];
			delete newEventStatistics[eventId];

			return {
				...state,
				events: newEvents,
				eventStatistics: newEventStatistics
			};
		}

		case "EVENT_UPDATED": {
			const { eventId, event } = payload;

			const newEvents = { ...state.events };

			newEvents[eventId] = event;

			return {
				...state,
				events: newEvents
			};
		}

		case "RECEIVED_EVENT_COMMENT_COUNT": {
			const newEventStatistics = { ...state.eventStatistics };
			newEventStatistics[payload.eventId] = payload.stats;

			return {
				...state,
				eventStatistics: newEventStatistics
			};
		}

		case "EVENT_TYPES_RECEIVED": {
			const { types } = payload;
			const newTypes = { ...state.types };
			const update = _.keyBy(types, "eventTypeId");
			return {
				...state,
				types: { ...newTypes, ...update }
			};
		}

		case "EVENT_TEMPLATE_RECEIVED": {
			const newTemplates = { ...state.templates };

			newTemplates[payload.id] = payload;

			return {
				...state,
				templates: newTemplates
			};
		}

		case "EVENT_TEMPLATE_REMOVED": {
			const eventId = payload.eventId;

			const newTemplates = { ...state.templates };

			delete newTemplates[eventId];

			return {
				...state,
				templates: newTemplates
			};
		}

		case "EVENT_TEMPLATE_UPDATED": {
			const { eventId, event } = payload;

			const newTemplates = { ...state.templates };

			newTemplates[eventId] = event;

			return {
				...state,
				templates: newTemplates
			};
		}

		default:
			return state;
	}
};

export default events;
