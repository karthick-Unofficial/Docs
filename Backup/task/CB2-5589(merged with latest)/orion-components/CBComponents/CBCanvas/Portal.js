"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _reactDom = _interopRequireDefault(require("react-dom"));
var Portal = function Portal(props) {
  var node = props.node,
    children = props.children;
  var el = document.createElement("div");
  (0, _react.useEffect)(function () {
    node.appendChild(el);
    return function () {
      node.removeChild(el);
    };
  }, []);
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (prevProps && node !== prevProps.node) {
      prevProps.node.removeChild(el);
      node.appendChild(el);
    }
  }, [props]);
  return /*#__PURE__*/_reactDom["default"].createPortal(children, el);
};
var _default = Portal;
exports["default"] = _default;