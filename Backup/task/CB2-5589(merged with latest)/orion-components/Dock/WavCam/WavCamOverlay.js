"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys3 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _WavCamHelper = _interopRequireDefault(require("./WavCamHelper"));
var _SharedComponents = require("orion-components/SharedComponents");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys3(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  containerStyle: {
    height: "100%",
    width: "100%",
    margin: "auto"
  },
  containerStyleHidden: {
    height: "100%",
    width: "100%",
    margin: "auto",
    display: "none"
  }
};
var WavCamOverlay = function WavCamOverlay(_ref, ref) {
  var imageMetadata = _ref.imageMetadata,
    fovItems = _ref.fovItems,
    visible = _ref.visible;
  var canvasContainerRef = _react["default"].useRef();
  var canvasRef = _react["default"].useRef();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    fovEntities = _useState2[0],
    setFovEntities = _useState2[1];
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      refresh: function refresh(metadata) {
        renderOverlay(metadata);
      }
    };
  });
  (0, _react.useEffect)(function () {
    renderOverlay();
    return function cleanup() {
      //	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
    };
  }, [imageMetadata, fovItems]);
  var renderOverlay = function renderOverlay(metadata) {
    var md = metadata || imageMetadata;
    if (!md) return;
    if (md && fovItems) {
      var helper = new _WavCamHelper["default"](md);
      var canvas = canvasRef.current;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "Bold 8pt Roboto";
      var winW = (0, _parseInt2["default"])(md["wav-image-w"]);
      var winH = (0, _parseInt2["default"])(md["wav-image-h"]);
      var offsetX = (0, _parseInt2["default"])(md["wav-container-offset-x"]);
      var offsetY = (0, _parseInt2["default"])(md["wav-container-offset-y"]);
      var containerW = (0, _parseInt2["default"])(md["wav-container-w"]);
      var containerH = (0, _parseInt2["default"])(md["wav-container-h"]);
      var containerX = (0, _parseInt2["default"])(md["wav-container-x"]);
      var containerY = (0, _parseInt2["default"])(md["wav-container-y"]);
      var containerBaseH = (0, _parseInt2["default"])(md["wav-container-base-h"]);
      canvasRef.current.width = containerW;
      canvasRef.current.height = containerH;
      canvasRef.current.style.width = canvasContainerRef.current.style.width = containerW + "px";
      canvasRef.current.style.height = canvasContainerRef.current.style.height = containerH + "px";
      canvasRef.current.style.left = canvasContainerRef.current.style.left = containerX + "px";
      canvasRef.current.style.top = canvasContainerRef.current.style.top = containerY + "px";
      var tempFovEntities = [];
      if (fovItems) {
        for (var _i = 0, _Object$keys = (0, _keys["default"])(fovItems); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          var item = fovItems[key];
          var entityData = item.entityData;
          var geometry = entityData.geometry;
          var _entityData$propertie = entityData.properties,
            name = _entityData$propertie.name,
            sourceId = _entityData$propertie.sourceId;
          var displayName = name || sourceId;
          if (displayName) {
            var azEl = helper.convertLatLonToAzEl(geometry.coordinates[1], geometry.coordinates[0]);
            var percentXY = helper.convertAzElToPercentXY(azEl[0], azEl[1]);
            var x = winW * percentXY[0] - offsetX;
            var y = winH * percentXY[1] + offsetY;
            var labelOffsetX = 30;
            var labelOffsetY = -5;

            // add width and height
            var targetW = 24;
            var targetH = 24;
            tempFovEntities.push(_objectSpread(_objectSpread({}, item), {
              width: targetW,
              height: targetH,
              left: x - targetW / 2 - 3,
              top: y - targetH,
              targetingOffsetY: containerBaseH
            }));
            var text = ctx.measureText(displayName.toUpperCase());
            ctx.fillStyle = "#ffffffcc";
            ctx.fillRect(x - 5 + labelOffsetX, y - 12 + labelOffsetY, text.width + 10, 16);
            ctx.fillStyle = "black";
            ctx.fillText(displayName.toUpperCase(), x + labelOffsetX, y + labelOffsetY);
          }
        }
        setFovEntities(tempFovEntities);
      }
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: visible ? styles.containerStyle : styles.containerStyleHidden,
    ref: canvasContainerRef
  }, /*#__PURE__*/_react["default"].createElement("canvas", {
    ref: canvasRef
  }), (0, _map["default"])(fovEntities).call(fovEntities, function (item) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: item.id,
      style: {
        position: "absolute",
        top: "".concat(item.top, "px"),
        left: "".concat(item.left, "px"),
        width: "".concat(item.width, "px"),
        height: "".concat(item.height, "px"),
        display: visible ? "block" : "none"
      }
    }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      key: item.id,
      feedId: item.feedId,
      id: item.id,
      geometry: item.entityData.geometry,
      config: {
        xOffset: 0,
        yOffset: item.targetingOffsetY
      }
    }));
  }));
};
var fwdRefWavCamOverlay = /*#__PURE__*/(0, _react.forwardRef)(WavCamOverlay);
var _default = fwdRefWavCamOverlay;
exports["default"] = _default;