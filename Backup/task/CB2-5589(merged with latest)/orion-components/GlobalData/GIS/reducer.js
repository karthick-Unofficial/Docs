"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialGISState = {
  services: {},
  layers: {},
  error: "",
  success: false,
  isFetching: false
};
var gisData = function gisData() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialGISState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "GIS_DATA_RECEIVED":
      {
        var data = payload.data;
        var update = (0, _keyBy["default"])(data, function (datum) {
          return datum.id;
        });
        return _objectSpread(_objectSpread({}, state), update);
      }
    case "GIS_SERVICES_RECEIVED":
      {
        var services = payload.services;
        var _update = (0, _keyBy["default"])(services, "id");
        return _objectSpread(_objectSpread({}, state), {}, {
          services: _objectSpread(_objectSpread({}, state.services), _update),
          error: ""
        });
      }
    case "CREATE_SERVICE_REQUEST":
      return _objectSpread(_objectSpread({}, state), {}, {
        isFetching: true,
        error: ""
      });
    case "CREATE_SERVICE_SUCCESS":
      {
        var service = payload.service;
        var _update2 = (0, _defineProperty2["default"])({}, service.id, service);
        return _objectSpread(_objectSpread({}, state), {}, {
          services: _objectSpread(_objectSpread({}, state.services), _update2),
          error: "",
          isFetching: false,
          success: true
        });
      }
    case "CREATE_SERVICE_FAILURE":
      {
        var error = payload.error;
        return _objectSpread(_objectSpread({}, state), {}, {
          error: error,
          isFetching: false
        });
      }
    case "CREATE_SERVICE_RESET":
      return _objectSpread(_objectSpread({}, state), {}, {
        error: "",
        isFetching: false,
        success: false
      });
    case "GIS_LAYERS_RECEIVED":
      {
        var layers = payload.layers;
        var _update4 = (0, _keyBy["default"])(layers, "id");
        return _objectSpread(_objectSpread({}, state), {}, {
          layers: _objectSpread(_objectSpread({}, state.layers), _update4),
          error: ""
        });
      }
    case "GIS_SERVICE_RECEIVED":
      {
        var serviceId = payload.serviceId,
          _update5 = payload.update;
        var newServices = _objectSpread({}, state.services);
        newServices[serviceId] = _update5;
        return _objectSpread(_objectSpread({}, state), {}, {
          services: newServices
        });
      }
    case "GIS_SERVICE_REMOVED":
      {
        var _serviceId = payload.serviceId;
        var _newServices = _objectSpread({}, state.services);
        var newLayers = (0, _pickBy["default"])(state.layers, function (layer) {
          return layer.serviceId !== _serviceId;
        });
        delete _newServices[_serviceId];
        return _objectSpread(_objectSpread({}, state), {}, {
          services: _newServices,
          layers: newLayers
        });
      }
    default:
      return state;
  }
};
var _default = gisData;
exports["default"] = _default;