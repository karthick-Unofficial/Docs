(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "client-app-core", "../../../../AppState/Actions", "./gisActionTypes", "lodash"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("client-app-core"), require("../../../../AppState/Actions"), require("./gisActionTypes"), require("lodash"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.clientAppCore, global.Actions, global.gisActionTypes, global.lodash);
		global.gisControlActions = mod.exports;
	}
})(this, function (exports, _clientAppCore, _Actions, _gisActionTypes, _lodash) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.updateVisibleGIS = exports.deleteGISService = exports.updateGISService = exports.getGISLayers = exports.createService = exports.resetGISRequest = exports.getGISServices = undefined;

	var t = _interopRequireWildcard(_gisActionTypes);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	}

	/**
  * Add GIS Services to state
  * @param {Object} services - Service objects returned from database
  */
	var gisServicesReceived = function gisServicesReceived(services) {
		return {
			type: t.GIS_SERVICES_RECEIVED,
			payload: { services: services }
		};
	};

	// Get user's available GIS services
	var getGISServices = exports.getGISServices = function getGISServices() {
		return function (dispatch, getState) {
			var state = getState();
			var gisState = state.appState.persisted.gisState;

			_clientAppCore.restClient.exec_get("/gis-app/api/gis-services", function (err, response) {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisServicesReceived(response));
				if (gisState) _lodash2.default.each(response, function (service) {
					var serviceState = gisState[service.id];
					/**
      * Layers are saved in state with a unique ID created from the service and layer ID.
      * We are pulling the toggled layers off persisted state and removing the
      * service ID section from the unique ID in order to hit the correct endpoint to pull layer data.
      */
					var sID = service.id + "-";
					var removeSID = new RegExp(sID, "g");
					var layerIds = _lodash2.default.map(_lodash2.default.filter(_lodash2.default.keys(serviceState), function (id) {
						return serviceState[id];
					}), function (id) {
						return id.replace(removeSID, "");
					});
					if (_lodash2.default.size(layerIds)) dispatch(getGISLayers(service.id, layerIds));
				});
			});
		};
	};

	// Toggle fetching in state
	var createServiceRequest = function createServiceRequest() {
		return {
			type: t.CREATE_SERVICE_REQUEST
		};
	};

	/**
  * Add service to state on success
  * @param {Object} service - Service data returned from successful request
  */
	var createServiceSuccess = function createServiceSuccess(service) {
		return {
			type: t.CREATE_SERVICE_SUCCESS,
			payload: { service: service }
		};
	};

	/**
  * Add error message to state
  * @param {string} error - Message returned from failed response
  */
	var createServiceFailure = function createServiceFailure(error) {
		return {
			type: t.CREATE_SERVICE_FAILURE,
			payload: { error: error }
		};
	};

	// Reset error and fetching values in state
	var resetGISRequest = exports.resetGISRequest = function resetGISRequest() {
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
	var createService = exports.createService = function createService(name, endpoint, username, password, token, authType) {
		return function (dispatch) {
			dispatch(createServiceRequest());
			_clientAppCore.restClient.exec_post("/gis-app/api/gis-service/create", JSON.stringify({
				name: name,
				endpoint: endpoint,
				username: username,
				password: password,
				token: token,
				authType: authType
			}), function (err, response) {
				if (err) console.log(err);
				if (!response) return;
				if (response.success === false) dispatch(createServiceFailure(response.reason.message));
				if (response.success !== false) dispatch(createServiceSuccess(response));
			});
		};
	};

	/**
  * Add layer data to state
  * @param {Object} layers - Layer data returned from request
  */
	var gisLayersReceived = function gisLayersReceived(layers) {
		return {
			type: t.GIS_LAYERS_RECEIVED,
			payload: { layers: layers }
		};
	};

	/**
  * Get specified layers from existing service
  * @param {string} serviceId
  * @param {Array} layerIds
  */
	var getGISLayers = exports.getGISLayers = function getGISLayers(serviceId, layerIds) {
		return function (dispatch) {
			_clientAppCore.restClient.exec_get("/gis-app/api/gis-layers/" + serviceId + "/" + _lodash2.default.toString(layerIds), function (err, response) {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisLayersReceived(response));
			});
		};
	};

	/**
  * Update GIS service in state
  * @param {string} serviceId
  * @param {Object} update
  */
	var gisServiceReceived = function gisServiceReceived(serviceId, update) {
		return {
			type: t.GIS_SERVICE_RECEIVED,
			payload: { serviceId: serviceId, update: update }
		};
	};

	/**
  * Update GIS service in DB
  * @param {string} serviceId
  * @param {Object} update
  */
	var updateGISService = exports.updateGISService = function updateGISService(serviceId, update) {
		return function (dispatch) {
			var body = JSON.stringify({ update: update });
			_clientAppCore.restClient.exec_put("/gis-app/api/gis-services/" + serviceId, body, function (err, response) {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisServiceReceived(serviceId, response));
			});
		};
	};

	/**
  * Remove service from state
  * @param {string} serviceId
  */
	var gisServiceRemoved = function gisServiceRemoved(serviceId) {
		return {
			type: t.GIS_SERVICE_REMOVED,
			payload: {
				serviceId: serviceId
			}
		};
	};

	/**
  * Remove GIS Service
  * @param {string} serviceId
  */
	var deleteGISService = exports.deleteGISService = function deleteGISService(serviceId) {
		return function (dispatch) {
			_clientAppCore.restClient.exec_delete("/gis-app/api/gis-services/" + serviceId, function (err, response) {
				if (err) console.log(err);
				if (!response) return;
				dispatch(gisServiceRemoved(serviceId));
			});
		};
	};

	/**
  * Toggle GIS Layers on and off (persists between sessions)
  * @param {string} app - App name
  * @param {string} serviceId
  * @param {Object} update - {[layerId]: boolean}
  */
	var updateVisibleGIS = exports.updateVisibleGIS = function updateVisibleGIS(app, serviceId, update) {
		return function (dispatch) {
			dispatch((0, _Actions.updatePersistedState)(app, "gisState", _defineProperty({}, serviceId, update)));
		};
	};
});