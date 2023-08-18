"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _mungeSDP = require("./mungeSDP");
var _stopPlay = _interopRequireDefault(require("./stopPlay"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
// Utilities

var repeaterRetryCount = 0;
var sessionId = "[empty]";
var getStreamInfo = function getStreamInfo(playSettings) {
  return {
    applicationName: playSettings.applicationName,
    streamName: playSettings.streamName,
    sessionId: sessionId
  };
};
var getUserData = function getUserData(playSettings) {
  return {
    param1: "value1"
  };
};

// PeerConnection Functions

var peerConnectionSetRemoteDescriptionSuccess = function peerConnectionSetRemoteDescriptionSuccess(description, playSettings, websocket, peerConnection, callbacks) {
  peerConnection.setLocalDescription(description).then(function () {
    websocket.send("{\"direction\":\"play\", \"command\":\"sendResponse\", \"streamInfo\":" + (0, _stringify["default"])(getStreamInfo(playSettings)) + ", \"sdp\":" + (0, _stringify["default"])(description) + ", \"userData\":" + (0, _stringify["default"])(getUserData(playSettings)) + "}");
  })["catch"](function (error) {
    var newError = _objectSpread({
      message: "Peer connection failed"
    }, error);
    peerConnectionOnError(newError, callbacks);
  });
};
var peerConnectionOnError = function peerConnectionOnError(error, callbacks) {
  console.log("peerConnectionOnError");
  console.log(error);
  if (callbacks.onError) callbacks.onError({
    message: "PeerConnection Error: " + error.message
  });
};

// Websocket Functions

var websocketOnOpen = function websocketOnOpen(playSettings, websocket, callbacks) {
  var peerConnection;
  try {
    peerConnection = new RTCPeerConnection();
    peerConnection.ontrack = function (event) {
      if (callbacks.onPeerConnectionOnTrack) callbacks.onPeerConnectionOnTrack(event);
    };
    peerConnection.onconnectionstatechange = function (event) {
      if (event.currentTarget.connectionState === "connected") {
        if (callbacks.onConnectionStateChange) callbacks.onConnectionStateChange({
          connected: true
        });
      } else {
        if (callbacks.onConnectionStateChange) callbacks.onConnectionStateChange({
          connected: false
        });
      }
    };
    websocket.addEventListener("message", function (event) {
      websocketOnMessage(event, playSettings, peerConnection, websocket, callbacks);
    });
    websocketSendPlayGetOffer(playSettings, websocket);
  } catch (e) {
    websocketOnError(e, callbacks);
  }
  if (callbacks.onSetPeerConnection) callbacks.onSetPeerConnection({
    peerConnection: peerConnection
  });
};
var websocketOnMessage = function websocketOnMessage(event, playSettings, peerConnection, websocket, callbacks) {
  var msgJSON = JSON.parse(event.data);
  var msgStatus = Number(msgJSON["status"]);
  if (msgStatus === 514)
    // repeater stream not ready
    {
      repeaterRetryCount++;
      if (repeaterRetryCount < 10) {
        (0, _setTimeout2["default"])(websocketSendPlayGetOffer(playSettings, websocket), 500);
      } else {
        websocketOnError({
          message: "Live stream repeater timeout: " + playSettings.streamName
        }, callbacks);
        (0, _stopPlay["default"])(peerConnection, websocket, callbacks);
      }
    } else if (msgStatus !== 200) {
    websocketOnError({
      message: msgJSON["statusDescription"]
    }, callbacks);
    (0, _stopPlay["default"])(peerConnection, websocket, callbacks);
  } else {
    var streamInfoResponse = msgJSON["streamInfo"];
    if (streamInfoResponse !== undefined) {
      sessionId = streamInfoResponse.sessionId;
    }
    if (msgJSON["sdp"] != null) {
      msgJSON.sdp.sdp = (0, _mungeSDP.mungeSDPPlay)(msgJSON.sdp.sdp);

      //console.log("SDP Data: " + msgJSON.sdp.sdp);

      peerConnection.setRemoteDescription(new RTCSessionDescription(msgJSON.sdp)).then(function () {
        return peerConnection.createAnswer().then(function (description) {
          return peerConnectionSetRemoteDescriptionSuccess(description, playSettings, websocket, peerConnection, callbacks);
        })["catch"](function (err) {
          return peerConnectionOnError(err, callbacks);
        });
      })["catch"](function (err) {
        return peerConnectionOnError(err, callbacks);
      });
    }
    var iceCandidates = msgJSON["iceCandidates"];
    if (iceCandidates != null) {
      for (var index in iceCandidates) {
        //console.log("iceCandidates: " + JSON.stringify(iceCandidates[index]));
        peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidates[index]));
      }
    }
  }
};
var websocketOnError = function websocketOnError(error, callbacks) {
  console.log("Websocket Error");
  console.log(error);
  if (callbacks.onError) callbacks.onError({
    websocketError: error.message
  });
};
var websocketSendPlayGetOffer = function websocketSendPlayGetOffer(playSettings, websocket) {
  websocket.send("{\"direction\":\"play\", \"command\":\"getOffer\", \"streamInfo\":" + (0, _stringify["default"])(getStreamInfo(playSettings)) + ", \"userData\":" + (0, _stringify["default"])(getUserData(playSettings)) + "}");
};

// startPlay
// callbacks:
// - onError({message:''})
// - onPeerConnectionOnTrack({event:obj})
// - onConnectionStateChange({connected:boolean})
// - onSetPeerConnection({peerConnection:obj})
// - onSetWebsocket({websocket:obj})

var startPlay = function startPlay(playSettings, websocket, callbacks) {
  try {
    if (websocket == null) {
      websocket = new WebSocket(playSettings.signalingURL);
    }
    if (websocket != null) {
      repeaterRetryCount = 0;
      websocket.binaryType = "arraybuffer";
      websocket.addEventListener("open", function () {
        websocketOnOpen(playSettings, websocket, callbacks);
      });
      websocket.addEventListener("error", function (error) {
        websocketOnError(error, callbacks);
      });
      if (callbacks.onSetWebsocket) callbacks.onSetWebsocket({
        websocket: websocket
      });
    }
  } catch (e) {
    if (callbacks.onError) callbacks.onError(e);
  }
};
var _default = startPlay;
exports["default"] = _default;