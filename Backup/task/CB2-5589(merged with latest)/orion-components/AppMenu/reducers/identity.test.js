"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _identity = _interopRequireWildcard(require("./identity.js"));
var actions = _interopRequireWildcard(require("../actions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
describe("identity reducer", function () {
  it("should initialize with expected initial state", function () {
    expect((0, _identity["default"])(undefined, {})).toEqual(_identity.initialState);
  });
  it("Should handle identityInvalidated", function () {
    var action;
    var expectedState;
    action = actions.identityInvalidated();
    expectedState = _objectSpread(_objectSpread({}, _identity.initialState), {}, {
      isAuthenticated: false,
      userId: null,
      email: null
    });
    expect((0, _identity["default"])(_identity.initialState, action)).toEqual(expectedState);
  });

  // it('Should handle loginRequest', () => {

  //     let action;
  //     let expectedState;

  //     action = actions.requestLogin();
  //     expectedState = {
  //             ...seedState,
  //             isFetching: true,
  //             isAuthenticated: false,
  //             errorMessage: ''
  //         };
  //     expect(identity(seedState, action)).toEqual(expectedState);

  // })

  // it('Should handle loginSuccess', () => {

  //     let action;
  //     let expectedState;

  //     action = actions.loginSuccess();
  //     expectedState = {
  //             ...seedState,
  //             isFetching: false,
  //             isAuthenticated: true,
  //             errorMessage: ''
  //         };
  //     expect(identity(seedState, action)).toEqual(expectedState);

  // })

  // it('Should handle loginFailure', () => {
  //     const errorMessage = 'no good';

  //     let action;
  //     let expectedState;

  //     action = actions.loginFailure(errorMessage);
  //     expectedState = {
  //             ...seedState,
  //             isFetching: false,
  //             isAuthenticated: false,
  //             errorMessage: errorMessage
  //         };
  //     expect(identity(seedState, action)).toEqual(expectedState);

  // })
});