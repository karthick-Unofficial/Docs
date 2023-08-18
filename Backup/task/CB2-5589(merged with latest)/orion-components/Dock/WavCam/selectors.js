"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.wavCamFOVItems = exports.getContext = void 0;
var _reselect = require("reselect");
var _Selectors = require("orion-components/ContextualData/Selectors");
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _isEqual["default"]);
var wavCamFOVItems = function wavCamFOVItems(id) {
  return createDeepEqualSelector((0, _Selectors.contextById)(id), function (context) {
    if (context) {
      var fovItems = context.fovItems;
      return (0, _keyBy["default"])(fovItems, "id");
    }
  });
};
exports.wavCamFOVItems = wavCamFOVItems;
var getContext = function getContext(id) {
  return createDeepEqualSelector((0, _Selectors.contextById)(id), function (context) {
    if (context) {
      return context;
    }
  });
};
exports.getContext = getContext;