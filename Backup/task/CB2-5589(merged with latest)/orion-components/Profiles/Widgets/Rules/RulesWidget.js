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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../../Apm");
var _material = require("@mui/material");
var _ruleBuilder = _interopRequireDefault(require("../../../rule-builder"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var RulesWidget = function RulesWidget(_ref) {
  var _context, _context3;
  var contextId = _ref.contextId,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    expanded = _ref.expanded,
    rules = _ref.rules,
    canViewRules = _ref.canViewRules,
    canManage = _ref.canManage,
    userId = _ref.userId,
    collections = _ref.collections,
    entityType = _ref.entityType,
    context = _ref.context,
    hasLinks = _ref.hasLinks,
    order = _ref.order,
    selected = _ref.selected,
    enabled = _ref.enabled,
    loadProfile = _ref.loadProfile,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    return function () {
      if (!expanded) dispatch(unsubscribeFromFeed(contextId, "rules", subscriberRef));
    };
  }, []);
  var hideButton = function hideButton(entityType, context) {
    if (entityType === "shapes" && context.entity.entityData.type === "LineString" && context.entity.entityData.geometry.coordinates.length > 2) {
      return true;
    } else if (entityType === "shapes" && !context.entity.isPublic) {
      return true;
    } else {
      return false;
    }
  };
  var cardStyles = {
    card: {
      marginBottom: ".75rem"
    },
    header: {
      backgroundColor: "#41454A",
      maxHeight: 50,
      display: "flex",
      alignItems: "center"
    },
    media: {
      borderLeft: "1px solid #41454A",
      borderRight: "1px solid #41454A",
      borderBottom: "1px solid #41454A"
    }
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("section", {
    className: (0, _concat["default"])(_context = "rules-widget widget-wrapper ".concat("index-" + order, " ")).call(_context, expanded ? "expanded" : "collapsed")
  }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.rules.title"
  })), !hideButton(entityType, context) && canManage ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    variant: "text",
    onClick: function onClick() {
      var _context2;
      return window.location.replace((0, _concat["default"])(_context2 = "/rules-app/#/create/track-movement?".concat(entityType === "shapes" ? "createTargets" : "createSubjects", "=")).call(_context2, contextId));
    }
  }, (0, _i18n.getTranslation)("global.profiles.widgets.rules.newRule"))) : null), rules !== undefined && rules.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, (0, _map["default"])(_context3 = (0, _filter["default"])(rules).call(rules, function (rule) {
    return !!rule.assignments[userId];
  })).call(_context3, function (rule) {
    var assignments = rule.assignments,
      ownerName = rule.ownerName,
      id = rule.id,
      title = rule.title;
    var _assignments$userId = assignments[userId],
      notifySystem = _assignments$userId.notifySystem,
      notifyPush = _assignments$userId.notifyPush,
      notifyEmail = _assignments$userId.notifyEmail,
      isPriority = _assignments$userId.isPriority;
    return /*#__PURE__*/_react["default"].createElement(_material.Card, {
      style: cardStyles.card,
      key: id
    }, /*#__PURE__*/_react["default"].createElement(_material.CardHeader, {
      style: cardStyles.header,
      actAsExpander: true,
      iconStyle: {
        "float": "left"
      },
      showExpandableButton: true,
      title: title
    }), /*#__PURE__*/_react["default"].createElement(_material.CardMedia, {
      style: cardStyles.media,
      expandable: true
    }, /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "notify-types"
    }, isPriority && /*#__PURE__*/_react["default"].createElement("div", {
      className: "priority"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.rules.priority"
    })), notifySystem && /*#__PURE__*/_react["default"].createElement("i", {
      className: "material-icons"
    }, "laptop"), notifyPush && /*#__PURE__*/_react["default"].createElement("i", {
      className: "material-icons"
    }, "phone_iphone"), notifyEmail && /*#__PURE__*/_react["default"].createElement("i", {
      className: "material-icons"
    }, "email"), /*#__PURE__*/_react["default"].createElement("div", {
      className: "widget-option-button",
      style: dir == "rtl" ? {
        marginRight: "auto"
      } : {
        marginLeft: "auto"
      }
    }, canViewRules && /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      color: "primary",
      onClick: function onClick() {
        return window.location.replace("/rules-app/#/rule/".concat(id));
      }
    }, (0, _i18n.getTranslation)("global.profiles.widgets.rules.viewRule"))))), /*#__PURE__*/_react["default"].createElement("section", {
      className: "rule-info"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "cb-font-b7 clear"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.rules.createdBy",
      count: ownerName
    })), /*#__PURE__*/_react["default"].createElement("div", {
      id: "rule-statement",
      className: "cb-font-b9"
    }, (0, _ruleBuilder["default"])(rule, collections, loadProfile, hasLinks)))));
  })) : /*#__PURE__*/_react["default"].createElement("div", null));
};
var _default = (0, _Apm.withSpan)("rules-widget", "profile-widget")(RulesWidget);
exports["default"] = _default;