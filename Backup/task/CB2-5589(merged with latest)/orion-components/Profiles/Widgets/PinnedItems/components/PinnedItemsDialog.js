"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _SearchField = _interopRequireDefault(require("./SearchField"));
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _SharedComponents = require("orion-components/SharedComponents");
var _debounce = _interopRequireDefault(require("debounce"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PinnedItemsDialog = function PinnedItemsDialog(_ref) {
  var feeds = _ref.feeds,
    closeDialog = _ref.closeDialog,
    contextId = _ref.contextId,
    dialog = _ref.dialog,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    querying = _useState2[0],
    setQuerying = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    additions = _useState4[0],
    setAdditions = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    results = _useState6[0],
    setResults = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var _useState9 = (0, _react.useState)({}),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    profileIconTemplates = _useState10[0],
    setProfileIconTemplates = _useState10[1];
  (0, _react.useEffect)(function () {
    (0, _forEach["default"])(feeds).call(feeds, function (feed) {
      profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
    });
    setProfileIconTemplates(profileIconTemplates);
  }, []);
  var handleClosePinDialog = function handleClosePinDialog() {
    setAdditions([]);
    setQuerying(false);
    setError(null);
    setResults([]);
    dispatch(closeDialog("pinnedItemDialog"));
  };
  var handleConfirmPin = function handleConfirmPin() {
    _clientAppCore.eventService.pinEntities(contextId, additions, function (err, response) {
      if (err) console.log(err, response);

      // Update 'lastModified', cause new pinned items to stream in on event stream object
      _clientAppCore.eventService.mockUpdateEvent(contextId, function (err, response) {
        if (err) {
          console.log(err, response);
        }
      });
    });
    handleClosePinDialog();
  };
  var handleAddItem = function handleAddItem(item) {
    var addition = {
      id: item.id,
      feedId: item.feedId
    };
    var index = (0, _findIndex["default"])(additions).call(additions, function (addition) {
      return addition.id === item.id;
    });
    if (index === -1) {
      var _context;
      setAdditions((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(additions), [addition]));
    } else {
      (0, _splice["default"])(additions).call(additions, index, 1);
      setAdditions(additions);
    }
  };
  var handleSearch = function handleSearch(value) {
    var queryFinished = false;
    (0, _setTimeout2["default"])(function () {
      if (!queryFinished) {
        setQuerying(true);
      }
    }, 500);
    if (value.length) {
      _clientAppCore.eventService.queryPinnable(contextId, value, 5, function (err, response) {
        // No matter the response, we don't want to show the progress wheel
        queryFinished = true;
        if (err) {
          setError((0, _i18n.getTranslation)("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.errorOcc"));
          setQuerying(false);
          return;
        }
        if (response instanceof Array && response.length < 1) {
          setError((0, _i18n.getTranslation)("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.noItems"));
          setQuerying(false);
        } else {
          setResults(response);
          setQuerying(false);
          setError(null);
        }
      });
    } else {
      queryFinished = true;
      handleClearSearch();
    }
  };
  var handleClearSearch = function handleClearSearch() {
    setResults([]);
    setQuerying(false);
    setError(null);
  };
  var styles = {
    listStyles: {
      backgroundColor: "#41454A",
      marginBottom: ".75rem"
    },
    error: {
      textAlign: "center",
      padding: "10px"
    },
    progress: {
      textAlign: "center",
      padding: "15px 0"
    }
  };
  var HandleSearch = (0, _debounce["default"])(handleSearch, 500);
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "pinnedItemDialog",
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.pinnedItems.pinnedItemsDialog.confirm"),
      action: handleConfirmPin,
      disabled: !additions.length
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.pinnedItems.pinnedItemsDialog.cancel"),
      action: handleClosePinDialog
    },
    options: {
      onClose: handleClosePinDialog,
      maxWidth: "sm"
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_SearchField["default"], {
    updateSearch: HandleSearch,
    handleClear: handleClearSearch,
    width: "320px",
    placeholder: (0, _i18n.getTranslation)("global.profiles.widgets.pinnedItems.pinnedItemsDialog.wantToFind"),
    autoFocus: true
  }), /*#__PURE__*/_react["default"].createElement(_material.List, null, querying ? /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.progress
  }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    size: 60,
    thickness: 5
  })) : error ? /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.error
  }, /*#__PURE__*/_react["default"].createElement("p", null, " ", error)) : results.length ? (0, _map["default"])(results).call(results, function (result) {
    var props = result.entityData.properties;
    var index = (0, _findIndex["default"])(additions).call(additions, function (addition) {
      return addition.id === result.id;
    });
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      id: "search-result",
      key: result.id,
      style: styles.listStyles
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemButton, {
      onClick: function onClick() {
        return handleAddItem(result);
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, (0, _SharedComponents.getIconByTemplate)(props.type, result, "2.5rem", profileIconTemplates[result.feedId])), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: props.name,
      sx: {
        color: "#fff"
      },
      secondary: props.type
    }), /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      checked: index !== -1,
      onChange: function onChange() {
        return handleAddItem(result);
      }
    })));
  }) : null));
};
var _default = PinnedItemsDialog;
exports["default"] = _default;