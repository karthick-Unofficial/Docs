"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.updateVisibleGIS = exports.updateGISService = exports.turnOffGISLayer = exports.resetGISRequest = exports.getGISServices = exports.getGISLayers = exports.deleteGISService = exports.createService = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/AppState/Actions");
var t = _interopRequireWildcard(require("./actionTypes"));
var _each = _interopRequireDefault(require("lodash/each"));
var _map = _interopRequireDefault(require("lodash/map"));
var _filter = _interopRequireDefault(require("lodash/filter"));
var _keys = _interopRequireDefault(require("lodash/keys"));
var _size = _interopRequireDefault(require("lodash/size"));
var _toString = _interopRequireDefault(require("lodash/toString"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * Add GIS Services to state
 * @param {Object} services - Service objects returned from database
 */
var gisServicesReceived = function gisServicesReceived(services) {
  return {
    type: t.GIS_SERVICES_RECEIVED,
    payload: {
      services: services
    }
  };
};

// Get user's available GIS services
var getGISServices = function getGISServices() {
  return function (dispatch, getState) {
    var state = getState();
    var gisState = state.appState.persisted.gisState;
    _clientAppCore.restClient.exec_get("/gis-app/api/gis-services", function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      if (response.success === false) {
        console.log("Error fetching GIS services.");
      } else {
        dispatch(gisServicesReceived(response));
        if (gisState) {
          (0, _each["default"])(response, function (service) {
            var serviceState = gisState[service.id];
            /**
             * Layers are saved in state with a unique ID created from the service and layer ID.
             * We are pulling the toggled layers off persisted state and removing the
             * service ID section from the unique ID in order to hit the correct endpoint to pull layer data.
             */
            var sID = "".concat(service.id, "-");
            var removeSID = new RegExp(sID, "g");
            var layerIds = (0, _map["default"])((0, _filter["default"])((0, _keys["default"])(serviceState), function (id) {
              return serviceState[id];
            }), function (id) {
              return id.replace(removeSID, "");
            });
            if ((0, _size["default"])(layerIds)) dispatch(getGISLayers(service.id, layerIds));
          });
        }
      }
    });
  };
};

// Toggle fetching in state
exports.getGISServices = getGISServices;
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
    payload: {
      service: service
    }
  };
};

/**
 * Add error message to state
 * @param {string} error - Message returned from failed response
 */
var createServiceFailure = function createServiceFailure(error) {
  return {
    type: t.CREATE_SERVICE_FAILURE,
    payload: {
      error: error
    }
  };
};

