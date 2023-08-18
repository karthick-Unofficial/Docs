"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var NewWindowWrapper = function NewWindowWrapper(_ref) {
  var children = _ref.children,
    styles = _ref.styles;
  var sendMessage = function sendMessage(message) {
    // Append the window.name (The ID you spawn the window with when using "orion-components/NewWindow")
    // to ensure we only accept messages from the window we expect to receive them from
    var messageData = {
      id: window.name,
      payload: message
    };

    // eslint-disable-next-line no-restricted-globals
    opener.postMessage(messageData, opener.origin);
  };

  // After mount
  (0, _react.useEffect)(function () {
    // Send a message to remove the event handler on refresh/close
    window.onbeforeunload = function () {
      sendMessage("exit");
    };
  }, []);

  // Add a message handler from the child component
  var addMessageHandler = function addMessageHandler(callback) {
    var handleMessage = function handleMessage(event) {
      if (event.origin !== window.location.origin || !event.data.id || event.data.id !== window.name) {
        return;
      }
      callback(event.data);
    };
    window.addEventListener("message", handleMessage, false);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles
  }, /*#__PURE__*/_react["default"].cloneElement(children, {
    addMessageHandler: addMessageHandler,
    sendMessage: sendMessage
  }));
};
var _default = NewWindowWrapper;
exports["default"] = _default;