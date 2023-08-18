import _ from "lodash";

const initialContextualData = {};

const contextualData = (state = initialContextualData, action) => {
	const { type, payload } = action;

	switch (type) {
		case "ADD_CONTEXT": {
			const { id, entity } = payload;

			const extantContext = state[id];

			if (!extantContext) {
				return {
					...state,
					[id]: {
						entity,
						subscriptions: {}
					}
				};
			} else {
				return {
					...state,
					[id]: {
						...extantContext,
						entity
					}
				};
			}
		}

		case "UPDATE_CONTEXT": {
			const { contextId, update } = payload;
			const newContext = {
				...state[contextId],
				entity: update
			};
			if (newContext.trackHistory) {
				const { trackHistory } = newContext;
				// if track has not moved in during the duration the trackHistory will be empty and we need to base the last known position on the pre-update entity.
				let lastKnownPosition = JSON.stringify(
					state[contextId].entity.entityData.geometry.coordinates
				);
				if (trackHistory[trackHistory.length - 1]) {
					// if track history was populated, base the last known position on what is in trackHistory
					lastKnownPosition = JSON.stringify(
						trackHistory[trackHistory.length - 1].entityData
							.geometry.coordinates
					);
				} else {
					// else we need to populate trackHistory ourselves with some initial data
					trackHistory.push({
						entityData: state[contextId].entity.entityData
					});
				}
				if (
					lastKnownPosition !==
					JSON.stringify(
						update.entityData.geometry.coordinates &&
							update.entityData &&
							update.entityData.properties &&
							update.entityData.geometry
					)
				) {
					const {
						name,
						mmsi: mmsid,
						imo,
						callsign,
						timestamp: acquisitionTime,
						speed,
						hdg,
						course
					} = update.entityData.properties;
					newContext.trackHistory.push({
						entityData: {
							geometry: update.entityData.geometry,
							properties: {
								name,
								mmsid,
								acquisitionTime,
								imo,
								callsign,
								speed,
								hdg,
								course,
								id: update.id,
								lat: update.entityData.geometry.coordinates[1],
								lng: update.entityData.geometry.coordinates[0]
							}
						}
					});
				}
			}

			return {
				...state,
				[contextId]: {
					...newContext
				}
			};
		}
		case "UPDATE_CONTEXT_PROPERTY": {
			const { contextId, updateProp, updateVal } = payload;

			const context = { ...state[contextId] };

			// If no context, abort
			if (!context) {
				return state;
			} else {
				return {
					...state,
					[contextId]: {
						...context,
						[updateProp]: updateVal
					}
				};
			}
		}
		case "UPDATE_CONTEXT_LIST_CATEGORIES": {
			const { contextId, categories } = payload;
			const batch = _.keyBy(categories, "id");
			return {
				...state,
				[contextId]: {
					...state[contextId],
					listCategories: {
						...state[contextId]["listCategories"],
						...batch
					}
				}
			};
		}
		case "REMOVE_CONTEXT": {
			const { contextId } = payload;
			const newState = { ...state };

			delete newState[contextId];

			return newState;
		}

		case "SET_SUBSCRIPTION":
			{
				const {
					contextId,
					subscription,
					subscriptionId,
					subscriberRef
				} = payload;

				const context = { ...state[contextId] };

				if (!context || _.isEmpty(context)) {
					return {
						...state,
						[contextId]: {
							subscriptions: {
								[subscriptionId]: {
									subscription: subscription,
									subscribers: [subscriberRef]
								}
							}
						}
					};
				} else if (context.subscriptions[subscriptionId]) {
					// Check if theres already an existing subscription
					const extantSub = {
						...context.subscriptions[subscriptionId]
					};
					return {
						...state,
						[contextId]: {
							...context,
							subscriptions: {
								...context.subscriptions,
								[subscriptionId]: {
									...context.subscriptions[subscriptionId],
									// If subscription exists already (subscriptionId involves multiple feed subscriptions)
									// concatenate into an array
									subscription: extantSub.subscription
										? _.concat(
												extantSub.subscription,
												subscription
										  )
										: context.subscriptions[subscriptionId]
												.subscription,
									// Insure that there are no duplicate values
									subscribers: _.uniq([
										...context.subscriptions[subscriptionId]
											.subscribers,
										subscriberRef
									])
								}
							}
						}
					};
				} else if (context && !context.subscriptions[subscriptionId]) {
					return {
						...state,
						[contextId]: {
							...context,
							// If no response came through for the data (i.e. there were no activities for the entity)
							// add an empty array. If data is not iterable, it will be replaced if data does end up coming through.
							[subscriptionId]: context[subscriptionId]
								? context[subscriptionId]
								: [],
							subscriptions: {
								...context.subscriptions,
								[subscriptionId]: {
									subscription: subscription,
									subscribers: [subscriberRef]
								}
							}
						}
					};
				}
			}
			break;

		case "SUBSCRIPTION_DATA_RECEIVED": {
			const { contextId, data, subscriptionId, iterable } = payload;

			const context = { ...state[contextId] };

			// If no context, abort
			if (!context) {
				return state;
				// If context exists, and subscription already has data, add more new data
			} else if (context[subscriptionId]) {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: iterable
							? _.uniqBy([data, ...context[subscriptionId]], "id") // Prevent duplicates on re-subscriptions
							: data
					}
				};
				// Otherwise, create subscription data key and add item
			} else {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: iterable ? [data] : data
					}
				};
			}
		}

		case "SUBSCRIPTION_DATA_BATCH_RECEIVED": {
			const { contextId, data, subscriptionId, iterable } = payload;
			const context = { ...state[contextId] };

			// If no context, abort
			if (!context) {
				return state;
				// If context exists, and subscription already has data, add more new data
			} else if (context[subscriptionId]) {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: iterable
							? _.uniqBy(
									[...data, ...context[subscriptionId]],
									"id"
							  ) // Prevent duplicates on re-subscriptions
							: data
					}
				};
				// Otherwise, create subscription data key and add item
			} else {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: data
					}
				};
			}
		}

		case "SUBSCRIPTION_DATA_REMOVED": {
			const { contextId, dataId, subscriptionId } = payload;

			const context = state[contextId] ? { ...state[contextId] } : null;

			let newData;
			if (context) {
				newData = context[subscriptionId].filter(
					(item) => item.id !== dataId
				);
			}

			if (!context) {
				return state;
			} else {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: [...newData]
					}
				};
			}
		}

		case "SUBSCRIPTION_DATA_UPDATED": {
			const { contextId, data, subscriptionId } = payload;

			const context = state[contextId] ? { ...state[contextId] } : null;

			let updatedData;
			if (context) {
				const oldData = [...context[subscriptionId]];
				updatedData = oldData.map((item) => {
					if (item.id === data.id) {
						if (data.entityType === "list") {
							item.name = data.name;
							item.rows = _.cloneDeep(data.rows);
						} else {
							if (data.entityData.geometry)
								item.entityData.geometry = {
									...item.entityData.geometry,
									...data.entityData.geometry
								};
							if (data.entityData.properties)
								item.entityData.properties = {
									...item.entityData.properties,
									...data.entityData.properties
								};
							if (item.entityType === "camera")
								item.slewLock = data.slewLock;
						}
					}
					return item;
				});
			}

			if (!context) {
				return state;
			} else {
				return {
					...state,
					[contextId]: {
						...context,
						[subscriptionId]: [...updatedData]
					}
				};
			}
		}

		case "REMOVE_SUBSCRIBER": {
			const { contextId, subscriptionId, subscriberRef } = payload;

			const context = { ...state[contextId] };

			const newSubscribers = context.subscriptions[subscriptionId]
				? [...context.subscriptions[subscriptionId].subscribers]
				: [];

			// Remove subscriber from array
			_.pull(newSubscribers, subscriberRef);

			return {
				...state,
				[contextId]: {
					...context,
					subscriptions: {
						...context.subscriptions,
						[subscriptionId]: {
							...context.subscriptions[subscriptionId],
							subscribers: newSubscribers
						}
					}
				}
			};
		}

		case "ADD_SUBSCRIBER": {
			const { contextId, subscriptionId, subscriberRef } = payload;

			const context = { ...state[contextId] };

			const newSubscribers = [
				...context.subscriptions[subscriptionId].subscribers,
				subscriberRef
			];

			return {
				...state,
				[contextId]: {
					...context,
					subscriptions: {
						...context.subscriptions,
						[subscriptionId]: {
							...context.subscriptions[subscriptionId],
							subscribers: newSubscribers
						}
					}
				}
			};
		}

		case "REMOVE_SUBSCRIPTION": {
			const { contextId, subscriptionId } = payload;
			if (state[contextId]) {
				const context = { ...state[contextId] };
				const newSubscriptions = { ...state[contextId].subscriptions };

				// Remove feed and related data
				delete context[subscriptionId];
				delete newSubscriptions[subscriptionId];

				return {
					...state,
					[contextId]: {
						...context,
						subscriptions: newSubscriptions
					}
				};
			} else {
				return state;
			}
		}

		// case "CONTEXT_DATA_RECEIVED": {
		// 	const { contextId, feedId, data } = payload;
		// 	const context = { ...state[contextId] };
		// 	return {
		// 		...state,
		// 		[contextId]: {
		// 			...context,
		// 			[feedId]: {
		// 				...context[feedId],
		// 				[data.id]: data
		// 			}
		// 		}
		// 	};
		// }

		// case "CONTEXT_DATA_REMOVED": {
		// 	const { contextId, feedId, dataId } = payload;
		// 	const context = { ...state[contextId] };
		// 	const newFeedData = { ...context[feedId] };

		// 	delete newFeedData[dataId];

		// 	return {
		// 		...state,
		// 		[contextId]: {
		// 			...context,
		// 			[feedId]: newFeedData
		// 		}
		// 	};
		// }

		default:
			return state;
	}
};

export default contextualData;
