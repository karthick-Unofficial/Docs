import { restClient } from "client-app-core";
import { updatePersistedState } from "orion-components/AppState/Actions";
import * as t from "./actionTypes";
import _ from "lodash";

/**
 * Add GIS Services to state
 * @param {Object} services - Service objects returned from database
 */
const gisServicesReceived = services => {
	return {
		type: t.GIS_SERVICES_RECEIVED,
		payload: { services }
	};
};

// Get user's available GIS services
export const getGISServices = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { gisState } = state.appState.persisted;
		restClient.exec_get("/gis-app/api/gis-services", (err, response) => {
			if (err) console.log(err);
			if (!response) return;

			if (response.success === false) {
				console.log("Error fetching GIS services.");
			}
			else {
				dispatch(gisServicesReceived(response));
				if (gisState) {
					_.each(response, service => {
						const serviceState = gisState[service.id];
						/**
						 * Layers are saved in state with a unique ID created from the service and layer ID.
						 * We are pulling the toggled layers off persisted state and removing the
						 * service ID section from the unique ID in order to hit the correct endpoint to pull layer data.
						 */
						const sID = `${service.id}-`;
						const removeSID = new RegExp(sID, "g");
						const layerIds = _.map(
							_.filter(_.keys(serviceState), id => serviceState[id]),
							id => id.replace(removeSID, "")
						);
						if (_.size(layerIds)) dispatch(getGISLayers(service.id, layerIds));
					});
				}
			}
		});
	};
};

// Toggle fetching in state
const createServiceRequest = () => {
	return {
		type: t.CREATE_SERVICE_REQUEST
	};
};

/**
 * Add service to state on success
 * @param {Object} service - Service data returned from successful request
 */
const createServiceSuccess = service => {
	return {
		type: t.CREATE_SERVICE_SUCCESS,
		payload: { service }
	};
};

/**
 * Add error message to state
 * @param {string} error - Message returned from failed response
 */
const createServiceFailure = error => {
	return {
		type: t.CREATE_SERVICE_FAILURE,
		payload: { error }
	};
};

// Reset error and fetching values in state
export const resetGISRequest = () => {
	return {
		type: t.CREATE_SERVICE_RESET
	};
};

/**
 *
 * @param {string} name - User specified name for service
 * @param {string} endpoint - URL to request service data
 * @param {string} username
 * @param {string} password
 * @param {string} token
 * @param {string} authType - Login, Token or None
 */
export const createService = (
	name,
	endpoint,
	username,
	password,
	token,
	authType
) => {
	return dispatch => {
		dispatch(createServiceRequest());
		restClient.exec_post(
			"/gis-app/api/gis-service/create",
			JSON.stringify({
				name,
				endpoint,
				username,
				password,
				token,
				authType
			}),
			(err, response) => {
				if (err) console.log(err);
				if (!response) return;
				if (response.success === false)
					dispatch(createServiceFailure(response.reason.message));
				if (response.success !== false)
					dispatch(createServiceSuccess(response));
			}
		);
	};
};

/**
 * Add layer data to state
 * @param {Object} layers - Layer data returned from request
 */
const gisLayersReceived = layers => {
	return {
		type: t.GIS_LAYERS_RECEIVED,
		payload: { layers }
	};
};

/**
 * Get specified layers from existing service
 * @param {string} serviceId
 * @param {Array} layerIds
 */
let currentlyRequesting = false;
const layerRequestQueue = [];
export const getGISLayers = (serviceId, layerIds, requestOffset = 0) => {
	if (currentlyRequesting) {
		// -- don't add duplicates
		const requestString = `${serviceId},${Array.isArray(layerIds) ? layerIds[0] : layerIds}`;
		if (layerRequestQueue.indexOf(requestString) < 0)
			layerRequestQueue.push(requestString);
		return;
	} else {
		currentlyRequesting = true;
		return (dispatch, getState) => {
			const { gisState, appId } = getState().appState.persisted;
			const idArray = Array.isArray(layerIds) ? layerIds : [layerIds];
			idArray.forEach(id => {
				const serviceLayerId = serviceId + "-" + id;
				currentRequestList.push(serviceLayerId);
				restClient.exec_get(
					`/gis-app/api/gis-layers/${serviceId}/${_.toString(id)}?requestOffset=${requestOffset}`,
					(err, response) => {
						if (err) {
							// -- call next gis layer request
							return endRequest(dispatch);
						}
						if (!response || !response.length) {
							if (appId) {
								dispatch(
									updateVisibleGIS(appId, serviceId, {
										...gisState[serviceId],
										[`${serviceId}-${id}`]: false
									})
								);
							}

							// -- call next gis layer request
							return endRequest(dispatch);
						}

						// -- drop response if layer has been shut off
						const layerIndex = cancelRequestList.indexOf(serviceLayerId);
						if (layerIndex > -1) {
							cancelRequestList.splice(layerIndex, 1);
							const requestIndex = currentRequestList.indexOf(serviceLayerId);
							currentRequestList.splice(requestIndex, 1);

							// -- call next gis layer request
							return endRequest(dispatch);
						}

						dispatch(gisLayersReceived(response));

						// -- make multiple requests if more features available
						if (response[0].nextPageURL) {
							// -- slow down request frequency if features are not getting returned (ie. timeouts are occuring)
							const timeout = response[0].features.length === 0 ? 5000 : 10;
							setTimeout(() => {
								getSubsequentGISLayers(serviceLayerId, response[0].features, response[0].nextPageURL, dispatch);
							}, timeout);
						}
						else {
							const requestIndex = currentRequestList.indexOf(serviceLayerId);
							currentRequestList.splice(requestIndex, 1);

							// -- call next gis layer request
							endRequest(dispatch);
						}
					}
				);
			});
		};
	}
};

