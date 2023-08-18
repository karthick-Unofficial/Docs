"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "Localize", {
  enumerable: true,
  get: function get() {
    return _Localize["default"];
  }
});
_Object$defineProperty(exports, "Translate", {
  enumerable: true,
  get: function get() {
    return _Translate["default"];
  }
});
exports["default"] = void 0;
_Object$defineProperty(exports, "getLocalize", {
  enumerable: true,
  get: function get() {
    return actions.getLocalize;
  }
});
_Object$defineProperty(exports, "getTranslation", {
  enumerable: true,
  get: function get() {
    return actions.getTranslation;
  }
});
_Object$defineProperty(exports, "supportedLocales", {
  enumerable: true,
  get: function get() {
    return _i18n.supportedLocales;
  }
});
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactReduxI18n = require("react-redux-i18n");
var _selector = require("./Config/selector");
var actions = _interopRequireWildcard(require("./Actions"));
var _reactRedux = require("react-redux");
var _i18n = require("./Config/i18n");
var _Translate = _interopRequireDefault(require("./Translate"));
var _Localize = _interopRequireDefault(require("./Localize"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  appId: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array])
};
var defaultProps = {
  children: []
};
var I18n = function I18n(_ref) {
  var appId = _ref.appId,
    children = _ref.children;
  var dispatch = (0, _reactRedux.useDispatch)();
  var store = (0, _reactRedux.useStore)();
  var initI18n = actions.initI18n;
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var authenticated = (0, _reactRedux.useSelector)(function (state) {
    return state.session.identity.isAuthenticated;
  });
  var ready = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n && state.i18n.translations && (0, _keys["default"])(state.i18n.translations).length > 0;
  });
  (0, _react.useEffect)(function () {
    dispatch(initI18n(appId, store));
    (0, _reactReduxI18n.syncTranslationWithStore)(store);
  }, []);
  (0, _react.useEffect)(function () {
    document.dir = dir;
  }, [dir]);
  return authenticated ? ready ? children : /*#__PURE__*/_react["default"].createElement("div", null) : children;
};
I18n.propTypes = propTypes;
I18n.defaultProps = defaultProps;
var _default = I18n;
exports["default"] = _default;