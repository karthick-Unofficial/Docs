"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var NewWindow = /*#__PURE__*/function () {
  /**
   * @param {object} config {
   * 		@param {string} url - The url of the page you'd like to open in the new window
   * 		@param {string} id - Unique ID for your window
   * 		@param {object} data - Any data you'd like the new window to have access to via window.cbProps
   * 		@param {string} properties - Special string used by the new window for styling and other properties
   * }
   */
  function NewWindow(config) {
    (0, _classCallCheck2["default"])(this, NewWindow);
    var url = config.url,
      id = config.id,
      data = config.data,
      properties = config.properties;

    // Create and store reference to window
    this.windowRef = window.open(url, id, properties);
    this.id = id;
    this.sendMessages = true;

    // Set data for use by window
    this.windowRef.cbProps = data;
  }

  /**
   * Send a message to a spawned window
   * @param {any} data - Data to send to spawned window
   * @param {string} uri - URI you are sending the message to
   */
  (0, _createClass2["default"])(NewWindow, [{
    key: "sendMessage",
    value: function sendMessage(data, uri) {
      // We always append the id of the opened window to the sent data
      // to ensure we only accept the data we're expecting
      var messageData = {
        id: this.id,
        payload: data
      };
      this.windowRef.postMessage(messageData, uri);
    }

    /**
     * Listen for messages from a specific window
     * @param {object} sourceWindow - window object from source page
     * @param {string} origin - URI you expect messages to come from
     * @param {function} callback
     */
  }, {
    key: "listen",
    value: function listen(sourceWindow, origin, callback) {
      var _this = this;
      // Message event handler
      var handleMessage = function handleMessage(event) {
        // Do not accept messages from unwanted sites
        if (event.origin !== origin || !event.data.id || event.data.id !== _this.id) {
          return;
        }

        // When the child window sends across an 'exit' message
        // This should happen in the onbeforeunload event in the child window
        // which covers both refreshes and exits
        if (event.data.payload === "exit") {
          // Remove the event listener from the parent window
          sourceWindow.removeEventListener("message", handleMessage, false);

          // Kill the child window
          _this.windowRef.close();
        }
        if (_this.sendMessages) {
          callback(null, event.data);
        }
      };

      // Listen for messages from parent window
      sourceWindow.addEventListener("message", handleMessage, false);

      // When parent window closes or refreshes, kill the child window
      sourceWindow.addEventListener("beforeunload", function () {
        _this.sendMessages = false;
        _this.windowRef.close();
      });
    }

    /**
     * Close the spawned window
     */
  }, {
    key: "close",
    value: function close() {
      this.windowRef.close();
    }
  }]);
  return NewWindow;
}();
var _default = NewWindow;
exports["default"] = _default;