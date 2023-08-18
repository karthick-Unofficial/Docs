"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = requireAuthentication;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function requireAuthentication(Component) {
  var Authenticate = function Authenticate(props) {
    var isAuthenticated = props.isAuthenticated;
    var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      mounted = _useState2[0],
      setMounted = _useState2[1];
    (0, _react.useEffect)(function () {
      checkAuth(props);
    }, [props]);
    (0, _react.useEffect)(function () {
      setMounted(true);
    }, []);

    // shouldComponentUpdate(nextProps) {
    // 	return true;
    // }

    var checkAuth = function checkAuth() {
      if (!isAuthenticated) {
        window.location = "/login";
        // -- if we were using react-router could be something like this
        //let redirectAfterLogin = this.props.location.pathname
        //this.props.dispatch(pushState(null, `/auth-app/index.html?next=${redirectAfterLogin}`))
      }
    };

    if (!mounted) {
      checkAuth(props);
      setMounted(true);
    }
    var component = isAuthenticated ? /*#__PURE__*/_react["default"].createElement(Component, props) : /*#__PURE__*/_react["default"].createElement("div", null);
    return component;
  };
  var mapStateToProps = function mapStateToProps(state) {
    return {
      userName: state.session.identity.userId,
      isAuthenticated: state.session.identity.isAuthenticated
    };
  };
  return (0, _reactRedux.connect)(mapStateToProps)(Authenticate);
}