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
_Object$defineProperty(exports, "cameras", {
  enumerable: true,
  get: function get() {
    return _reducer2["default"];
  }
});
_Object$defineProperty(exports, "collections", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});
exports.dataByFeed = void 0;
_Object$defineProperty(exports, "events", {
  enumerable: true,
  get: function get() {
    return _reducer3["default"];
  }
});
_Object$defineProperty(exports, "exclusions", {
  enumerable: true,
  get: function get() {
    return _reducer9["default"];
  }
});
_Object$defineProperty(exports, "floorPlan", {
  enumerable: true,
  get: function get() {
    return _reducer10["default"];
  }
});
_Object$defineProperty(exports, "gisData", {
  enumerable: true,
  get: function get() {
    return _reducer6["default"];
  }
});
_Object$defineProperty(exports, "listCategories", {
  enumerable: true,
  get: function get() {
    return _reducer8["default"];
  }
});
_Object$defineProperty(exports, "listLookupData", {
  enumerable: true,
  get: function get() {
    return _reducer7["default"];
  }
});
_Object$defineProperty(exports, "notifications", {
  enumerable: true,
  get: function get() {
    return _Reducers.notifications;
  }
});
_Object$defineProperty(exports, "playSettings", {
  enumerable: true,
  get: function get() {
    return _reducer14["default"];
  }
});
_Object$defineProperty(exports, "rules", {
  enumerable: true,
  get: function get() {
    return _reducer4["default"];
  }
});
_Object$defineProperty(exports, "unitMembers", {
  enumerable: true,
  get: function get() {
    return _reducer11["default"];
  }
});
_Object$defineProperty(exports, "units", {
  enumerable: true,
  get: function get() {
    return _reducer12["default"];
  }
});
_Object$defineProperty(exports, "userFeeds", {
  enumerable: true,
  get: function get() {
    return _reducer5["default"];
  }
});
_Object$defineProperty(exports, "webrtcPlay", {
  enumerable: true,
  get: function get() {
    return _reducer13["default"];
  }
});
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _filter = _interopRequireDefault(require("lodash/filter"));
var _reducer = _interopRequireDefault(require("../Collections/reducer"));
var _reducer2 = _interopRequireDefault(require("../Cameras/reducer"));
var _reducer3 = _interopRequireDefault(require("../Events/reducer"));
var _reducer4 = _interopRequireDefault(require("../Rules/reducer"));
var _reducer5 = _interopRequireDefault(require("../Feeds/reducer"));
var _reducer6 = _interopRequireDefault(require("../GIS/reducer"));
var _reducer7 = _interopRequireDefault(require("../Lists/reducer"));
var _reducer8 = _interopRequireDefault(require("../ListCategories/reducer"));
var _reducer9 = _interopRequireDefault(require("../Exclusions/reducer"));
var _reducer10 = _interopRequireDefault(require("../FloorPlan/reducer"));
var _reducer11 = _interopRequireDefault(require("../UnitMembers/reducer"));
var _reducer12 = _interopRequireDefault(require("../Units/reducer"));
var _reducer13 = _interopRequireDefault(require("../WowzaWebRTC/WebRTCPlay/reducer"));
var _reducer14 = _interopRequireDefault(require("../WowzaWebRTC/PlaySettings/reducer"));
var _Reducers = require("../../Dock/Reducers");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context10, _context11; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context10 = ownKeys(Object(source), !0)).call(_context10, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context11 = ownKeys(Object(source))).call(_context11, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  data: {},
  dataById: [],
  dataQueue: {},
  dataByIdQueue: [],
  dataRemoveQueue: []
};
var dataByFeed = function dataByFeed() {
  var feedId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var batchType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var useQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var entities = function entities() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var type = action.type,
      payload = action.payload;
    // Prevents crash when loading app
    if (!payload) return state;
    // IMPORTANT: For whatever reason, the logic here to return state in the case of different batchType or feedId
    // will ONLY work if it's nested if() statements like this. I have no clue why.
    if (payload) {
      if (payload.batch === batchType || payload.batch === "all") {
        if (feedId === payload.feedId) {
          switch (type) {
            case "DATA_BATCH_RECEIVED":
              {
                var data = payload.data,
                  key = payload.key;
                var newData = !useQueue ? deepMerge({}, state.data) : deepMerge({}, state.dataQueue);
                var newBatch = (0, _keyBy["default"])(data, key);
                var newBatchIds = (0, _keys["default"])(newBatch);
                if (!newData) {
                  return _objectSpread(_objectSpread({}, state), {}, {
                    data: newBatch,
                    dataById: newBatchIds
                  });
                } else {
                  var update = {};
                  for (var id in _objectSpread(_objectSpread({}, newData), newBatch)) {
                    update[id] = deepMerge(newData[id] || {}, newBatch[id]);
                  }
                  if (useQueue) {
                    var _context;
                    // -- remove queuedRemoves if in new batch
                    var newDataRemoveQueue = (0, _toConsumableArray2["default"])(state.dataRemoveQueue);
                    (0, _forEach["default"])(newBatchIds).call(newBatchIds, function (id) {
                      var index = (0, _indexOf["default"])(newDataRemoveQueue).call(newDataRemoveQueue, id);
                      if (index !== -1) {
                        (0, _splice["default"])(newDataRemoveQueue).call(newDataRemoveQueue, index, 1);
                      }
                    });
                    return _objectSpread(_objectSpread({}, state), {}, {
                      dataQueue: _objectSpread({}, update),
                      dataByIdQueue: (0, _uniq["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(state.dataByIdQueue), (0, _toConsumableArray2["default"])(newBatchIds))),
                      dataRemoveQueue: newDataRemoveQueue
                    });
                  } else {
                    var _context2;
                    return _objectSpread(_objectSpread({}, state), {}, {
                      data: _objectSpread({}, update),
                      dataById: (0, _uniq["default"])((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(state.dataById), (0, _toConsumableArray2["default"])(newBatchIds)))
                    });
                  }
                }
              }
            case "DATA_RECEIVED":
              {
                var _data = payload.data,
                  _key = payload.key;
                var _newData = !useQueue ? deepMerge({}, state.data) : deepMerge({}, state.dataQueue);
                if (!_newData) {
                  return _objectSpread(_objectSpread({}, state), {}, {
                    data: (0, _defineProperty2["default"])({}, _data[_key], _data),
                    dataById: [_data.id]
                  });
                } else {
                  // Merge data if obj already exists, otherwise just add object
                  var _update = _newData[_data[_key]] ? deepMerge(_newData[_data[_key]], _data) : _data;
                  if (useQueue) {
                    var _context3;
                    // -- remove queuedRemoves if in new batch
                    var _newDataRemoveQueue = (0, _toConsumableArray2["default"])(state.dataRemoveQueue);
                    var index = (0, _indexOf["default"])(_newDataRemoveQueue).call(_newDataRemoveQueue, _data.id);
                    if (index !== -1) {
                      (0, _splice["default"])(_newDataRemoveQueue).call(_newDataRemoveQueue, index, 1);
                    }
                    return _objectSpread(_objectSpread({}, state), {}, {
                      dataQueue: _objectSpread(_objectSpread({}, _newData), {}, (0, _defineProperty2["default"])({}, _data[_key], _update)),
                      dataByIdQueue: (0, _uniq["default"])((0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(state.dataByIdQueue), [_data.id])),
                      dataRemoveQueue: _newDataRemoveQueue
                    });
                  } else {
                    var _context4;
                    return _objectSpread(_objectSpread({}, state), {}, {
                      data: _objectSpread(_objectSpread({}, _newData), {}, (0, _defineProperty2["default"])({}, _data[_key], _update)),
                      dataById: (0, _uniq["default"])((0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(state.dataById), [_data.id]))
                    });
                  }
                }
              }
            case "DATA_REMOVED":
              {
                var dataId = payload.dataId;
                if (useQueue) {
                  var _context5;
                  return _objectSpread(_objectSpread({}, state), {}, {
                    dataRemoveQueue: (0, _uniq["default"])((0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(state.dataRemoveQueue), [dataId]))
                  });
                } else {
                  var _context6;
                  var _newData2 = _objectSpread(_objectSpread({}, state.data), state.dataQueue);
                  var newDataById = (0, _filter["default"])((0, _concat["default"])(_context6 = []).call(_context6, (0, _toConsumableArray2["default"])(state.dataById), (0, _toConsumableArray2["default"])(state.dataByIdQueue)), function (id) {
                    return id !== dataId;
                  });
                  delete _newData2[dataId];
                  return _objectSpread(_objectSpread({}, state), {}, {
                    data: _newData2,
                    dataById: newDataById
                  });
                }
              }
            case "SET_DATA_SUBSCRIPTION":
              {
                var channel = payload.channel;
                return _objectSpread(_objectSpread({}, state), {}, {
                  subscription: channel
                });
              }
            case "UNSUB_GLOBAL_FEED":
              {
                return _objectSpread(_objectSpread({}, state), {}, {
                  subscription: null
                });
              }
            case "RUN_QUEUE":
              {
                if (useQueue) {
                  var _context7, _context8;
                  // -- merge queued data with current data
                  var _newData3 = _objectSpread(_objectSpread({}, state.data), state.dataQueue);
                  var _newDataById = (0, _uniq["default"])((0, _concat["default"])(_context7 = []).call(_context7, (0, _toConsumableArray2["default"])(state.dataById), (0, _toConsumableArray2["default"])(state.dataByIdQueue)));

                  // -- remove data queued up for removal
                  (0, _forEach["default"])(_context8 = state.dataRemoveQueue).call(_context8, function (dataId) {
                    delete _newData3[dataId];
                    var index = (0, _indexOf["default"])(_newDataById).call(_newDataById, dataId);
                    if (index !== -1) {
                      (0, _splice["default"])(_newDataById).call(_newDataById, index, 1);
                    }
                  });
                  return _objectSpread(_objectSpread({}, state), {}, {
                    data: _newData3,
                    dataById: _newDataById,
                    dataQueue: {},
                    dataByIdQueue: [],
                    dataRemoveQueue: []
                  });
                } else {
                  return state;
                }
              }
            default:
              return state;
          }
        } else {
          return state;
        }
      } else {
        return state;
      }
    } else {
      return state;
    }
  };
  return entities;
};

// -- Simple object check. Arrays return false
exports.dataByFeed = dataByFeed;
function isObject(item) {
  return !!item && (0, _typeof2["default"])(item) === "object" && !(0, _isArray["default"])(item);
}

// -- Deep merge two objects.
function deepMerge(target) {
  var _context9;
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }
  if (!sources.length) return target;
  var source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) (0, _assign["default"])(target, (0, _defineProperty2["default"])({}, key, {}));
        deepMerge(target[key], source[key]);
      } else {
        (0, _assign["default"])(target, (0, _defineProperty2["default"])({}, key, source[key]));
      }
    }
  }
  return deepMerge.apply(void 0, (0, _concat["default"])(_context9 = [target]).call(_context9, sources));
}