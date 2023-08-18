"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGISProfile = void 0;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _Actions = require("orion-components/ContextPanel/Actions");
var _Actions2 = require("orion-components/AppState/Actions");
var _Actions3 = require("orion-components/ContextualData/Actions");
var loadGISProfile = function loadGISProfile(entity) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "primary";
  return function (dispatch, getState) {
    var state = getState();
    var history = state.userAppState.viewingHistory;
    dispatch((0, _Actions2.clearSelectedEntity)());
    dispatch((0, _Actions.openSecondary)());

    // Load while subscriptions are being set
    dispatch((0, _Actions2.setLoading)("profile", true));
    _promise["default"].all([dispatch((0, _Actions3.addContext)(entity)), dispatch((0, _Actions2.setSelectedEntity)({
      name: entity.properties.name || entity.properties.state_name || "GIS Feature",
      id: entity.id,
      entityType: "gis-feature"
    }))]).then(function () {
      dispatch((0, _Actions3.subscriptionReceived)(entity.id, null, "entity", "profile"));
    }).then(function () {
      dispatch((0, _Actions.updateSelectedContext)(entity.id, context));
      dispatch((0, _Actions2.setLoading)("profile", false));
    });
    if (history.length < 1 || history[history.length - 1].id !== entity.id) {
      dispatch((0, _Actions.updateViewingHistory)(entity.id, "gis-feature", entity.properties.name || entity.properties.state_name));
    }
  };
};
exports.loadGISProfile = loadGISProfile;