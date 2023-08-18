"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _DistanceChip = _interopRequireDefault(require("./DistanceChip"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./distanceChipsActions.js"));
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DistanceChips = function DistanceChips() {
  var _context;
  var deletePath = actionCreators.deletePath,
    setActivePath = actionCreators.setActivePath;
  var distanceTool = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.distanceTool;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var paths = distanceTool.paths,
    activePath = distanceTool.activePath;
  return (0, _values["default"])(paths).length ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _map["default"])(_context = (0, _values["default"])(paths)).call(_context, function (path) {
    return /*#__PURE__*/_react["default"].createElement(_DistanceChip["default"], {
      key: path.id,
      path: path,
      activePath: activePath,
      deletePath: deletePath,
      setActivePath: setActivePath,
      dir: dir
    });
  })) : null;
};
var _default = DistanceChips;
exports["default"] = _default;