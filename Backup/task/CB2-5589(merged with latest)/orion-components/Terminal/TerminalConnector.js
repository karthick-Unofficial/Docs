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
var _codePointAt = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/code-point-at"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _xterm = require("xterm");
var _xtermAddonFit = require("xterm-addon-fit");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// An addon for xterm.js that enables fitting the terminal's dimensions to a containing element.
//import "xterm/css/xterm.css"; // Its a default styles for xterm.js, just to make it working explicitly copied content to scss/terminal-connector.scss

var propTypes = {
  ipAddress: _propTypes["default"].string.isRequired,
  userId: _propTypes["default"].string.isRequired
};
var TerminalConnector = function TerminalConnector(_ref) {
  var params = _ref.params;
  var ipAddress = params.ipAddress,
    userId = params.userId;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    processId = _useState2[0],
    setProcessId = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    logData = _useState4[0],
    setLogData = _useState4[1];
  var _useState5 = (0, _react.useState)(ipAddress),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    ipAddressState = _useState6[0],
    setIpAddressState = _useState6[1];
  var _useState7 = (0, _react.useState)(userId),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    userIdState = _useState8[0],
    setUserIdState = _useState8[1];
  var termElmRef = (0, _react.useRef)(null);
  var commandToSend = "";
  var term, termElm;
  (0, _react.useEffect)(function () {
    /*Steps: 
    1) Create new Terminal Instance which can attach itself to div element to display terminal message
    2) Get process id of new terminal object spawn at server and persist in state.
    3) Then subscribe to incoming data from terminal for given process id*/
    term = createNewTerminal(termElm);
    termElm = term;
    term.onData(sendData);
    commandToSend = "";
    _clientAppCore.terminalService.createTerminalSession(userIdState, ipAddressState, 0, 0, function (err, response) {
      if (err) {
        console.log(err);
      }
      if (!response) {
        return;
      }
      if (response) {
        var processIdTmp = response.pid;
        setProcessId(processIdTmp);
        _clientAppCore.terminalService.subscribeTerminalIncomingData(processIdTmp, function (errSub, responseSub) {
          if (errSub) {
            console.log(errSub);
          }
          if (!responseSub) {
            return;
          }
          if (responseSub) {
            //console.log(responseSub);
            setLogData(responseSub.message ? responseSub.message : responseSub);
          }
        });
      }
    });
    return function () {
      //close terminal instance for given process id.
      if (processId) {
        _clientAppCore.terminalService.closeTerminal(processId, function (err, res) {
          if (err) {
            console.log(err);
          }
          if (!res) {
            return;
          }
          if (res) {
            console.log(res.message);
          }
        });
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (processId) {
      term.write(logData);
    }
  }, [processId]);
  var createNewTerminal = function createNewTerminal(termElm) {
    var termNew = new _xterm.Terminal();
    var fitAddon = new _xtermAddonFit.FitAddon();
    termNew.setOption("cursorBlink", true);
    termNew.setOption("fontSize", 16);
    termNew.setOption("fontWeight", "normal");
    termNew.setOption("fontFamily", "Consolas");

    // Load Fit Addon
    termNew.loadAddon(fitAddon);

    // Open the terminal in Xterm component div i.e. terminal container.
    termNew.open(termElm); //term.open(document.getElementById("xterm"));

    // Make the terminal's size and geometry fit the size of Xterm component div i.e. terminal container.
    fitAddon.fit(); //todo: we should call fit() on resize of terminal div as well.

    return termNew;
  };
  var sendCommand = function sendCommand(processId, command) {
    _clientAppCore.terminalService.sendCommand(processId, command, function (err, response) {
      if (err) {
        console.log(err);
      }
      if (!response) {
        return;
      }
      if (response) {
        console.log(response.message);
      }
    });
  };
  var sendData = function sendData(data) {
    //console.log(data);
    var _char = data;
    if (_char === "\r") {
      //for enter character
      sendCommand(processId, commandToSend);
      commandToSend = "";
      term.writeln("");
    } else if ((0, _codePointAt["default"])(_char).call(_char, 0) === 127) {
      //Ascii value for backspace character is 127
      commandToSend = commandToSend.substring(0, commandToSend.length - 1);
      term.write("\b \b");
    } else if ((0, _codePointAt["default"])(_char).call(_char, 0) === 22) {
      //xterm is not allowing to paste using keyboard and instead display special character so use mouse to paste.
    } else {
      if (_char && _char !== undefined) {
        commandToSend += _char;
      }
      term.write(_char);
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "xterm",
    ref: termElmRef,
    style: {
      margin: 10,
      backgroundColor: "#2c2d2f",
      height: window.innerHeight - 10,
      width: window.innerWidth - 10
    }
  });
};
TerminalConnector.propTypes = propTypes;
var _default = TerminalConnector;
exports["default"] = _default;