"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _ProximityDialog = _interopRequireDefault(require("./components/ProximityDialog"));
var _ProximityCard = _interopRequireDefault(require("./components/ProximityCard"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context4; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context4 = Object.prototype.toString.call(o)).call(_context4, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var propTypes = {
  selected: _propTypes["default"].bool,
  expanded: _propTypes["default"].bool,
  order: _propTypes["default"].number,
  event: _propTypes["default"].object.isRequired,
  enabled: _propTypes["default"].bool,
  widgetsExpandable: _propTypes["default"].bool,
  dialog: _propTypes["default"].string,
  openDialog: _propTypes["default"].func,
  closeDialog: _propTypes["default"].func,
  contextId: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  eventEnded: _propTypes["default"].bool,
  readOnly: _propTypes["default"].bool,
  loadProfile: _propTypes["default"].func,
  selectWidget: _propTypes["default"].func,
  startProximityEntitiesStream: _propTypes["default"].func,
  unsubscribeFromFeed: _propTypes["default"].func,
  subscriberRef: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  forReplay: _propTypes["default"].bool
};
var defaultProps = {
  selected: false,
  expanded: false,
  order: 0,
  enabled: false,
  widgetsExpandable: false,
  dialog: null,
  openDialog: null,
  closeDialog: null,
  eventEnded: null,
  readOnly: false,
  loadProfile: null,
  selectWidget: null,
  startProximityEntitiesStream: null,
  unsubscribeFromFeed: null,
  subscriberRef: "",
  dir: "ltr",
  forReplay: false
};
var ProximityWidget = function ProximityWidget(_ref) {
  var _context2, _context3;
  var selected = _ref.selected,
    expanded = _ref.expanded,
    canManage = _ref.canManage,
    order = _ref.order,
    event = _ref.event,
    enabled = _ref.enabled,
    widgetsExpandable = _ref.widgetsExpandable,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    contextId = _ref.contextId,
    context = _ref.context,
    eventEnded = _ref.eventEnded,
    readOnly = _ref.readOnly,
    loadProfile = _ref.loadProfile,
    selectWidget = _ref.selectWidget,
    startProximityEntitiesStream = _ref.startProximityEntitiesStream,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    dir = _ref.dir,
    forReplay = _ref.forReplay;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)({
      distanceUnits: "mi",
      lineType: "Solid",
      lineWidth: 3,
      name: "",
      polyFill: "#0073c8",
      polyFillOpacity: 0.2,
      polyStroke: "#2face8",
      radius: ""
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    proximity = _useState2[0],
    setProximity = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isEditing = _useState4[0],
    setIsEditing = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    selectedProximityId = _useState6[0],
    setSelectedProximityId = _useState6[1];
  (0, _react.useEffect)(function () {
    if (!forReplay) {
      dispatch(unsubscribeFromFeed(contextId, "proximityEntities", subscriberRef));
      if (context.proximityEntities && context.proximityEntities.length > 0) {
        context.proximityEntities = [];
      }
      if (event.proximities && event.proximities.length > 0) {
        var radiuses = [];
        var _iterator = _createForOfIteratorHelper(event.proximities),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _proximity = _step.value;
            var radiusInKM = _proximity.distanceUnits === "mi" ? _proximity.radius * 1.609344 : _proximity.radius;
            radiuses.push(Number(radiusInKM));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        (0, _sort["default"])(radiuses).call(radiuses, function (a, b) {
          return a - b;
        });
        dispatch(startProximityEntitiesStream(contextId, event.entityData.geometry, radiuses, subscriberRef));
      }
    }
  }, [event.proximities]);
  var handleOpenDialog = function handleOpenDialog() {
    setIsEditing(false);
    setProximity(function (prevProximity) {
      return _objectSpread(_objectSpread({}, prevProximity), {}, {
        distanceUnits: "mi",
        lineType: "Solid",
        lineWidth: 3,
        name: "",
        polyFill: "#0073c8",
        polyFillOpacity: 0.2,
        polyStroke: "#2face8",
        radius: ""
      });
    });
    dispatch(openDialog("proximityDialog"));
  };
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Proximity"));
  };
  var handleLoadEntityDetails = function handleLoadEntityDetails(item) {
    dispatch(loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary"));
  };
  var handleRemoveProximity = function handleRemoveProximity(proximityId) {
    _clientAppCore.eventService.deleteProximity(contextId, proximityId, function (err, response) {
      if (err) console.log(err, response);
    });
  };
  var handleEditProximity = function handleEditProximity(proximityId) {
    var _context;
    var proximity = (0, _find["default"])(_context = event.proximities).call(_context, function (x) {
      return x.id === Number(proximityId);
    });
    setIsEditing(true);
    setSelectedProximityId(proximityId);
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      distanceUnits: proximity.distanceUnits,
      lineType: proximity.lineType,
      lineWidth: proximity.lineWidth,
      name: proximity.name,
      polyFill: proximity.polyFill,
      polyFillOpacity: proximity.polyFillOpacity,
      polyStroke: proximity.polyStroke,
      radius: proximity.radius
    }));
    dispatch(openDialog("proximityDialog"));
  };
  var handleChangeName = function handleChangeName(event) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      name: event.target.value
    }));
  };
  var handleChangeRadius = function handleChangeRadius(event) {
    var re = /^\d*\.?\d*$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
        radius: event.target.value
      }));
    }
  };
  var handleChangeDistanceUnits = function handleChangeDistanceUnits(event) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      distanceUnits: event.target.value
    }));
  };
  var handleChangeLineType = function handleChangeLineType(value) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      lineType: value
    }));
  };
  var handleChangeLineWidth = function handleChangeLineWidth(value) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      lineWidth: value
    }));
  };
  var handleChangePolyFill = function handleChangePolyFill(value) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      polyFill: value
    }));
  };
  var handleChangePolyFillOpacity = function handleChangePolyFillOpacity(value) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      polyFillOpacity: value / 100
    }));
  };
  var handleChangePolyStroke = function handleChangePolyStroke(value) {
    setProximity(_objectSpread(_objectSpread({}, proximity), {}, {
      polyStroke: value
    }));
  };
  var canCreateProximityArea = false;
  var canEditItems = false;
  var canRemoveItems = false;
  if (canManage) {
    canCreateProximityArea = true;
    canEditItems = true;
    canRemoveItems = true;
  }
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _concat["default"])(_context2 = "widget-wrapper ".concat(expanded ? "expanded" : "collapsed", " ")).call(_context2, "index-" + order)
  }, !expanded && !readOnly && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.main.title"
  })), canCreateProximityArea && !eventEnded && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleOpenDialog
  }, (0, _i18n.getTranslation)("global.profiles.widgets.proximity.main.createProxZone")), widgetsExpandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    }),
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, event.proximities && event.proximities.length > 0 ? (0, _map["default"])(_context3 = event.proximities).call(_context3, function (proximity) {
    return /*#__PURE__*/_react["default"].createElement(_ProximityCard["default"], {
      key: proximity.id,
      proximity: proximity,
      event: event,
      canEdit: canEditItems,
      canRemove: canRemoveItems,
      handleEdit: function handleEdit() {
        return handleEditProximity(proximity.id);
      },
      handleRemove: function handleRemove() {
        return handleRemoveProximity(proximity.id);
      },
      loadProfile: loadProfile,
      handleLoadEntityDetails: handleLoadEntityDetails,
      widgetExpanded: expanded,
      entities: context && context.proximityEntities ? context.proximityEntities : [],
      dir: dir
    });
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12
    },
    align: "center",
    variant: "caption",
    component: "p"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.main.noAssocProx"
  }))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_ProximityDialog["default"], {
    closeDialog: closeDialog,
    dialog: dialog,
    contextId: contextId,
    event: event,
    isEditing: isEditing,
    proximityId: selectedProximityId,
    name: proximity.name,
    radius: proximity.radius,
    distanceUnits: proximity.distanceUnits,
    fillColor: proximity.polyFill,
    strokeColor: proximity.polyStroke,
    strokeThickness: proximity.lineWidth,
    strokeType: proximity.lineType,
    transparency: proximity.polyFillOpacity * 100,
    handleChangeName: handleChangeName,
    handleChangeRadius: handleChangeRadius,
    handleChangeDistanceUnits: handleChangeDistanceUnits,
    handleChangeLineType: handleChangeLineType,
    handleChangeLineWidth: handleChangeLineWidth,
    handleChangePolyFill: handleChangePolyFill,
    handleChangePolyFillOpacity: handleChangePolyFillOpacity,
    handleChangePolyStroke: handleChangePolyStroke,
    dir: dir
  })));
};
ProximityWidget.propTypes = propTypes;
ProximityWidget.defaultProps = defaultProps;
var _default = ProximityWidget;
exports["default"] = _default;