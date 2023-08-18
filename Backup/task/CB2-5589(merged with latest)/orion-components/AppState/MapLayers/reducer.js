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
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _concat = _interopRequireDefault(require("lodash/concat"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _pull = _interopRequireDefault(require("lodash/pull"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialMapLayersState = {
  disabledFeeds: [],
  layerOpacity: 1,
  nauticalChartLayerOpacity: 1,
  roadAndLabelLayerOpacity: 1,
  weatherRadarLayerOpacity: 1,
  ssrRadarLayerOpacity: 1,
  activeCameraFOVs: []
};
var mapLayers = function mapLayers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialMapLayersState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "TOGGLE_FEED":
      {
        var feedId = payload.feedId;
        var disabled = (0, _toConsumableArray2["default"])(state.disabledFeeds);
        (0, _includes["default"])(disabled, feedId) ? (0, _pull["default"])(disabled, feedId) : disabled = (0, _concat["default"])(disabled, feedId);
        return _objectSpread(_objectSpread({}, state), {}, {
          disabledFeeds: disabled
        });
      }
    default:
      return state;
  }
};
var _default = mapLayers;
exports["default"] = _default;