"use strict";

var _Reflect$construct = require("@babel/runtime-corejs3/core-js-stable/reflect/construct");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));
var _apmRum = require("@elastic/apm-rum");
var _apmRumCore = require("@elastic/apm-rum-core");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Check if the given component is class based component
 * ex: class Component extends React.Component
 *
 * React internally uses this logic to check if it has to call new Component or Component
 * to decide between functional and class based components
 * https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L297-L300
 */
function isReactClassComponent(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

/**
 * Usage:
 *  - Pure function: `withTransaction('name','route-change')(Component)`
 *  - As a decorator: `@withTransaction('name','route-change')`
 */
// then config to not include render or a "logLevel" of sorts - instrumentLevel
function withSpan(name, type) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  return function (Component) {
    if (!_apmRum.apm.isActive()) {
      return Component;
    }
    if (!Component) {
      var loggingService = _apmRum.apm.serviceFactory.getService("LoggingService");
      loggingService.warn("".concat(name, " is not instrumented since component property is not provided"));
      return Component;
    }
    var ApmComponent = null;
    /**
     * In react, there are two recommended ways to instantiate network requests inside components
     *  - in componentDidMount lifecycle which happens before rendering the component
     *  - useEffect hook which is supported in react > 16.7.x versions
     *
     * Since we are wrapping the underlying component that renders the route, We have to
     * account for any network effects that happens inside these two methods to capture those
     * requests as spans in the route-change transaction
     *
     * Parent component's componentDidMount and useEffect are always called after child's cDM and
     * effects are called (Ordering is preserved). So we check for our transaction finish
     * logic inside these methods to make sure we are capturing the span information
     */
    if (!isReactClassComponent(Component) && typeof _react["default"].useEffect === "function" && typeof _react["default"].useState === "function") {
      ApmComponent = function ApmComponent(props) {
        /**
         * We start the transaction as soon as the ApmComponent gets rendered
         * so that we can capture all the effects inside child components
         *
         * The reason why we have this transaction inside setState is that we don't
         * want this piece of code to run on every render instead we want to
         * start the transaction only on component mounting
         */

        var _React$useState = _react["default"].useState(null),
          _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
          span = _React$useState2[0],
          setSpan = _React$useState2[1];
        var currentTxn = _apmRum.apm.getCurrentTransaction();
        if (!span && currentTxn) {
          var s = currentTxn.startSpan(name, type, {
            blocking: true
          });
          callback(s, props);
          setSpan(s);
        }

        /**
         * React guarantees the parent component effects are run after the child components effects
         * So once all the child components effects are run, we run the detectFinish logic
         * which ensures if the transaction can be completed or not.
         */
        // -- unless unloaded this is called only once as it is a wrapper component so itself has no rerender
        // -- which does not work for wanting to capture every render in a component if rather than a wrapper
        // -- we include the component in...no that would still reference that component
        // -- so need to hook into the component that is passed itself or bubble up to parent
        // -- IT IS GETTING INTO RENDER EVERY TIME JUST NOT USE EFFECT
        _react["default"].useEffect(function () {
          (0, _apmRumCore.afterFrame)(function () {
            if (span) {
              span.end();
              setSpan(null);
            }
          });
          return function () {
            /**
             * Incase the transaction is never ended, we check if the transaction
             * can be closed during unmount phase
             *
             * We call detectFinish instead of forcefully ending the transaction
             * since it could be a redirect route and we might prematurely close
             * the currently running transaction
             */
            if (span) {
              span.end();
              setSpan(null);
            }
          };
        }, []);
        return /*#__PURE__*/_react["default"].createElement(Component, (0, _extends2["default"])({
          span: span
        }, props));
      };
    } else {
      ApmComponent = /*#__PURE__*/function (_React$Component) {
        (0, _inherits2["default"])(ApmComponent, _React$Component);
        var _super = _createSuper(ApmComponent);
        function ApmComponent(props) {
          var _this;
          (0, _classCallCheck2["default"])(this, ApmComponent);
          _this = _super.call(this, props);
          /**
           * We need to start the span in constructor because otherwise,
           * we won't be able to capture what happens in componentDidMount of child
           * components since the parent component is mounted after child
           */
          var currentTxn = _apmRum.apm.getCurrentTransaction();
          if (currentTxn) {
            _this.span = currentTxn.startSpan(name, type);
          }
          callback(_this.span, props);
          return _this;
        }
        (0, _createClass2["default"])(ApmComponent, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            /**
             * React guarantees the parent CDM runs after the child components CDM
             */
            if (this.span) {
              this.span.end();
            }
          }
        }, {
          key: "render",
          value: function render() {
            return /*#__PURE__*/_react["default"].createElement(Component, (0, _extends2["default"])({
              apm: this,
              span: this.span
            }, this.props));
          }
        }]);
        return ApmComponent;
      }(_react["default"].Component);
    }
    ApmComponent.displayName = "withSpan(".concat(Component.displayName || Component.name, ")");
    ApmComponent.WrappedComponent = Component;
    return (0, _hoistNonReactStatics["default"])(ApmComponent, Component);
  };
}
var _default = withSpan;
exports["default"] = _default;