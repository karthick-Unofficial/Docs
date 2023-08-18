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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents/");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _map2 = _interopRequireDefault(require("lodash/map"));
var _debounce = _interopRequireDefault(require("lodash/debounce"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  dialog: _propTypes["default"].string,
  title: _propTypes["default"].string,
  closeDialog: _propTypes["default"].func,
  entityId: _propTypes["default"].string,
  entityType: _propTypes["default"].string,
  entity: _propTypes["default"].object,
  linkEntities: _propTypes["default"].func,
  autoFocus: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  autoFocus: false,
  dir: "ltr"
};
var handleSubmit = function handleSubmit(entity, linkType, linkEntities, linkUpdates, linkedTo, dispatch) {
  var _context;
  // Filter out memberships from added collections
  var linkedEntities = (0, _filter["default"])(_context = linkUpdates.added).call(_context, function (value) {
    var linkedIds = (0, _map["default"])(linkedTo).call(linkedTo, function (link) {
      return link.id;
    });
    return !(0, _includes["default"])(linkedIds).call(linkedIds, value.id);
  });
  if (linkedEntities.length) {
    dispatch(linkEntities(entity, linkType, linkedEntities));
  }
};
var handleEntityToggle = function handleEntityToggle(entity, checked, linkUpdates, setLinkUpdates, linkedTo) {
  var added = (0, _toConsumableArray2["default"])(linkUpdates.added);
  var member = (0, _includes["default"])(linkedTo).call(linkedTo, entity.id);
  if (checked) {
    var _context2;
    setLinkUpdates({
      added: (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(added), [{
        type: entity.entityType,
        id: entity.id
      }])
    });
  } else if (!checked && member) {
    var values = (0, _filter["default"])(added).call(added, function (value) {
      return value.id !== entity.id;
    });
    setLinkUpdates({
      added: values
    });
  } else {
    var _values = (0, _filter["default"])(added).call(added, function (value) {
      return value.id !== entity.id;
    });
    setLinkUpdates({
      added: _values
    });
  }
};
var useStyles = (0, _styles.makeStyles)({
  label: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    padding: "0 20px"
  }
});
var LinkDialog = function LinkDialog(_ref) {
  var dialog = _ref.dialog,
    title = _ref.title,
    closeDialog = _ref.closeDialog,
    entity = _ref.entity,
    linkEntities = _ref.linkEntities,
    autoFocus = _ref.autoFocus,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    linkedTo = _useState2[0],
    setLinkedTo = _useState2[1];
  var _useState3 = (0, _react.useState)({
      added: []
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    linkUpdates = _useState4[0],
    setLinkUpdates = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    entities = _useState6[0],
    setEntities = _useState6[1];
  var _useState7 = (0, _react.useState)({
      querying: false,
      error: null
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    search = _useState8[0],
    setSearch = _useState8[1];
  var listStyles = {
    list: {
      maxHeight: "300px",
      overflow: "auto",
      flexBasis: "45%"
    },
    item: {
      backgroundColor: "#41454a",
      marginBottom: ".5rem",
      padding: 0
    },
    primaryText: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    subheader: {
      paddingLeft: 0,
      color: "white"
    }
  };
  var searchStyles = {
    error: {
      textAlign: "center",
      padding: "10px",
      color: "#fff"
    },
    progress: {
      textAlign: "center",
      padding: "15px 0"
    }
  };
  var handleQuery = function handleQuery(query) {
    var queryFinished = false;
    (0, _setTimeout2["default"])(function () {
      if (!queryFinished && query.length) {
        var _context3;
        setSearch.apply(void 0, (0, _concat["default"])(_context3 = (0, _toConsumableArray2["default"])(search)).call(_context3, [{
          querying: true
        }]));
      }
    }, 500);
    if (query.length) {
      var _context4, _context5;
      var serviceCall = entity.entityType === "camera" ? (0, _bind["default"])(_context4 = _clientAppCore.entityStore.getEntitiesForLinking).call(_context4, _clientAppCore.entityStore) : (0, _bind["default"])(_context5 = _clientAppCore.cameraService.getCamerasForLinking).call(_context5, _clientAppCore.cameraService);
      if (serviceCall) {
        serviceCall(entity.id, entity.entityType, query, 5, function (err, res) {
          queryFinished = true;
          if (err) {
            console.log(err);
            setSearch({
              error: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.errorText.errorOccurred"),
              querying: false
            });
          }
          if (!res || !res.success) {
            setSearch({
              error: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.errorText.errorOccurred"),
              querying: false
            });
            return;
          } else if (res.result instanceof Array && res.result.length < 1) {
            setSearch({
              error: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.errorText.noItemsFound"),
              querying: false
            });
          } else {
            var _context6;
            var _linkedTo = (0, _map2["default"])((0, _filter2["default"])(res.result, function (camera) {
              return camera.linkedWith;
            }), function (camera) {
              return {
                id: camera.id,
                entityType: "camera"
              };
            });
            var unlinkedEntities = (0, _filter["default"])(_context6 = res.result).call(_context6, function (entity) {
              var linkedIds = (0, _map["default"])(_linkedTo).call(_linkedTo, function (link) {
                return link.id;
              });
              return !(0, _includes["default"])(linkedIds).call(linkedIds, entity.id);
            });
            setLinkedTo(_linkedTo);
            setEntities(unlinkedEntities);
            setLinkUpdates({
              added: _linkedTo
            });
            setSearch({
              querying: false,
              error: null
            });
          }
        });
      }
    } else {
      queryFinished = true;
      setSearch({
        querying: false,
        error: null
      });
    }
  };
  var sortedEntities = (0, _sort["default"])(entities).call(entities, function (a, b) {
    if (a.entityData && b.entityData && a.entityData.properties && b.entityData.properties && a.entityData.properties.name && b.entityData.properties.name) {
      if (a.entityData.properties.name.toUpperCase() > b.entityData.properties.name.toUpperCase()) {
        return 1;
      }
      if (a.entityData.properties.name.toUpperCase() < b.entityData.properties.name.toUpperCase()) {
        return -1;
      }
    }
    return 0;
  });
  var handleSearch = (0, _debounce["default"])(function (e) {
    if (!e.target.value) {
      setLinkUpdates({
        added: []
      });
      setEntities([]);
      setLinkedTo([]);
      setSearch({
        querying: false,
        error: null
      });
    } else {
      handleQuery(e.target.value);
    }
  }, 500);
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "link-entity-dialog",
    options: {
      maxWidth: "sm"
    },
    title: title,
    confirm: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.continue"),
      action: function action() {
        handleSubmit(entity, "manually-assigned-camera", linkEntities, linkUpdates, linkedTo, dispatch);
        setLinkUpdates({
          added: []
        });
        setEntities([]);
        setLinkedTo([]);
        setSearch({
          querying: false,
          error: null
        });
        dispatch(closeDialog("link-entity-dialog"));
      }
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.cancel"),
      action: function action() {
        setLinkUpdates({
          added: []
        });
        setEntities([]);
        setLinkedTo([]);
        setSearch({
          querying: false,
          error: null
        });
        dispatch(closeDialog("link-entity-dialog"));
      }
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SearchField, {
    handleChange: handleSearch,
    handleClear: function handleClear() {
      setLinkUpdates({
        added: []
      });
      setEntities([]);
      setLinkedTo([]);
      setSearch({
        querying: false,
        error: null
      });
    },
    width: "320px",
    placeholder: (0, _i18n.getTranslation)("global.sharedComponents.linkDialog.wantToFind"),
    autoFocus: autoFocus,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      minWidth: "45%",
      margin: "0 1%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: listStyles.list
  }, search.querying ? /*#__PURE__*/_react["default"].createElement("div", {
    style: searchStyles.progress
  }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    size: 60,
    thickness: 5
  })) : search.error ? /*#__PURE__*/_react["default"].createElement("div", {
    style: searchStyles.error
  }, /*#__PURE__*/_react["default"].createElement("p", null, " ", search.error)) : (0, _map["default"])(sortedEntities).call(sortedEntities, function (entity) {
    var _context7;
    var checkbox = /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
      className: "themedCheckBox",
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        checked: (0, _some["default"])(_context7 = linkUpdates.added).call(_context7, function (added) {
          return added.id === entity.id;
        }),
        onChange: function onChange(e, checked) {
          return handleEntityToggle(entity, checked, linkUpdates, setLinkUpdates, linkedTo);
        }
      }),
      label: /*#__PURE__*/_react["default"].createElement("div", {
        style: listStyles.primaryText
      }, entity.entityData.properties.name),
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
      key: entity.id,
      style: listStyles.item
    }, checkbox);
  }))));
};
LinkDialog.propTypes = propTypes;
LinkDialog.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(LinkDialog);
exports["default"] = _default;