"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
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
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _iconsMaterial = require("@mui/icons-material");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _i18n = require("orion-components/i18n");
var _find = _interopRequireDefault(require("lodash/find"));
var _without = _interopRequireDefault(require("lodash/without"));
var _map = _interopRequireDefault(require("lodash/map"));
var _includes2 = _interopRequireDefault(require("lodash/includes"));
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    color: "#FFF",
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
};
var propTypes = {
  classes: _propTypes["default"].object,
  users: _propTypes["default"].array,
  locations: _propTypes["default"].array,
  groups: _propTypes["default"].array,
  departments: _propTypes["default"].array,
  districts: _propTypes["default"].array,
  updateEvent: _propTypes["default"].func.isRequired,
  contextId: _propTypes["default"].string.isRequired,
  settings: _propTypes["default"].object.isRequired,
  zones: _propTypes["default"].array,
  isPublic: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  users: [],
  locations: [],
  groups: [],
  departments: [],
  districts: [],
  zones: [],
  isPublic: false,
  dir: "ltr"
};
var EditView = function EditView(_ref) {
  var settings = _ref.settings,
    zones = _ref.zones,
    updateEvent = _ref.updateEvent,
    contextId = _ref.contextId,
    classes = _ref.classes,
    users = _ref.users,
    locations = _ref.locations,
    groups = _ref.groups,
    departments = _ref.departments,
    districts = _ref.districts,
    isPublic = _ref.isPublic,
    dir = _ref.dir;
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useState3 = (0, _react.useState)(),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    settingsState = _useState4[0],
    setSettingsState = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    edited = _useState6[0],
    setEdited = _useState6[1];
  var dispatch = (0, _reactRedux.useDispatch)();
  var inlineStyles = {
    textAlignRight: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    }),
    listItemSecondaryAction: _objectSpread({}, dir === "rtl" && {
      right: "unset",
      left: 16
    }),
    grid: {
      borderRight: "1px solid rgba(255, 255, 255, 0.12)",
      marginTop: 6
    }
  };
  (0, _react.useEffect)(function () {
    if (!edited && !(0, _reactFastCompare["default"])(settings, settingsState)) setEdited(true);
    if (edited && (0, _reactFastCompare["default"])(settings, settingsState)) setEdited(false);
  }, [edited, settings, settingsState]);
  var handleChange = function handleChange(name) {
    return function (event) {
      var id = event.target.value;
      setSettingsState(_objectSpread(_objectSpread({}, settingsState), {}, (0, _defineProperty2["default"])({}, name, id)));
      if (name === "shape_id") {
        var shape = (0, _find["default"])(zones, ["id", id]);
        if (shape) setSettingsState(_objectSpread(_objectSpread({}, settingsState), {}, {
          shape_id: id,
          shape_points: shape.coordinates
        }));
      }
    };
  };
  var handleToggle = function handleToggle(name) {
    setSettingsState(_objectSpread(_objectSpread({}, settingsState), {}, (0, _defineProperty2["default"])({}, name, !settingsState[name])));
  };
  var handleExpand = function handleExpand(id) {
    expanded[id] ? setExpanded(_objectSpread(_objectSpread({}, expanded), {}, (0, _defineProperty2["default"])({}, id, false))) : setExpanded(_objectSpread(_objectSpread({}, expanded), {}, (0, _defineProperty2["default"])({}, id, true)));
  };
  var _handleSelect = function handleSelect(field, id) {
    var hasField = settingsState[field];
    var update;
    if (!hasField) {
      update = [id];
    }
    if (hasField) {
      var _context;
      var newFieldSettings = (0, _toConsumableArray2["default"])(settingsState[field]);
      if ((0, _includes["default"])(_context = settingsState[field]).call(_context, id)) {
        update = (0, _filter["default"])(newFieldSettings).call(newFieldSettings, function (value) {
          return value !== id;
        });
      } else {
        var _context2;
        update = (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(newFieldSettings), [id]);
      }
    }
    setSettingsState(_objectSpread(_objectSpread({}, settingsState), {}, (0, _defineProperty2["default"])({}, field, update)));
  };
  var handleRemove = function handleRemove(field, id) {
    setSettingsState(_objectSpread(_objectSpread({}, settingsState), {}, (0, _defineProperty2["default"])({}, field, (0, _without["default"])(settingsState[field], id))));
  };
  var handleCancel = function handleCancel() {
    setSettingsState(settings);
  };
  var handleUpdate = function handleUpdate() {
    var update = {
      additionalProperties: _objectSpread({}, settingsState)
    };
    dispatch(updateEvent(contextId, update));
    setEdited(false);
  };
  var renderActions = function renderActions() {
    var node = document.getElementById("widget-actions");
    return node && /*#__PURE__*/_react["default"].createElement(_CBComponents.Portal, {
      node: node
    }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: handleCancel
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.shieldGroup.editView.cancel"
    })), /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: handleUpdate,
      color: "primary"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.shieldGroup.editView.save"
    }))));
  };
  var threadId = settingsState.threadId,
    points_of_contact = settingsState.points_of_contact,
    location_id = settingsState.location_id,
    shape_id = settingsState.shape_id,
    shareToCMS = settingsState.shareToCMS,
    limited_to_audience = settingsState.limited_to_audience,
    recurring_notification = settingsState.recurring_notification,
    push_disabled = settingsState.push_disabled,
    audience_groups = settingsState.audience_groups,
    audience_departments = settingsState.audience_departments,
    audience_districts = settingsState.audience_districts,
    audience_individuals = settingsState.audience_individuals;
  var admins = {};
  (0, _forEach["default"])(users).call(users, function (user) {
    if (user.role_id === 3) {
      admins[user.id] = {
        label: user.name,
        searchString: user.name
      };
    }
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, edited && renderActions(), threadId && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "h6"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.editView.threadId",
    count: threadId
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    justify: "space-between",
    spacing: 24
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    md: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "points_of_contact",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.fieldLabel.pointOfContact"),
    multiple: true,
    items: users,
    value: points_of_contact || [],
    handleChange: handleChange("points_of_contact"),
    maxHeight: 315,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "location",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.fieldLabel.predefinedLocation"),
    items: locations,
    value: location_id || "",
    handleChange: handleChange("location_id"),
    maxHeight: 315,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    value: ""
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.editView.fieldLabel.none"
  }))), /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "bulletin-zone",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.fieldLabel.bulletinZone"),
    items: zones,
    value: shape_id || "",
    handleChange: handleChange("shape_id"),
    maxHeight: 315,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    value: ""
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.editView.fieldLabel.none"
  })))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    md: 12
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.shareToCMS"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: inlineStyles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    color: "primary",
    checked: shareToCMS,
    onChange: function onChange() {
      return handleToggle("shareToCMS");
    },
    disabled: !isPublic
  }))), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.visibleToAll"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: inlineStyles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    color: "primary",
    checked: !limited_to_audience,
    onChange: function onChange() {
      return handleToggle("limited_to_audience");
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.notifyOnEntry"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: inlineStyles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    color: "primary",
    checked: recurring_notification,
    onChange: function onChange() {
      return handleToggle("recurring_notification");
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.disableNotifications"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: inlineStyles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    color: "primary",
    checked: push_disabled,
    onChange: function onChange() {
      return handleToggle("push_disabled");
    }
  })))))), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      margin: "16px 0"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "h6"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.editView.audiences"
  })), /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    justify: "space-between",
    spacing: 24
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    sm: 12,
    style: inlineStyles.grid
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    className: classes.root,
    onClick: function onClick() {
      return handleExpand("groups");
    },
    disableGutters: true,
    disableTouchRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.groups"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), expanded["groups"] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded["groups"]
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(groups, function (group) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: group.id
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: group.name,
      primaryTypographyProps: {
        noWrap: true
      },
      style: inlineStyles.textAlignRight
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: inlineStyles.listItemSecondaryAction
    }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
      onClick: function onClick() {
        return _handleSelect("audience_groups", group.id);
      },
      checked: (0, _includes2["default"])(audience_groups, group.id),
      color: "primary"
    })));
  })))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    sm: 12,
    style: inlineStyles.grid
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    className: classes.root,
    onClick: function onClick() {
      return handleExpand("departments");
    },
    disableGutters: true,
    disableTouchRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.departments"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), expanded["departments"] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded["departments"]
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(departments, function (department) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: department.id
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: department.name,
      primaryTypographyProps: {
        noWrap: true
      },
      style: inlineStyles.textAlignRight
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: inlineStyles.listItemSecondaryAction
    }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
      onClick: function onClick() {
        return _handleSelect("audience_departments", department.id);
      },
      checked: (0, _includes2["default"])(audience_departments, department.id),
      color: "primary"
    })));
  })))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    sm: 12,
    style: inlineStyles.grid
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    className: classes.root,
    onClick: function onClick() {
      return handleExpand("districts");
    },
    disableGutters: true,
    disableTouchRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.districts"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), expanded["districts"] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded["districts"]
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(districts, function (district) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: district.id
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: district.name,
      primaryTypographyProps: {
        noWrap: true
      },
      style: inlineStyles.textAlignRight
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: inlineStyles.listItemSecondaryAction
    }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
      onClick: function onClick() {
        return _handleSelect("audience_districts", district.id);
      },
      checked: (0, _includes2["default"])(audience_districts, district.id),
      color: "primary"
    })));
  })))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    lg: 6,
    sm: 12,
    style: inlineStyles.grid
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    className: classes.root,
    onClick: function onClick() {
      return handleExpand("individuals");
    },
    disableGutters: true,
    disableTouchRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.individuals"),
    primaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), expanded["individuals"] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded["individuals"],
    style: expanded["individuals"] ? {
      overflow: "visible"
    } : {}
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    }), {}, {
      paddingTop: 0
    })
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SearchSelectField, {
    id: "individual-search",
    items: admins,
    selected: audience_individuals,
    handleSelect: function handleSelect(id) {
      return _handleSelect("audience_individuals", id);
    },
    placeholder: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.editView.searchForIndividuals"),
    dir: dir
  })), (0, _map["default"])((0, _filter2["default"])(users, function (individual) {
    return (0, _includes2["default"])(settingsState["audience_individuals"], individual.id);
  }), function (individual) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: individual.id
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: individual.name,
      primaryTypographyProps: {
        noWrap: true
      },
      style: inlineStyles.textAlignRight
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: inlineStyles.listItemSecondaryAction
    }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      onClick: function onClick() {
        return handleRemove("audience_individuals", individual.id);
      }
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null))));
  })))))));
};
EditView.propTypes = propTypes;
EditView.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(EditView);
exports["default"] = _default;