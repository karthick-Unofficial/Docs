"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Reflect$construct = require("@babel/runtime-corejs3/core-js-stable/reflect/construct");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _react = _interopRequireWildcard(require("react"));
var _apmRum = require("@elastic/apm-rum");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ErrorBoundary = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ErrorBoundary, _Component);
  var _super = _createSuper(ErrorBoundary);
  function ErrorBoundary(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ErrorBoundary);
    _this = _super.call(this, props);
    _this.state = {
      hasRenderError: false
    };
    return _this;
  }
  (0, _createClass2["default"])(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(e) {
      var _context, _context2;
      _apmRum.apm.captureError(e, {
        message: "component-error"
      });
      console.error("unstable_handleError", e);
      if (e instanceof TypeError && (0, _includes["default"])(_context = e.message).call(_context, "Cannot read property") && (0, _includes["default"])(_context2 = e.message).call(_context2, "of undefined")) {
        this.setState({
          hasRenderError: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasRenderError) {
        if (this.props.fallbackUI) {
          return /*#__PURE__*/_react["default"].createElement(this.props.fallbackUI, null);
        } else return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
          value: "global.errorBoundary.errorOccurred"
        }));
      } else {
        return this.props.children;
      }
    }
  }]);
  return ErrorBoundary;
}(_react.Component);
exports["default"] = ErrorBoundary;