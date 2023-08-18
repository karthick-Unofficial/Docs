"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.mungeSDPPlay = mungeSDPPlay;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
function mungeSDPPlay(sdpStr) {
  // For greatest playback compatibility, 
  // force H.264 playback to constrained baseline (42e01f).

  var sdpLines = sdpStr.split(/\r\n/);
  var sdpStrRet = "";
  for (var sdpIndex in sdpLines) {
    var sdpLine = sdpLines[sdpIndex];
    if (sdpLine.length === 0) continue;
    if ((0, _includes["default"])(sdpLine).call(sdpLine, "profile-level-id")) {
      var _context, _context2, _context3;
      // The profile-level-id string has three parts: XXYYZZ, where
      //   XX: 42 baseline, 4D main, 64 high
      //   YY: constraint
      //   ZZ: level ID
      // Look for codecs higher than baseline and force downward.
      var profileLevelId = sdpLine.substr((0, _indexOf["default"])(sdpLine).call(sdpLine, "profile-level-id") + 17, 6);
      var profile = Number("0x" + profileLevelId.substr(0, 2));
      var constraint = Number("0x" + profileLevelId.substr(2, 2));
      var level = Number("0x" + profileLevelId.substr(4, 2));
      if (profile > 0x42) {
        profile = 0x42;
        constraint = 0xE0;
        level = 0x1F;
      }
      if (constraint === 0x00) {
        constraint = 0xE0;
      }
      var newProfileLevelId = (0, _slice["default"])(_context = "00" + profile.toString(16)).call(_context, -2).toLowerCase() + (0, _slice["default"])(_context2 = "00" + constraint.toString(16)).call(_context2, -2).toLowerCase() + (0, _slice["default"])(_context3 = "00" + level.toString(16)).call(_context3, -2).toLowerCase();
      sdpLine = sdpLine.replace(profileLevelId, newProfileLevelId);
    }
    sdpStrRet += sdpLine;
    sdpStrRet += "\r\n";
  }
  return sdpStrRet;
}