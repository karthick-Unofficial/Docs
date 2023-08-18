"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getFacilities = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _reselect = require("reselect");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _lodash = _interopRequireDefault(require("lodash"));
var globalDataSelector = function globalDataSelector(state) {
  return state.globalData;
};
var globalGeoSelector = function globalGeoSelector(state) {
  return state.globalGeo;
};
var contextualDataSelector = function contextualDataSelector(state) {
  return state.contextualData;
};
var proximityEntitiesSelector = function proximityEntitiesSelector(state) {
  var _selectedContextSelec, _selectedContextSelec2;
  return (_selectedContextSelec = (_selectedContextSelec2 = (0, _Selectors2.selectedContextSelector)(state)) === null || _selectedContextSelec2 === void 0 ? void 0 : _selectedContextSelec2.proximityEntities) !== null && _selectedContextSelec !== void 0 ? _selectedContextSelec : [];
};
var primarySelector = function primarySelector(state) {
  return state.contextualData[(0, _Selectors2.primaryContextSelector)(state)];
};
var pinnedItemsSelector = function pinnedItemsSelector(state) {
  var _primarySelector$pinn, _primarySelector;
  return (_primarySelector$pinn = (_primarySelector = primarySelector(state)) === null || _primarySelector === void 0 ? void 0 : _primarySelector.pinnedItems) !== null && _primarySelector$pinn !== void 0 ? _primarySelector$pinn : [];
};
var userFeedsSelectorData = function userFeedsSelectorData(state) {
  return (0, _Selectors.userFeedsSelector)(state);
};
var getFacilities = (0, _reselect.createSelector)([globalDataSelector, globalGeoSelector, contextualDataSelector, proximityEntitiesSelector, primarySelector, pinnedItemsSelector, userFeedsSelectorData], function (globalData, globalGeo, contextualData, proximityEntities, primary, pinnedItems, userFeeds) {
  return function (state, props) {
    var secondary = props.secondary,
      feedId = props.feedId,
      replayMap = props.replayMap,
      getInitialPlayBarData = props.getInitialPlayBarData;
    var facilityFeeds = (0, _map["default"])(_lodash["default"]).call(_lodash["default"], (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], (0, _map["default"])(_lodash["default"]).call(_lodash["default"], userFeeds), function (feed) {
      return feed && feed.entityType === "facility";
    }), "feedId");
    var facilities = {};
    if (replayMap) {
      var playBarValue = state.playBar.playBarValue;
      var data = getInitialPlayBarData(playBarValue, state.replay.timeTransactions);
      if (data) {
        var _context;
        (0, _map["default"])(_context = (0, _keys["default"])(data)).call(_context, function (key) {
          if (data[key].feedId === feedId) {
            facilities[key] = data[key];
          }
        });
      }
    } else if (feedId) {
      facilities = (0, _Selectors.layerSourcesSelector)(state, props);
    } else if (secondary) {
      var _context2, _context3;
      (0, _forEach["default"])(_context2 = (0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(proximityEntities), (0, _toConsumableArray2["default"])(pinnedItems))).call(_context2, function (item) {
        if (item.entityType === "facility" && item.entityData.geometry) {
          facilities[item.id] = item;
        }
      });
    } else {
      if (globalData && globalGeo) {
        if (!_lodash["default"].isEmpty(contextualData)) {
          if (primary && primary.entity) {
            facilities[primary.entity.id] = primary.entity;
          }
        } else {
          (0, _map["default"])(facilityFeeds).call(facilityFeeds, function (feed) {
            facilities = _lodash["default"].merge(facilities, _lodash["default"].cloneDeep((0, _Selectors.layerSourcesSelector)(state, {
              feedId: feed
            })) || {});
          });
        }
      }
    }
    return facilities;
  };
});
exports.getFacilities = getFacilities;