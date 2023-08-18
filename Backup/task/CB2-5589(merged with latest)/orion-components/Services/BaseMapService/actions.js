"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseMapConfigurations = void 0;
var _clientAppCore = require("client-app-core");
var _actionTypes = require("./actionTypes");
var baseMapConfigReceived = function baseMapConfigReceived(data) {
  return {
    type: _actionTypes.BASE_MAP_CONFIG_RECEIVED,
    payload: data
  };
};
var getBaseMapConfigurations = function getBaseMapConfigurations(setReady) {
  return function (dispatch) {
    _clientAppCore.baseMapsService.getAllBaseMaps(function (err, res) {
      if (err) {
        console.log("Base map  config error received", err);
      } else {
        dispatch(baseMapConfigReceived(res));
        setReady();
      }
    });
  };
};
exports.getBaseMapConfigurations = getBaseMapConfigurations;