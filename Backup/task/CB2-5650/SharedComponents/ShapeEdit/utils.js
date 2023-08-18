"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbols = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _lastIndexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/last-index-of"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _sprites = _interopRequireDefault(require("./sprites.json"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var getSymbols = function getSymbols(map, icons) {
  var collections = {
    Basic: []
  };
  var dataKeys = (0, _keys["default"])(_sprites["default"]);
  var keys = (0, _keys2["default"])(icons).call(icons);
  var names = (0, _map["default"])(keys).call(keys, function (key) {
    return (0, _slice["default"])(key).call(key, (0, _indexOf["default"])(key).call(key, "/") + 1, (0, _lastIndexOf["default"])(key).call(key, "."));
  });
  var symbols = [];
  (0, _forEach["default"])(keys).call(keys, function (key, index) {
    var name = names[index];
    // Check that the image has an object in the sprite json, that the map has the image and that the image is being used for
    // point creation
    if ((0, _includes["default"])(dataKeys).call(dataKeys, name) && map.hasImage(name) && _sprites["default"][name].forPoints) {
      var spriteData = _sprites["default"][name];
      var symbol = _objectSpread({
        path: (0, _slice["default"])(key).call(key, (0, _indexOf["default"])(key).call(key, "/")),
        keywords: _sprites["default"][name].keywords ? _sprites["default"][name].keywords : [],
        file: icons(key),
        name: name
      }, spriteData);
      symbols.push(symbol);
    }
  });
  // Push the symbol into the correct collection of symbols. Defaults to 'Basic' collection
  (0, _forEach["default"])(symbols).call(symbols, function (symbol) {
    if (symbol.group) {
      if (collections[symbol.group]) {
        collections[symbol.group].push(symbol);
      } else collections[symbol.group] = [symbol];
    } else collections["Basic"].push(symbol);
  });
  return collections;
};
exports.getSymbols = getSymbols;