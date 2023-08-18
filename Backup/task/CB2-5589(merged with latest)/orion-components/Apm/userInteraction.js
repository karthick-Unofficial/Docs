"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _apmRum = require("@elastic/apm-rum");
var sleep = function sleep(milliseconds) {
  return new _promise["default"](function (resolve) {
    return (0, _setTimeout2["default"])(resolve, milliseconds);
  });
};
var captureUserInteraction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name) {
    var txn, x;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (_apmRum.apm.getCurrentTransaction()) {
            _context.next = 18;
            break;
          }
          txn = _apmRum.apm.startTransaction(name, "user-interaction", {
            managed: true,
            canReuse: true
          });
          txn.block(true);
          _context.next = 5;
          return sleep(2000);
        case 5:
          txn.block(false);
          if (!(txn.blocked || txn._activeTasks.size > 0)) {
            _context.next = 17;
            break;
          }
          x = 0;
        case 8:
          if (!(x < 10)) {
            _context.next = 17;
            break;
          }
          _context.next = 11;
          return sleep(200);
        case 11:
          if (!(!txn.blocked && txn._activeTasks.size === 0)) {
            _context.next = 14;
            break;
          }
          txn.end();
          return _context.abrupt("break", 17);
        case 14:
          x++;
          _context.next = 8;
          break;
        case 17:
          if (!txn.ended) txn.end();
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function captureUserInteraction(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = captureUserInteraction;
exports["default"] = _default;