// Reset error and fetching values in state
var resetGISRequest = function resetGISRequest() {
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
exports.resetGISRequest = resetGISRequest;
var createService = function createService(name, endpoint, username, password, token, authType) {
  return function (dispatch) {
    dispatch(createServiceRequest());
    _clientAppCore.restClient.exec_post("/gis-app/api/gis-service/create", (0, _stringify["default"])({
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
exports.createService = createService;
var gisLayersReceived = function gisLayersReceived(layers) {
  return {
    type: t.GIS_LAYERS_RECEIVED,
    payload: {
      layers: layers
    }
  };
};

/**
 * Get specified layers from existing service
 * @param {string} serviceId
 * @param {Array} layerIds
 */
var currentlyRequesting = false;
var layerRequestQueue = [];
var getGISLayers = function getGISLayers(serviceId, layerIds) {
  var requestOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (currentlyRequesting) {
    var _context;
    // -- don't add duplicates
    var requestString = (0, _concat["default"])(_context = "".concat(serviceId, ",")).call(_context, (0, _isArray["default"])(layerIds) ? layerIds[0] : layerIds);
    if ((0, _indexOf["default"])(layerRequestQueue).call(layerRequestQueue, requestString) < 0) layerRequestQueue.push(requestString);
    return;
  } else {
    currentlyRequesting = true;
    return function (dispatch, getState) {
      var _getState$appState$pe = getState().appState.persisted,
        gisState = _getState$appState$pe.gisState,
        appId = _getState$appState$pe.appId;
      var idArray = (0, _isArray["default"])(layerIds) ? layerIds : [layerIds];
      (0, _forEach["default"])(idArray).call(idArray, function (id) {
        var _context2, _context3;
        var serviceLayerId = serviceId + "-" + id;
        currentRequestList.push(serviceLayerId);
        _clientAppCore.restClient.exec_get((0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "/gis-app/api/gis-layers/".concat(serviceId, "/")).call(_context3, (0, _toString["default"])(id), "?requestOffset=")).call(_context2, requestOffset), function (err, response) {
          if (err) {
            // -- call next gis layer request
            return endRequest(dispatch);
          }
          if (!response || !response.length) {
            if (appId) {
              var _context4;
              dispatch(updateVisibleGIS(appId, serviceId, _objectSpread(_objectSpread({}, gisState[serviceId]), {}, (0, _defineProperty2["default"])({}, (0, _concat["default"])(_context4 = "".concat(serviceId, "-")).call(_context4, id), false))));
            }

            // -- call next gis layer request
            return endRequest(dispatch);
          }

          // -- drop response if layer has been shut off
          var layerIndex = (0, _indexOf["default"])(cancelRequestList).call(cancelRequestList, serviceLayerId);
          if (layerIndex > -1) {
            (0, _splice["default"])(cancelRequestList).call(cancelRequestList, layerIndex, 1);
            var requestIndex = (0, _indexOf["default"])(currentRequestList).call(currentRequestList, serviceLayerId);
            (0, _splice["default"])(currentRequestList).call(currentRequestList, requestIndex, 1);

            // -- call next gis layer request
            return endRequest(dispatch);
          }
          dispatch(gisLayersReceived(response));

          // -- make multiple requests if more features available
          if (response[0].nextPageURL) {
            // -- slow down request frequency if features are not getting returned (ie. timeouts are occurring)
            var timeout = response[0].features.length === 0 ? 5000 : 10;
            (0, _setTimeout2["default"])(function () {
              getSubsequentGISLayers(serviceLayerId, response[0].features, response[0].nextPageURL, dispatch);
            }, timeout);
          } else {
            var _requestIndex = (0, _indexOf["default"])(currentRequestList).call(currentRequestList, serviceLayerId);
            (0, _splice["default"])(currentRequestList).call(currentRequestList, _requestIndex, 1);

            // -- call next gis layer request
            endRequest(dispatch);
          }
        });
      });
    };
  }
};
exports.getGISLayers = getGISLayers;
var getSubsequentGISLayers = function getSubsequentGISLayers(serviceLayerId, prevFeatures, nextPageURL, dispatch) {
  _clientAppCore.restClient.exec_get(nextPageURL, function (err, response) {
    var _context5;
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
    var layerIndex = (0, _indexOf["default"])(cancelRequestList).call(cancelRequestList, serviceLayerId);
    if (layerIndex > -1) {
      (0, _splice["default"])(cancelRequestList).call(cancelRequestList, layerIndex, 1);
      var requestIndex = (0, _indexOf["default"])(currentRequestList).call(currentRequestList, serviceLayerId);
      (0, _splice["default"])(currentRequestList).call(currentRequestList, requestIndex, 1);

      // -- call next gis layer request
      return endRequest(dispatch);
    }

    // -- merge all previous features together
    response[0].features = (0, _concat["default"])(_context5 = response[0].features).call(_context5, prevFeatures);
    dispatch(gisLayersReceived(response));

    // -- make multiple requests if more features available
    if (response[0].nextPageURL) {
      // -- slow down request frequency if features are not getting returned (ie. timeouts are occurring)
      var timeout = response[0].features.length === 0 ? 5000 : 10;
      (0, _setTimeout2["default"])(function () {
        getSubsequentGISLayers(serviceLayerId, response[0].features, response[0].nextPageURL, dispatch);
      }, timeout);
    } else {
      var _requestIndex2 = (0, _indexOf["default"])(currentRequestList).call(currentRequestList, serviceLayerId);
      (0, _splice["default"])(currentRequestList).call(currentRequestList, _requestIndex2, 1);

      // -- call next gis layer request
      endRequest(dispatch);
    }
  });
};
var endRequest = function endRequest(dispatch) {
  // -- check for queued requests after current request is completed/canceled
  currentlyRequesting = false;
  if (layerRequestQueue.length > 0) {
    var _layerRequestQueue$sh = layerRequestQueue.shift().split(","),
      _layerRequestQueue$sh2 = (0, _slicedToArray2["default"])(_layerRequestQueue$sh, 2),
      serviceId = _layerRequestQueue$sh2[0],
      layerIds = _layerRequestQueue$sh2[1];
    dispatch(getGISLayers(serviceId, layerIds));
  }
};
var currentRequestList = [];
var cancelRequestList = [];
var turnOffGISLayer = function turnOffGISLayer(serviceId, layerId) {
  var _context6;
  var serviceLayerId = serviceId + "-" + layerId;

  // -- Only need to turn off if the layer is currently being requested
  if ((0, _includes["default"])(currentRequestList).call(currentRequestList, serviceLayerId)) {
    cancelRequestList.push(serviceLayerId);
  }

  // -- remove request if present and layer turned off
  var requestIndex = (0, _indexOf["default"])(layerRequestQueue).call(layerRequestQueue, (0, _concat["default"])(_context6 = "".concat(serviceId, ",")).call(_context6, layerId));
  if (requestIndex > -1) {
    (0, _splice["default"])(layerRequestQueue).call(layerRequestQueue, requestIndex, 1);
  }
};

/**
 * Update GIS service in state
 * @param {string} serviceId
 * @param {Object} update
 */
exports.turnOffGISLayer = turnOffGISLayer;
var gisServiceReceived = function gisServiceReceived(serviceId, update) {
  return {
    type: t.GIS_SERVICE_RECEIVED,
    payload: {
      serviceId: serviceId,
      update: update
    }
  };
};

/**
 * Update GIS service in DB
 * @param {string} serviceId
 * @param {Object} update
 */
var updateGISService = function updateGISService(serviceId, update) {
  return function (dispatch) {
    var body = (0, _stringify["default"])({
      update: update
    });
    _clientAppCore.restClient.exec_put("/gis-app/api/gis-services/".concat(serviceId), body, function (err, response) {
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
exports.updateGISService = updateGISService;
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
var deleteGISService = function deleteGISService(serviceId) {
  return function (dispatch) {
    _clientAppCore.restClient.exec_delete("/gis-app/api/gis-services/".concat(serviceId), function (err, response) {
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
exports.deleteGISService = deleteGISService;
var updateVisibleGIS = function updateVisibleGIS(app, serviceId, update) {
  return function (dispatch, getState) {
    var gisState = _objectSpread({}, getState().appState.persisted.gisState) || {};
    gisState[serviceId] = _objectSpread(_objectSpread({}, gisState[serviceId]), update);
    dispatch((0, _Actions.setLocalAppState)("gisState", gisState));
    _clientAppCore.userService.setAppState(app, (0, _defineProperty2["default"])({}, "gisState", (0, _defineProperty2["default"])({}, serviceId, update)), function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
};
exports.updateVisibleGIS = updateVisibleGIS;