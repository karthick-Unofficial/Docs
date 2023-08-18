import _ from "lodash";

const initialContextPanelState = {
	primaryOpen: true,
	secondaryOpen: false,
	viewingHistory: [],
	selectedContext: {
		primary: null,
		secondary: null
	}
};

const contextPanelData = (state = initialContextPanelState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "OPEN_PRIMARY":
			return {
				...state,
				primaryOpen: true
			};

		case "OPEN_SECONDARY":
			return {
				...state,
				secondaryOpen: true
			};

		case "CLOSE_PRIMARY":
			return {
				...state,
				primaryOpen: false
			};

		case "CLOSE_SECONDARY":
			return {
				...state,
				secondaryOpen: false
			};

		case "EXPAND_SECONDARY":
			return {
				...state,
				secondaryExpanded: true
			};

		case "SHRINK_SECONDARY":
			return {
				...state,
				secondaryExpanded: false
			};

		case "UPDATE_VIEWING_HISTORY": {
			const { id, name, type, profileRef, context, options } = payload;

			let newHistory;

			if (!id) {
				newHistory = _.drop(state.viewingHistory);
			} else {
				newHistory = [
					{ id, name, type, profileRef, context, ...options },
					...state.viewingHistory
				];
			}

			return {
				...state,
				viewingHistory: newHistory
			};
		}

		case "DATA_RECEIVED":
		case "SUBSCRIPTION_DATA_RECEIVED":
		case "SUBSCRIPTION_DATA_UPDATED": {
			const { data } = payload;

			// Check if incoming data is stored in viewing history
			if (data && _.find(state.viewingHistory, { id: data.id })) {
				const newHistory = [...state.viewingHistory];
				const dataId = data.id;
				const previous = _.find(newHistory, { id: dataId });
				// Check if the name of an entity has changed
				if (
					previous &&
					data.entityData.properties &&
					previous.name !== data.entityData.properties.name
				) {
					// Update the name of each instance of entity and return new state
					_.each(newHistory, item => {
						if (item.id === dataId) item.name = data.entityData.properties.name;
					});
					return {
						...state,
						viewingHistory: newHistory
					};
				} else return state;
			} else return state;
		}

		case "DATA_BATCH_RECEIVED":
		case "SUBSCRIPTION_DATA_BATCH_RECEIVED": {
			const { data } = payload;
			// Check if any of the incoming data is being stored in viewing history
			if (
				_.size(
					_.intersection(_.map(data, "id"), _.map(state.viewingHistory, "id"))
				)
			) {
				const newIds = _.intersection(
					_.map(data, "id"),
					_.map(state.viewingHistory, "id")
				);
				const newHistory = [...state.viewingHistory];
				// Handle whether state should be updated
				let update = false;
				_.each(newIds, id => {
					const item = _.find(data, { id: id });
					const previous = _.find(newHistory, { id: id });
					// Check if the name of an entity has changed
					if (
						item.entityData.properties &&
						item.entityData.properties.name &&
						item.entityData.properties.name !== previous.name
					) {
						// If name has changed, set update to true
						update = true;
						// Update the name of each instance of entity and return new state
						_.each(newHistory, previous => {
							if (previous.id === id)
								previous.name = item.entityData.properties.name;
						});
					}
				});
				// Only update state if a name has changed
				if (update)
					return {
						...state,
						viewingHistory: newHistory
					};
				else return state;
			} else return state;
		}

		case "EVENT_UPDATED": {
			const { event } = payload;
			// Check if incoming event is being stored in viewing history
			if (_.find(state.viewingHistory, { id: event.id })) {
				const newHistory = [...state.viewingHistory];
				const eventId = event.id;
				const previous = _.find(newHistory, { id: eventId });
				// Check if name has changed
				if (previous && previous.name !== event.name) {
					// Update the name of each instance of event and return new state
					_.each(newHistory, item => {
						if (item.id === eventId) item.name = event.name;
					});
					return {
						...state,
						viewingHistory: newHistory
					};
				} else return state;
			} else return state;
		}

		case "DATA_REMOVED":
		case "SUBSCRIPTION_DATA_REMOVED": {
			const { dataId } = payload;
			// Check if removed data is being stored in viewing history
			if (_.find(state.viewingHistory, { id: dataId })) {
				const newHistory = [...state.viewingHistory];
				// Remove each instance from viewing history and update state
				_.remove(newHistory, item => item.id === dataId);
				return { ...state, viewingHistory: newHistory };
			} else return state;
		}

		case "EVENT_REMOVED": {
			const { eventId } = payload;
			// Check if removed event is being stored in viewing history
			if (_.find(state.viewingHistory, { id: eventId })) {
				const newHistory = [...state.viewingHistory];
				// Remove each instance from viewing history and update state
				_.remove(newHistory, item => item.id === eventId);
				return { ...state, viewingHistory: newHistory };
			} else return state;
		}

		case "SET_SELECTED_CONTEXT": {
			const { entityId, context } = payload;

			return {
				...state,
				selectedContext: {
					...state.selectedContext,
					[context]: entityId
				}
			};
		}

		case "CLEAR_SELECTED_CONTEXT": {
			const { contexts } = payload;

			const newSelectedContext = { ...state.selectedContext };

			_.each(contexts, context => (newSelectedContext[context] = null));

			return {
				...state,
				selectedContext: newSelectedContext
			};
		}

		case "CLEAR_VIEWING_HISTORY":
			return {
				...state,
				viewingHistory: []
			};

		default:
			return state;
	}
};

export default contextPanelData;
