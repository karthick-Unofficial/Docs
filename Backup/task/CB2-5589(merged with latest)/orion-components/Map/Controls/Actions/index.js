"use strict";

var _context;
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
var _actions = require("../GISControl/actions");
_forEachInstanceProperty(_context = _Object$keys(_actions)).call(_context, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _actions[key]) return;
  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});