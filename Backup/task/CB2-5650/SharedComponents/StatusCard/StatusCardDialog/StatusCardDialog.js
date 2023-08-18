"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
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
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _EditText = _interopRequireDefault(require("./EditStatusControls/EditText"));
var _EditSlides = _interopRequireDefault(require("./EditStatusControls/EditSlides"));
var _lodash = _interopRequireDefault(require("lodash"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  open: _propTypes["default"].bool.isRequired,
  closeDialog: _propTypes["default"].func.isRequired,
  card: _propTypes["default"].object.isRequired,
  dir: _propTypes["default"].string
};
var StatusCardDialog = function StatusCardDialog(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    card = _ref.card,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(card.name),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    cardName = _useState2[0],
    setCardName = _useState2[1];
  var _useState3 = (0, _react.useState)(card.global),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    global = _useState4[0],
    setGlobal = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    data = _useState6[0],
    setData = _useState6[1];

  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  var setChildData = function setChildData(data) {
    setData(data);
  };
  var getComponentByType = function getComponentByType(dir) {
    var control = _lodash["default"].cloneDeep(card.data[0]);

    // Set a temporary property on the selected control item so that we may update
    // the selectedIndex if deletions would cause it to be out of bounds
    if (control.type !== "text") {
      control.items[control.selectedIndex].selected = true;
    }

    // TODO: If we choose to allow multiple data objects per card in the future,
    // this will need to be updated to account for that
    switch (control.type) {
      case "slides":
        return /*#__PURE__*/_react["default"].createElement(_EditSlides["default"], {
          control: control,
          setData: setChildData,
          dir: dir
        });
      case "text":
        return /*#__PURE__*/_react["default"].createElement(_EditText["default"], {
          control: control,
          setData: setChildData,
          global: global,
          dir: dir
        });
      case "selector":
        return;
      default:
        break;
    }
  };
  var handleNameChange = function handleNameChange(e) {
    setCardName(e.target.value);
  };
  var cancel = function cancel() {
    setCardName(card.name);
    setData(card.data[0]);
    closeDialog();
  };
  var save = function save() {
    var dataType = card.data[0].type;
    var selectedIndex = null;

    // Set selected index, accounting for item deletions, and remove the temporary property
    // that marks the selected item
    if (dataType !== "text") {
      var foundIndex = (0, _findIndex["default"])(data).call(data, function (item) {
        return item.selected;
      });
      selectedIndex = foundIndex > -1 ? foundIndex : 0;
      delete data[selectedIndex].selected;
    }
    var update = {
      name: cardName,
      global: global,
      data: [_objectSpread(_objectSpread(_objectSpread({
        attachments: []
      }, dataType === "text" && {
        body: data,
        type: "text"
      }), dataType === "slides" && {
        items: data,
        type: "slides",
        selectedIndex: selectedIndex || 0
      }), dataType === "select" && {
        items: data,
        type: "select",
        selectedIndex: card.data[0].selectedIndex
      })]
    };
    _clientAppCore.statusBoardService.update(card.id, update, function (err, res) {
      if (err) {
        console.log("Card update error", err);
      } else {
        console.log("Update resolve", res);
        closeDialog();
      }
    });
  };
  var deleteCard = function deleteCard() {
    _clientAppCore.statusBoardService["delete"](card.id);
  };
  var component = getComponentByType(dir);
  var styles = {
    inputLabelProps: _objectSpread(_objectSpread({
      color: "#B5B9BE"
    }, dir === "rtl" && {
      transformOrigin: "top right",
      textAlign: "right",
      right: "0"
    }), dir === "rtl" && {
      transformOrigin: "top left",
      textAlign: "left"
    }),
    formControlLabel: _objectSpread({}, dir === "rtl" && {
      marginRight: "-11px",
      marginLeft: "16px"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: open,
    confirm: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.save"),
      action: function action() {
        return save();
      }
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.cancel"),
      action: function action() {
        return cancel();
      }
    },
    deletion: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.delete"),
      action: function action() {
        return deleteCard();
      }
    },
    options: {
      maxWidth: "xs",
      fullWidth: true
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      minHeight: "500px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.fieldLabel.cardName"),
    fullWidth: true,
    margin: "normal",
    value: cardName,
    variant: "standard",
    onChange: handleNameChange,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
    InputLabelProps: {
      style: styles.inputLabelProps
    }
  }), /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
    className: "statusCardCheckbox",
    control: /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], {
      checked: global,
      onChange: function onChange() {
        return setGlobal(!global);
      }
    }),
    label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.global"),
    style: styles.formControlLabel
  }), component));
};
StatusCardDialog.propTypes = propTypes;
var _default = StatusCardDialog;
exports["default"] = _default;