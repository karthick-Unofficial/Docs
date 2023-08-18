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
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  children: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].node), _propTypes["default"].node]).isRequired,
  id: _propTypes["default"].string.isRequired,
  title: _propTypes["default"].string.isRequired,
  windowStyle: _propTypes["default"].string.isRequired,
  onWindowClose: _propTypes["default"].func.isRequired
};
var defaultProps = {
  children: /*#__PURE__*/_react["default"].createElement("div", null),
  id: "1",
  title: (0, _i18n.getTranslation)("global.CBComponents.CBNewWindow.newWindow"),
  windowStyle: "width=600,height=600,left=0,top=0",
  onWindowClose: function onWindowClose() {}
};
var WindowPortal = function WindowPortal(_ref) {
  var id = _ref.id,
    windowStyle = _ref.windowStyle,
    title = _ref.title,
    onWindowClose = _ref.onWindowClose,
    children = _ref.children;
  var containerElement = document.createElement("div");
  var windowReference = null;
  (0, _react.useEffect)(function () {
    windowReference = window.open("", id, windowStyle);

    // Copy CSS styling from the source document to the document generated in the new window
    enableStyling(document, windowReference.document);

    // Set title
    windowReference.document.title = title;

    // Append container
    windowReference.document.body.appendChild(containerElement);

    // Call provided function when window is manually closed
    windowReference.onbeforeunload = function () {
      onWindowClose();
    };
    return function () {
      // Call provided function when unmounting
      onWindowClose();
      // Close window
      windowReference.close();
    };
  }, []);
  return /*#__PURE__*/_reactDom["default"].createPortal(children, containerElement);
};

/**
 * Copy CSS styling from a source document to a target document
 * @param {object} document - Document from source
 * @param {object} windowDocument - Document from newly generated window
 */
var enableStyling = function enableStyling(document, windowDocument) {
  // Convert array-like object into array
  var documentStyleArray = (0, _toConsumableArray2["default"])(document.styleSheets);
  (0, _forEach["default"])(documentStyleArray).call(documentStyleArray, function (stylesheet) {
    // style tags
    if (stylesheet.cssRules) {
      var element = document.createElement("style");

      // Convert array-like object into array
      var cssRules = (0, _toConsumableArray2["default"])(stylesheet.cssRules);

      // Add css rules to the body of a style element
      (0, _forEach["default"])(cssRules).call(cssRules, function (rule) {
        element.appendChild(document.createTextNode(rule.cssText));
      });

      // Append the element to the head of the new window
      windowDocument.head.appendChild(element);
    }
    // link tags
    else if (stylesheet.href) {
      // Create link tag
      var _element = document.createElement("link");

      // Set relevant properties
      _element.rel = "stylesheet";
      _element.href = stylesheet.href;

      // Append the element to the head of the new window
      windowDocument.head.appendChild(_element);
    }
  });
};
WindowPortal.propTypes = propTypes;
WindowPortal.defaultProps = defaultProps;
var _default = WindowPortal;
exports["default"] = _default;