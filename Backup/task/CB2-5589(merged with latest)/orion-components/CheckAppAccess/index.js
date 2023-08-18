"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = checkAppAccess;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function checkAppAccess(Component) {
  return function (appId) {
    var CheckAccess = function CheckAccess(props) {
      var _useState = (0, _react.useState)(false),
        _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
        canAccess = _useState2[0],
        setCanAccess = _useState2[1];
      var _useState3 = (0, _react.useState)(false),
        _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
        mounted = _useState4[0],
        setMounted = _useState4[1];
      (0, _react.useEffect)(function () {
        setMounted(true);
      }, []);

      // componentWillReceiveProps(nextProps) {
      // 	// this.checkAccess(appId);
      // }
      //Seems like this is'nt used anymore.

      var checkAccess = function checkAccess(appId) {
        _clientAppCore.userService.getCanAccessApp(appId, function (err, result) {
          if (err) {
            console.log(err);
            window.location = "/settings-app/my-account-settings";
          } else {
            if (result) {
              if (result.canView) {
                setCanAccess(true);
              } else {
                if (result.err) {
                  console.log(result.err.message);
                }
                window.location = "/settings-app/my-account-settings";
              }
            } else {
              window.location = "/settings-app/my-account-settings";
            }
          }
        });
      };
      if (!mounted) {
        // const appName = window.location.pathname.split('/')[1];
        checkAccess(appId);
        setMounted(true);
      }
      var component = canAccess ? /*#__PURE__*/_react["default"].createElement(Component, props) : /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          backgroundColor: "#2C2D2F"
        }
      });
      return component;
    };
    var mapStateToProps = function mapStateToProps(state) {
      return {
        userName: state.session.identity.userId,
        isAuthenticated: state.session.identity.isAuthenticated
      };
    };
    return CheckAccess;
  };
}