const getSubsequentGISLayers = (serviceLayerId, prevFeatures, nextPageURL, dispatch) => {
	restClient.exec_get(nextPageURL,
		(err, response) => {
			if (err) {
				console.log(err);

				// -- call next gis layer request
				return endRequest(dispatch);
			}
			if (!response || !response.length) {
				// Do we want to turn off the layer if at least 1 set of features has come through successfully? - CD
				// -- call next gis layer request
				return endRequest(dispatch);
			}

			// -- drop response if layer has been shut off
			const layerIndex = cancelRequestList.indexOf(serviceLayerId);
			if (layerIndex > -1) {
				cancelRequestList.splice(layerIndex, 1);
				const requestIndex = currentRequestList.indexOf(serviceLayerId);
				currentRequestList.splice(requestIndex, 1);

				// -- call next gis layer request
				return endRequest(dispatch);
			}

			// -- merge all previous features together
			response[0].features = response[0].features.concat(prevFeatures);
			dispatch(gisLayersReceived(response));

			// -- make multiple requests if more features available
			if (response[0].nextPageURL) {
				// -- slow down request frequency if features are not getting returned (ie. timeouts are occuring)
				const timeout = response[0].features.length === 0 ? 5000 : 10;
				setTimeout(() => {
					getSubsequentGISLayers(serviceLayerId, response[0].features, response[0].nextPageURL, dispatch);
				}, timeout);
			}
			else {
				const requestIndex = currentRequestList.indexOf(serviceLayerId);
				currentRequestList.splice(requestIndex, 1);

				// -- call next gis layer request
				endRequest(dispatch);
			}
		}
	);
};

const endRequest = (dispatch) => {
	// -- check for queued requests after current request is completed/canceled
	currentlyRequesting = false;
	if (layerRequestQueue.length > 0) {
		const [serviceId, layerIds] = layerRequestQueue.shift().split(",");
		dispatch(getGISLayers(serviceId, layerIds));
	}
};

let currentRequestList = [];
let cancelRequestList = [];
export const turnOffGISLayer = (serviceId, layerId) => {
	const serviceLayerId = serviceId + "-" + layerId;

	// -- Only need to turn off if the layer is currently being requested
	if (currentRequestList.includes(serviceLayerId)) {
		cancelRequestList.push(serviceLayerId);
	}

	// -- remove request if present and layer turned off
	const requestIndex = layerRequestQueue.indexOf(`${serviceId},${layerId}`);
	if (requestIndex > -1) {
		layerRequestQueue.splice(requestIndex, 1);
	}
};

/**
 * Update GIS service in state
 * @param {string} serviceId
 * @param {Object} update
 */
const gisServiceReceived = (serviceId, update) => {
	return {
		type: t.GIS_SERVICE_RECEIVED,
		payload: { serviceId, update }
	};
};

/**
 * Update GIS service in DB
 * @param {string} serviceId
 * @param {Object} update
 */
export const updateGISService = (serviceId, update) => {
	return dispatch => {
		const body = JSON.stringify({ update });
		restClient.exec_put(
			`/gis-app/api/gis-services/${serviceId}`,
			body,
			(err, response) => {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisServiceReceived(serviceId, response));
			}
		);
	};
};

/**
 * Remove service from state
 * @param {string} serviceId
 */
const gisServiceRemoved = serviceId => {
	return {
		type: t.GIS_SERVICE_REMOVED,
		payload: {
			serviceId
		}
	};
};

/**
 * Remove GIS Service
 * @param {string} serviceId
 */
export const deleteGISService = serviceId => {
	return dispatch => {
		restClient.exec_delete(
			`/gis-app/api/gis-services/${serviceId}`,
			(err, response) => {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisServiceRemoved(serviceId));
			}
		);
	};
};

/**
 * Toggle GIS Layers on and off (persists between sessions)
 * @param {string} app - App name
 * @param {string} serviceId
 * @param {Object} update - {[layerId]: boolean}
 */
export const updateVisibleGIS = (app, serviceId, update) => {
	return dispatch => {
		dispatch(updatePersistedState(app, "gisState", { [serviceId]: update }));
	};
};
