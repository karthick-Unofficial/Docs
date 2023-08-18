"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _jquery = _interopRequireDefault(require("jquery"));
var _i18n = require("orion-components/i18n");
var _styles = require("@mui/styles");
var _reactRedux = require("react-redux");
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _map2 = _interopRequireDefault(require("lodash/map"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context9, _context10; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context9 = ownKeys(Object(source), !0)).call(_context9, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context10 = ownKeys(Object(source))).call(_context10, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var useStyles = (0, _styles.makeStyles)({
  checkboxPadding: {
    paddingLeft: function paddingLeft(_ref) {
      var dir = _ref.dir;
      return dir && dir === "rtl" ? "30px" : "";
    }
  },
  label: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    padding: "0 20px"
  },
  disabled: {
    color: "#fff!important",
    opacity: "0.3"
  }
});
var PinToDialog = function PinToDialog(_ref2) {
  var open = _ref2.open,
    addRemoveFromCollections = _ref2.addRemoveFromCollections,
    addRemoveFromEvents = _ref2.addRemoveFromEvents,
    canManageEvents = _ref2.canManageEvents,
    canPinToCollections = _ref2.canPinToCollections,
    close = _ref2.close,
    openDialog = _ref2.openDialog,
    closeDialog = _ref2.closeDialog,
    createCollection = _ref2.createCollection,
    entity = _ref2.entity,
    dialog = _ref2.dialog,
    dir = _ref2.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    events = _useState2[0],
    setEvents = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    pinnedTo = _useState4[0],
    setPinnedTo = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    collections = _useState6[0],
    setCollections = _useState6[1];
  var _useState7 = (0, _react.useState)([]),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    memberships = _useState8[0],
    setMemberships = _useState8[1];
  var _useState9 = (0, _react.useState)({
      added: [],
      removed: []
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    collectionUpdates = _useState10[0],
    setCollectionUpdates = _useState10[1];
  var _useState11 = (0, _react.useState)({
      added: [],
      removed: []
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    eventUpdates = _useState12[0],
    setEventUpdates = _useState12[1];
  var _useState13 = (0, _react.useState)(""),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    newCollection = _useState14[0],
    setNewCollection = _useState14[1];
  var _useState15 = (0, _react.useState)(""),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    errorText = _useState16[0],
    setErrorText = _useState16[1];
  var classes = useStyles({
    dir: dir
  });
  (0, _react.useEffect)(function () {
    if (open) {
      _clientAppCore.eventService.getEventsForPinningEntity(entity.id, function (err, response) {
        if (err) console.log(err);
        if (!response) return;
        var pinnedTo = (0, _map2["default"])((0, _filter2["default"])(response, function (event) {
          return event.entityPinned;
        }), function (event) {
          return event.id;
        });
        setEvents(response);
        setPinnedTo(pinnedTo);
        setEventUpdates(_objectSpread(_objectSpread({}, eventUpdates), {}, {
          added: pinnedTo
        }));
      });
      _clientAppCore.entityCollection.getCollectionsForPinningEntity(entity.id, function (err, response) {
        if (err) console.log(err);
        if (!response) return;
        var memberships = (0, _map2["default"])((0, _filter2["default"])(response, function (collection) {
          return collection.entityPinned;
        }), function (collection) {
          return collection.id;
        });
        setCollections(response);
        setMemberships(memberships);
        setCollectionUpdates(_objectSpread(_objectSpread({}, collectionUpdates), {}, {
          added: memberships
        }));
      });
    }
  }, [open]);
  var handleCollectionToggle = function handleCollectionToggle(collection, checked) {
    var added = (0, _toConsumableArray2["default"])(collectionUpdates.added);
    var removed = (0, _toConsumableArray2["default"])(collectionUpdates.removed);
    var member = (0, _includes["default"])(memberships).call(memberships, collection.id);
    if (checked) {
      var _context;
      var values = (0, _filter["default"])(removed).call(removed, function (value) {
        return value.id !== collection.id;
      });
      setCollectionUpdates({
        added: (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(added), [{
          name: collection.name,
          id: collection.id
        }]),
        removed: values
      });
    } else if (!checked && member) {
      var _context2;
      var _values = (0, _filter["default"])(added).call(added, function (value) {
        return value.id ? value.id !== collection.id : value !== collection.id;
      });
      setCollectionUpdates({
        added: _values,
        removed: (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(removed), [{
          name: collection.name,
          id: collection.id
        }])
      });
    } else {
      var _values2 = (0, _filter["default"])(added).call(added, function (value) {
        return value.id !== collection.id;
      });
      setCollectionUpdates({
        added: _values2,
        removed: removed
      });
    }
  };
  var handleEventToggle = function handleEventToggle(id, checked) {
    var added = (0, _toConsumableArray2["default"])(eventUpdates.added);
    var removed = (0, _toConsumableArray2["default"])(eventUpdates.removed);
    var member = (0, _includes["default"])(pinnedTo).call(pinnedTo, id);
    if (checked) {
      var _context3;
      var values = (0, _filter["default"])(removed).call(removed, function (value) {
        return value !== id;
      });
      setEventUpdates({
        added: (0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(added), [id]),
        removed: values
      });
    } else if (!checked && member) {
      var _context4;
      var _values3 = (0, _filter["default"])(added).call(added, function (value) {
        return value !== id;
      });
      setEventUpdates({
        added: _values3,
        removed: (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(removed), [id])
      });
    } else {
      var _values4 = (0, _filter["default"])(added).call(added, function (value) {
        return value !== id;
      });
      setEventUpdates({
        added: _values4,
        removed: removed
      });
    }
  };
  var handleSubmit = function handleSubmit() {
    var _context5, _context6;
    var removedCollections = (0, _toConsumableArray2["default"])(collectionUpdates.removed);
    var removedEvents = (0, _toConsumableArray2["default"])(eventUpdates.removed);

    // Filter out memberships from added collections
    var addedCollections = (0, _filter["default"])(_context5 = collectionUpdates.added).call(_context5, function (value) {
      return !(0, _includes["default"])(memberships).call(memberships, value);
    });
    var addedEvents = (0, _filter["default"])(_context6 = eventUpdates.added).call(_context6, function (value) {
      return !(0, _includes["default"])(pinnedTo).call(pinnedTo, value);
    });
    if (addedCollections.length + removedCollections.length > 0) {
      var name = entity.entityData.properties.name ? entity.entityData.properties.name : entity.id;
      var entityType = entity.entityType;
      var feedId = entity.feedId;
      dispatch(addRemoveFromCollections(entity.id, addedCollections, removedCollections, name, entityType, feedId, false));
    }
    if (addedEvents.length + removedEvents.length > 0) {
      dispatch(addRemoveFromEvents(entity.id, entity.entityType, entity.feedId, addedEvents, removedEvents));
    }
    setCollectionUpdates({
      added: [],
      removed: []
    });
    setEventUpdates({
      added: [],
      removed: []
    });
    handleClose();
  };
  var handleClose = function handleClose() {
    setCollectionUpdates({
      added: [],
      removed: []
    });
    setEventUpdates({
      added: [],
      removed: []
    });
    setNewCollection("");
    close();
  };
  var handleOpenAddNew = function handleOpenAddNew() {
    handleClose();
    dispatch(openDialog("addToNewCollection"));
  };
  var handleCloseAddNew = function handleCloseAddNew() {
    setNewCollection("");
    dispatch(closeDialog("addToNewCollection"));
  };
  var handleNewCollectionChange = function handleNewCollectionChange(event) {
    setNewCollection(event.target.value);
    if (errorText.length > 0) {
      setErrorText("");
    }
  };
  var handleSubmitAddNew = function handleSubmitAddNew() {
    if (newCollection.length < 1) {
      setErrorText((0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.errorText.enterValidName"));
      return;
    }
    dispatch(createCollection(newCollection, [{
      id: entity.id,
      name: entity.entityData.properties.name ? entity.entityData.properties.name : entity.id.toUpperCase(),
      entityType: entity.entityType,
      feedId: entity.feedId
    }]));
    handleCloseAddNew();
  };
  var addToActions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "add-to-coll-action-button",
    disabled: !canPinToCollections,
    onClick: handleOpenAddNew,
    variant: "text",
    color: "primary",
    style: dir == "rtl" ? {
      marginLeft: "auto"
    } : {
      marginRight: "auto"
    },
    classes: {
      disabled: classes.disabled
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.addToColl")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "add-to-cancel-action-button",
    variant: "text",
    color: "primary",
    onClick: handleClose,
    style: {
      color: "#828283"
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "add-to-submit-action-button",
    variant: "text",
    color: "primary",
    onClick: handleSubmit,
    primary: true
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.submit"))];
  var addNewActions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "add-new-cancel-action-button",
    variant: "text",
    color: "primary",
    onClick: handleCloseAddNew,
    style: {
      color: "#828283"
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "add-new-submit-action-button",
    variant: "text",
    color: "primary",
    onClick: handleSubmitAddNew,
    primary: true
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.submit"))];
  var mobile = (0, _jquery["default"])(window).width() <= 675;
  var addToDialogStyles = {
    content: {
      maxWidth: 600,
      paddingTop: "10px",
      width: "75%"
    },
    body: {
      display: "flex",
      justifyContent: mobile ? "flex-start" : "space-around",
      flexDirection: mobile ? "column" : "row"
    }
  };
  var addNewDialogStyles = {
    content: {
      maxWidth: 500,
      width: "100%"
    }
  };
  var listStyles = {
    list: {
      maxHeight: "300px",
      overflow: "auto",
      flexBasis: "45%"
    },
    item: {
      backgroundColor: "#41454a",
      marginBottom: ".5rem"
    },
    primaryText: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    subheader: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      paddingLeft: 0
    }), dir === "rtl" && {
      paddingRight: 0
    }), {}, {
      color: "white"
    })
  };
  // All collections the user has permission to pin to
  var filteredCollections = collections;
  var sortedEvents = (0, _sort["default"])(events).call(events, function (a, b) {
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    }
    return 0;
  });
  var sortedCollections = (0, _sort["default"])(filteredCollections).call(filteredCollections, function (a, b) {
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    }
    return 0;
  });
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: open,
    onClose: handleClose,
    PaperProps: {
      sx: _objectSpread({}, addToDialogStyles.content)
    },
    scroll: "paper"
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    sx: {
      fontWeight: "400",
      fontSize: "22px"
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.pinItem"))), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    sx: {
      paddingTop: "25px",
      paddingBottom: "25px",
      borderTop: "none",
      borderBottom: "none"
    },
    style: addToDialogStyles.body
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      minWidth: "45%",
      margin: "0 1%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListSubheader, {
    style: listStyles.subheader
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.pinToDialog.collections"
  })), /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: listStyles.list
  }, (0, _map["default"])(sortedCollections).call(sortedCollections, function (collection) {
    var _context7;
    var checkbox = /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
      className: "themedCheckBox",
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        className: classes.checkboxPadding,
        disabled: !canPinToCollections && (0, _includes["default"])(memberships).call(memberships, collection.id),
        checked: (0, _some["default"])(_context7 = collectionUpdates.added).call(_context7, function (added) {
          return added.id ? added.id === collection.id : added === collection.id;
        }),
        onChange: function onChange(e, checked) {
          return handleCollectionToggle(collection, checked);
        }
      }),
      label: collection.name,
      sx: {
        height: "48px",
        width: "100%",
        margin: "0px",
        padding: "7px"
      },
      classes: {
        label: classes.label
      }
    });
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: collection.id,
      style: listStyles.item,
      disablePadding: true
    }, checkbox);
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      minWidth: "45%",
      margin: "0 1%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListSubheader, {
    style: dir == "rtl" ? listStyles.subheaderRTL : listStyles.subheader
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.pinToDialog.events"
  })), /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: listStyles.list
  }, (0, _map["default"])(sortedEvents).call(sortedEvents, function (event) {
    var _context8;
    var checkbox = /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
      className: "themedCheckBox",
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        className: classes.checkboxPadding,
        disabled: !canManageEvents && (0, _includes["default"])(pinnedTo).call(pinnedTo, event.id),
        checked: (0, _includes["default"])(_context8 = eventUpdates.added).call(_context8, event.id),
        onChange: function onChange(e, checked) {
          return handleEventToggle(event.id, checked);
        }
      }),
      label: event.name,
      sx: {
        height: "48px",
        width: "100%",
        margin: "0px",
        padding: "7px"
      },
      classes: {
        label: classes.label
      }
    });
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      disablePadding: true,
      key: event.id,
      style: listStyles.item
    }, checkbox);
  })))), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, addToActions)), canPinToCollections && /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: dialog === "addToNewCollection",
    onClose: handleCloseAddNew,
    PaperProps: {
      sx: _objectSpread({}, addNewDialogStyles.content)
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    sx: {
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    sx: {
      fontWeight: "400",
      fontSize: "22px"
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.addToColl"))), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    sx: {
      paddingTop: "25px",
      paddingBottom: "25px",
      borderTop: "none",
      borderBottom: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "new-collection-name",
    value: newCollection,
    variant: "standard",
    style: {
      backgroundColor: "#2C2D2F"
    } // Force correct background color in Map app
    ,
    label: (0, _i18n.getTranslation)("global.sharedComponents.pinToDialog.enterName"),
    fullWidth: true,
    onChange: handleNewCollectionChange,
    errorText: errorText,
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, addNewActions)));
};
var _default = PinToDialog;
exports["default"] = _default;