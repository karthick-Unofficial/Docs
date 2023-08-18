const users = (state = {}, action) => {
	switch (action.type) {
		case "HYDRATE_ECOSYSTEM_SUCCESS":
		case "REFRESH_ECOSYSTEM_SUCCESS": {
			return Object.assign(
				{},
				action.users.reduce((total, current) => {
					total[current.id] = state
						? state[current.id]
							? {
								...state[current.id],
								...current
							  }
							: current
						: current;
					return total;
				}, {})
			);
		}

		case "CREATE_USER_SUCCESS":
			return Object.assign({}, state, {
				[action.user.id]: action.user
			});

		case "UPDATE_USER_PERMISSIONS":
		case "UPDATE_USER_ACTIVE": {
			const id = action.userId ? action.userId : action.id;
			return {
				...state,
				[id]: {
					...state[id],
					...action.update
				}
			};
		}

		case "FETCH_PROFILE_SUCCESS":
			return {
				...state,
				[action.user.id]: {
					...state[action.user.id],
					...action.user
				}
			};
		case "UPDATE_APP": {
			let newApps = state.user.applications.slice();
			newApps = newApps.map(app => {
				if (app.appId !== action.app.appId) {
					return app;
				}
				return {
					...app,
					...action.app
				};
			});

			return Object.assign({}, state, {
				user: Object.assign({}, state.user, {
					applications: newApps
				})
			});
		}

		// case "ADD_APPLICATION": {
		// 	const { userId, appId, config } = action;
		// 	const newApps = [...state[userId].applications];

		// 	newApps.push({ appId: appId, config: config });

		// 	return {
		// 		...state,
		// 		[userId]: {
		// 			...state[userId],
		// 			applications: newApps
		// 		}
		// 	};
		// }

		// case "REMOVE_APPLICATION": {
		// 	let newApps = state[action.userId].applications.slice();

		// 	newApps = newApps.filter(application => {
		// 		return application.appId !== action.appId;
		// 	});

		// 	return Object.assign({}, state, {
		// 		[action.userId]: Object.assign({}, state[action.userId], {
		// 			applications: newApps
		// 		})
		// 	});
		// }

		// case "UPDATE_INTEGRATION": {
		// 	const { userId, feedId, config } = action;
		// 	console.log("user", state[userId]);
		// 	const newFeeds = [...state[userId].integrations];
		// 	console.log("newFeeds A", newFeeds);
		// 	const updatedFeed = _.find(newFeeds, feed => feed.feedId === feedId);
		// 	console.log("updated feed", updatedFeed);
		// 	if (updatedFeed && updatedFeed.config) {
		// 		console.log("setting config");
		// 		updatedFeed.config = config;
		// 	} else {
		// 		console.log("adding mock config");
		// 		newFeeds.push({ feedId: feedId, config: config });
		// 	}

		// 	return {
		// 		...state,
		// 		[userId]: {
		// 			...state[userId],
		// 			integrations: newFeeds
		// 		}
		// 	};
		// }

		// case "ADD_INTEGRATION": {
		// 	const newInts = state[action.userId].integrations.slice();
		// 	newInts.push({ ...action.integration, config: action.config });

		// 	return Object.assign({}, state, {
		// 		[action.userId]: Object.assign({}, state[action.userId], {
		// 			integrations: newInts
		// 		})
		// 	});
		// }

		// case "REMOVE_INTEGRATION": {
		// 	let newInts = state[action.userId].integrations.slice();

		// 	newInts = newInts.filter(integration => {
		// 		return integration.feedId !== action.feedId;
		// 	});

		// 	return Object.assign({}, state, {
		// 		[action.userId]: Object.assign({}, state[action.userId], {
		// 			integrations: newInts
		// 		})
		// 	});
		// }

		default:
			return state;
	}
};

export default users;
