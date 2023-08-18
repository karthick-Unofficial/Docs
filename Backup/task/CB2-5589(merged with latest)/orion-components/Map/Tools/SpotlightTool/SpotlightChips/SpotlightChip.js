"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _SharedComponents = require("orion-components/SharedComponents");
var _NewWindow = require("orion-components/NewWindow");
var _getCameras = require("./getCameras");
var _clientAppCore = require("client-app-core");
var _center = _interopRequireDefault(require("@turf/center"));
var _helpers = require("orion-components/Map/helpers");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var SpotlightChip = function SpotlightChip(_ref) {
  var spotlight = _ref.spotlight,
    index = _ref.index,
    handleClick = _ref.handleClick,
    cameras = _ref.cameras,
    setSpotlight = _ref.setSpotlight,
    user = _ref.user,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    windowRef = _useState2[0],
    setWindowRef = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    mounted = _useState4[0],
    setMounted = _useState4[1];
  var id = spotlight.id,
    geometry = spotlight.geometry,
    properties = spotlight.properties;
  var strokeColor = properties.strokeColor;
  var handleClose = (0, _react.useCallback)(function () {
    handleClick({
      id: id
    });
    _clientAppCore.spotlightService["delete"](id, function (err) {
      if (err) {
        console.log("Unable to end Spotlight session", err);
      } else {
        if (windowRef) {
          windowRef.close();
        }
      }
    });
  }, [windowRef, id]);
  (0, _react.useEffect)(function () {
    setMounted(true);
  }, []);
  if (mounted) {
    var _context;
    var initialCameras = (0, _getCameras.getCameras)(spotlight, cameras);
    var windowReference = new _NewWindow.NewWindow({
      url: "".concat(window.location.origin, "/map-app/#/spotlight"),
      id: spotlight.id,
      data: {
        windowTitle: "Spotlight ".concat(index + 1),
        spotlightColor: strokeColor,
        spotlightTitleColor: "#FFF",
        initialCameras: initialCameras,
        user: user
      },
      properties: (0, _concat["default"])(_context = "width=".concat(window.innerWidth - 200, ",height=")).call(_context, window.innerHeight - 100, ",left=0,top=0")
    });
    windowReference.listen(window, window.location.origin, function (err, message) {
      if (err) {
        console.log("ERROR", err);
      } else {
        var payload = message.payload;
        if (payload && payload.selectedCamera) {
          var newCamera = cameras[payload.selectedCamera];
          var spotlightShape = newCamera.spotlightShape,
            entityData = newCamera.entityData;
          var newSpotlight = _objectSpread({}, spotlight);
          if (newCamera.spotlightShape) {
            newSpotlight.geometry = spotlightShape.geometry;
          } else {
            newSpotlight.geometry = (0, _helpers.getSpotlight)({
              center: (0, _center["default"])(entityData.geometry)
            }).geometry;
          }
          dispatch(setSpotlight(newSpotlight));
        }
        if (payload && payload === "exit") {
          handleClose();
        }
      }
    });
    setWindowRef(windowReference);
    setMounted(false);
  }
  (0, _react.useEffect)(function () {
    if (windowRef) {
      var newCameras = (0, _getCameras.getCameras)(spotlight, cameras);
      _clientAppCore.spotlightService.update(id, spotlight, function (err) {
        if (err) {
          console.log("There was an error updating the spotlight", err);
        } else {
          windowRef.sendMessage({
            cameras: newCameras
          }, "".concat(window.location.origin, "/map-app/#/spotlight"));
        }
      });
    }
    return function () {};
  }, [geometry, windowRef]);
  var styles = {
    chip: _objectSpread(_objectSpread({
      backgroundColor: strokeColor
    }, dir === "ltr" && {
      marginRight: 8
    }), dir === "rtl" && {
      marginLeft: 8
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Chip, {
    label: (0, _i18n.getTranslation)("global.map.tools.spotlightTool.spotlightChip.spotlight", index + 1),
    style: styles.chip,
    avatar: /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
      style: {
        backgroundColor: strokeColor
      }
    }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      geometry: geometry
    })),
    onDelete: handleClose,
    onClick: function onClick() {
      return handleClick({
        spotlight: spotlight
      });
    }
  });
};
var _default = SpotlightChip;
exports["default"] = _default;