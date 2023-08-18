"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.userIntegrationsOfEntityTypeSelector = exports.userIntegrationByFeedIdSelector = exports.userApplicationArraySelector = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _reselect = require("reselect");
var _find = _interopRequireDefault(require("lodash/find"));
var userIntegrationsSelector = function userIntegrationsSelector(state) {
  return state.session.user.profile.integrations;
};
var userApplicationsSelector = function userApplicationsSelector(state) {
  return state.session.user.profile.applications;
};
var userApplicationArraySelector = (0, _reselect.createSelector)(userApplicationsSelector, function (applications) {
  var appIds = (0, _map["default"])(applications).call(applications, function (app) {
    return app.appId;
  });
  return appIds;
});
exports.userApplicationArraySelector = userApplicationArraySelector;
var userIntegrationsOfEntityTypeSelector = function userIntegrationsOfEntityTypeSelector(entityType) {
  return (0, _reselect.createSelector)(userIntegrationsSelector, function (integrations) {
    return (0, _filter["default"])(integrations).call(integrations, function (_int) {
      return _int.entityType === entityType && _int.config.canView;
    });
  });
};
exports.userIntegrationsOfEntityTypeSelector = userIntegrationsOfEntityTypeSelector;
var userIntegrationByFeedIdSelector = function userIntegrationByFeedIdSelector(feedId) {
  return (0, _reselect.createSelector)(userIntegrationsSelector, function (integrations) {
    return (0, _find["default"])(integrations, function (_int2) {
      return _int2.feedId === feedId;
    });
  });
};
exports.userIntegrationByFeedIdSelector = userIntegrationByFeedIdSelector;