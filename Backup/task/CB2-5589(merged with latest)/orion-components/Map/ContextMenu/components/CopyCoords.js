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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ContextMenu = require("orion-components/Map/ContextMenu");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  lngLat: _propTypes["default"].object.isRequired,
  coordsCopied: _propTypes["default"].func.isRequired
};
var CopyCoords = function CopyCoords(_ref) {
  var lngLat = _ref.lngLat,
    coordsCopied = _ref.coordsCopied;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    showFeedback = _useState2[0],
    setShowFeedback = _useState2[1];
  var copyCoordsToClipboard = function copyCoordsToClipboard() {
    var _context;
    navigator.clipboard.writeText((0, _concat["default"])(_context = "".concat(lngLat.lat, ", ")).call(_context, lngLat.lng));
    (0, _setTimeout2["default"])(function () {
      // A slight delay here looks better for feedback
      setShowFeedback(true);
    }, 200);

    // Show feedback briefly before closing context menu
    (0, _setTimeout2["default"])(function () {
      coordsCopied();
      setShowFeedback(false);
    }, 3000);
  };
  return /*#__PURE__*/_react["default"].createElement(_ContextMenu.ContextMenuItem, {
    onClick: function onClick() {
      return copyCoordsToClipboard();
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.contextMenu.copyCoords.label"
  }), showFeedback && /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.contextMenu.copyCoords.feedback"
  })));
};
CopyCoords.propTypes = propTypes;
var _default = CopyCoords;
exports["default"] = _default;