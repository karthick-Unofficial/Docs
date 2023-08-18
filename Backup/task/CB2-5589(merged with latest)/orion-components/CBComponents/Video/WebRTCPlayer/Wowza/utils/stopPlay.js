"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// callbacks:
// - onSetPeerConnection
// - onSetWebsocket
// - onPlayStopped

var stopPlay = function stopPlay(peerConnection, websocket, callbacks) {
  if (peerConnection != null) {
    peerConnection.close();
    if (callbacks.onSetPeerConnection) callbacks.onSetPeerConnection({
      peerConnection: undefined
    });
  }
  if (websocket != null) {
    websocket.close();
    if (callbacks.onSetWebsocket) callbacks.onSetWebsocket({
      websocket: undefined
    });
  }
  if (callbacks.onPlayStopped) callbacks.onPlayStopped();
};
var _default = stopPlay;
exports["default"] = _default;