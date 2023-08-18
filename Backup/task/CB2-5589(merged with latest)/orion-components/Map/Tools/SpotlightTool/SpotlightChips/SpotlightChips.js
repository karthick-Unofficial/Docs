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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _SpotlightChip = _interopRequireDefault(require("./SpotlightChip"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./spotlightChipsActions.js"));
var _selector = require("orion-components/i18n/Config/selector");
var _Selectors = require("orion-components/GlobalData/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var SpotlightChips = function SpotlightChips() {
  var _context, _context2, _context3;
  var dispatch = (0, _reactRedux.useDispatch)();
  var removeSpotlight = actionCreators.removeSpotlight,
    setMapTools = actionCreators.setMapTools,
    setSpotlight = actionCreators.setSpotlight;
  var spotlights = (0, _reactRedux.useSelector)(function (state) {
    return state.spotlights;
  });
  var mapTools = (0, _reactRedux.useSelector)(function (state) {
    var _state$mapState;
    return (_state$mapState = state.mapState) === null || _state$mapState === void 0 ? void 0 : _state$mapState.mapTools;
  }, _reactRedux.shallowEqual);
  var user = (0, _reactRedux.useSelector)(function (state) {
    var _state$session;
    return (_state$session = state.session) === null || _state$session === void 0 ? void 0 : _state$session.user.profile;
  }, _reactRedux.shallowEqual);
  var cameras = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.feedEntitiesWithGeoByTypeSelector)("camera")(state);
  }, _reactRedux.shallowEqual);
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var handleClick = (0, _react.useCallback)(function (_ref) {
    var id = _ref.id,
      spotlight = _ref.spotlight;
    var type = mapTools.type,
      feature = mapTools.feature;
    if (id) {
      dispatch(removeSpotlight(id));
    } else if (type === "spotlight") {
      dispatch(setSpotlight(feature));
      dispatch(setMapTools({
        type: null
      }));
    } else {
      dispatch(setMapTools({
        type: "spotlight",
        mode: "spotlight_mode",
        feature: spotlight
      }));
    }
  }, [mapTools]);
  return (0, _filter["default"])(_context = (0, _values["default"])(spotlights)).call(_context, function (spotlight) {
    return !!spotlight;
  }).length ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _map["default"])(_context2 = (0, _filter["default"])(_context3 = (0, _values["default"])(spotlights)).call(_context3, function (spotlight) {
    return !!spotlight;
  })).call(_context2, function (spotlight, index) {
    return /*#__PURE__*/_react["default"].createElement(_SpotlightChip["default"], {
      key: spotlight.id,
      index: index,
      spotlight: spotlight,
      handleClick: handleClick,
      cameras: cameras,
      setSpotlight: setSpotlight,
      user: user,
      dir: dir
    });
  })) : null;
};
var _default = SpotlightChips;
exports["default"] = _default;