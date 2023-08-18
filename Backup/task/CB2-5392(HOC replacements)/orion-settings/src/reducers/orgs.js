const orgs = (state = {}, action) => {
	switch (action.type) {
		case "HYDRATE_ECOSYSTEM_SUCCESS":
		case "REFRESH_ECOSYSTEM_SUCCESS":
		case "GET_ALL_ORGS_SUCCESS": {
			return Object.assign({},
				action.orgs.reduce((total, current) => {
					total[current.orgId] = state ? state[current.orgId] ? { ...state[current.orgId],
						...current
					} : current :
						current;
					return total;
				}, {})
			);
		}

		case "CREATE_ORG_SUCCESS":
			return Object.assign({}, state, {
				[action.payload.orgId]: action.payload
			});

		case "ASSIGN_APP": {
			const org = state[action.orgId];
			let applications = org.applications.slice();
			if (!action.app.active) {
				applications = applications.filter(
					app => app.appId !== action.app.appId
				);
			} else {
				applications.push(action.app);
			}

			return {
				...state,
				[action.orgId]: {
					...state[action.orgId],
					applications
				}
			};
		}

		case "CREATE_ROLE_SUCCESS": {
			const newRoles = state[action.orgId].roles.slice();
			newRoles.push(action.newRole);

			return Object.assign({}, state, {
				[action.orgId]: Object.assign({}, state[action.orgId], {
					roles: newRoles
				})
			});
		}

		case "UPDATE_ROLE_SUCCESS": {
			let newRoles = state[action.orgId].roles.slice();
			let newRoleApplications = [];
			let newRoleIntegrations = [];
			newRoles = newRoles.map(role => {
				if (role.roleId !== action.newRole.roleId) {
					return role;
				}
				if (action.newRole.applications.length) {
					newRoleApplications = role.applications ? role.applications.reduce((obj, item) => {
						return {
							...obj,
							[item["appId"]]: item
						};
					}, {}) : {};
					newRoleApplications[action.newRole.applications[0].appId] = action.newRole.applications[0];
				}
				if (action.newRole.integrations.length) {
					newRoleIntegrations = role.integrations ? role.integrations.reduce((obj, item) => {
						return {
							...obj,
							[item["intId"]]: item
						};
					}, {}) : {};
					newRoleIntegrations[action.newRole.integrations[0].intId] = action.newRole.integrations[0];
				}
				return {
					...role,
					...action.newRole.appId,
					...(Object.keys(newRoleApplications).length ? {
						applications: Object.values(newRoleApplications) } : 
						Object.keys(newRoleIntegrations).length ? {integrations: Object.values(newRoleIntegrations)} : 
							{})
				};
			});

			return Object.assign({}, state, {
				[action.orgId]: Object.assign({}, state[action.orgId], {
					roles: newRoles
				})
			});
		}

		case "DELETE_ROLE_SUCCESS": {
			let newRoles = state[action.orgId].roles.slice();
			newRoles = newRoles.filter(role => role.id !== action.id);

			return Object.assign({}, state, {
				[action.orgId]: Object.assign({}, state[action.orgId], {
					roles: newRoles
				})
			});
		}
		
		case "UPDATE_ORG_SUCCESS":
			return {
				...state,
				[action.update.orgId]: {
					...state[action.update.orgId],
					...action.update
				}
			};

		case "ASSIGN_INTEGRATION": {
			let integrations = state[action.orgId].integrations.slice();
			if (!action.integration.active) {
				integrations = integrations.filter(
					int => int.feedId !== action.integration.feedId
				);
			} else {
				integrations.push(action.integration);
			}

			return {
				...state,
				[action.orgId]: {
					...state.org,
					integrations
				}
			};
		}

		default:
			return state;
	}
};

export default orgs;