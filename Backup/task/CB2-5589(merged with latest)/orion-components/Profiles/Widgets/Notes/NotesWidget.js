"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Reflect$construct = require("@babel/runtime-corejs3/core-js-stable/reflect/construct");
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
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _CBComponents = require("../../../CBComponents");
var _mdiMaterialUi = require("mdi-material-ui");
var _quillImageDropModule = require("quill-image-drop-module");
var _reactQuill = _interopRequireDefault(require("react-quill"));
var _i18n = require("orion-components/i18n");
var _quill = _interopRequireDefault(require("quill"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context8, _context9; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context8 = ownKeys(Object(source), !0)).call(_context8, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context9 = ownKeys(Object(source))).call(_context9, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
_quill["default"].register("modules/imageDrop", _quillImageDropModule.ImageDrop);
var NotesWidget = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(NotesWidget, _Component);
  var _super = _createSuper(NotesWidget);
  function NotesWidget(props) {
    var _context2, _context3, _context4, _context5;
    var _this;
    (0, _classCallCheck2["default"])(this, NotesWidget);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleExpand", function () {
      _this.props.selectWidget("Notes");
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleLaunch", function () {
      var _this$props = _this.props,
        contextId = _this$props.contextId,
        entityType = _this$props.entityType;

      // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
      if (entityType === "event") {
        window.open("/events-app/#/entity/".concat(contextId, "/widget/notes"));
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "replaceWhitespace", function (str) {
      var newStr = (0, _slice["default"])(str).call(str).split(" ").join("&nbsp;");
      newStr = (0, _slice["default"])(str).call(str).split("img&nbsp;").join("img ");
      return newStr;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "saveEdit", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(forceUpdate) {
        var notes;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (forceUpdate === undefined) {
                forceUpdate = !_this.state.hasUpdated;
              }
              if (forceUpdate) {
                notes = {
                  path: _this.props.notes ? _this.props.notes.path ? _this.props.notes.path : "" : "",
                  html: _this.replaceWhitespace(_this.state.currentHtml),
                  name: "notes"
                };
                if (_this.state.currentHtml === "<p><br></p>") {
                  _this.props.deleteNotes(_this.props.event.id);
                  if (_this.props.updateNotesStatus) _this.props.updateNotesStatus(false);
                } else {
                  _this.props.updateNotes(_this.props.event, [notes]);
                  if (_this.props.updateNotesStatus) _this.props.updateNotesStatus(false);
                }
                _this.setState({
                  hasChanged: false,
                  hasUpdated: false,
                  actors: [],
                  updatedHTML: "",
                  notesChanged: false
                });
              } else {
                _this.props.openDialog("notesWidgetDialog");
              }
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "cancelEdit", function () {
      if (_this.props.updateNotesStatus) _this.props.updateNotesStatus(false);
      _this.setState({
        originalHTML: _this.replaceWhitespace(_this.props.notes.html),
        currentHtml: _this.replaceWhitespace(_this.props.notes.html),
        beforeChange: _this.replaceWhitespace(_this.props.notes.html),
        updatedHTML: "",
        actors: [],
        hasChanged: false,
        notesChanged: false
      });
    });
    _this.state = {
      currentHtml: "",
      beforeChange: "",
      originalHTML: "",
      updatedHTML: "",
      actor: [],
      theme: "snow",
      hasChanged: false,
      hasUpdated: false,
      revert: false,
      notesChanged: false
    };
    _this.reactQuillRef = null;
    _this.replaceWhitespace = (0, _bind["default"])(_context2 = _this.replaceWhitespace).call(_context2, (0, _assertThisInitialized2["default"])(_this));
    _this.handleChange = (0, _bind["default"])(_context3 = _this.handleChange).call(_context3, (0, _assertThisInitialized2["default"])(_this));
    _this.cancelEdit = (0, _bind["default"])(_context4 = _this.cancelEdit).call(_context4, (0, _assertThisInitialized2["default"])(_this));
    _this.saveEdit = (0, _bind["default"])(_context5 = _this.saveEdit).call(_context5, (0, _assertThisInitialized2["default"])(_this));
    return _this;
  }
  (0, _createClass2["default"])(NotesWidget, [{
    key: "handleChange",
    value: function handleChange(content, delta, source, editor) {
      var imgCount = (editor.getHTML().match(/<img/g) || []).length;
      if (editor.getText().length <= 10000 && imgCount <= 10) {
        var html = editor.getHTML();
        var change = this.replaceWhitespace(html);
        var original = this.replaceWhitespace(this.state.originalHTML);
        var hasChanged = original !== change;
        if (this.props.updateNotesStatus) this.props.updateNotesStatus(hasChanged);
        this.setState({
          currentHtml: html,
          beforeChange: html,
          hasChanged: hasChanged,
          revert: false,
          notesChanged: hasChanged
        });
      } else {
        this.setState({
          revert: true
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextState.revert !== this.state.revert && nextState.revert) {
        return true;
      }
      if (nextState.currentHtml !== this.state.currentHtml) {
        return true;
      }
      if (nextProps.dialog !== this.props.dialog) {
        return true;
      }
      if (this.state.updatedHTML !== nextState.updatedHTML) {
        return true;
      }
      if (this.props.selected !== nextProps.selected || this.props.enabled !== nextProps.expanded || this.props.expanded !== nextProps.expanded) {
        return true;
      }
      return false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.dir === "rtl") {
        var quillEditor = document.getElementsByClassName("ql-editor");
        if (quillEditor.length > 0) {
          for (var i = 0; i < quillEditor.length; i++) {
            quillEditor[i].style.direction = "rtl";
            quillEditor[i].style["text-align"] = "right";
            quillEditor[i].style[" unicode-bidi"] = "bidi-override;";
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _context6,
        _this2 = this,
        _context7;
      var _this$props2 = this.props,
        selected = _this$props2.selected,
        order = _this$props2.order,
        expanded = _this$props2.expanded,
        enabled = _this$props2.enabled,
        disabled = _this$props2.disabled,
        canContribute = _this$props2.canContribute,
        widgetsExpandable = _this$props2.widgetsExpandable,
        secondaryExpanded = _this$props2.secondaryExpanded,
        widgetsLaunchable = _this$props2.widgetsLaunchable,
        event = _this$props2.event,
        dir = _this$props2.dir;
      return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("section", {
        id: "notes-wrapper",
        className: (0, _concat["default"])(_context6 = "".concat(expanded ? "expanded" : "collapsed", " ")).call(_context6, "index-" + order, " widget-wrapper")
      }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
        id: "notes-widget",
        className: "widget-content"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "widget-header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "cb-font-b2"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.profiles.widgets.notes.title"
      })), /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.FileDocumentEditOutline, {
        style: _objectSpread(_objectSpread({
          color: "".concat(event.notes ? "#4eb5f3" : "#b5b9be")
        }, dir === "rtl" && {
          marginRight: "5px"
        }), dir === "ltr" && {
          marginLeft: "5px"
        })
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "widget-header-buttons"
      }, secondaryExpanded && this.state.notesChanged && /*#__PURE__*/_react["default"].createElement("div", {
        className: "widget-option-button"
      }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
        variant: "text",
        color: "primary",
        onClick: function onClick() {
          return _this2.cancelEdit();
        }
      }, (0, _i18n.getTranslation)("global.profiles.widgets.notes.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
        variant: "text",
        color: "primary",
        onClick: function onClick() {
          return _this2.saveEdit();
        }
      }, (0, _i18n.getTranslation)("global.profiles.widgets.notes.save"))), !disabled && widgetsExpandable && /*#__PURE__*/_react["default"].createElement("div", {
        className: "widget-expand-button"
      }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: _objectSpread(_objectSpread({
          width: "auto"
        }, dir === "rtl" && {
          paddingLeft: 0
        }), dir === "ltr" && {
          paddingRight: 0
        }),
        onClick: function onClick() {
          return _this2.handleExpand();
        }
      }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))), !disabled && widgetsLaunchable && /*#__PURE__*/_react["default"].createElement("div", {
        className: "widget-expand-button"
      }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: _objectSpread(_objectSpread({
          width: "auto"
        }, dir === "rtl" && {
          paddingLeft: 0
        }), dir === "ltr" && {
          paddingRight: 0
        }),
        onClick: function onClick() {
          return _this2.handleLaunch();
        }
      }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))))), secondaryExpanded && /*#__PURE__*/_react["default"].createElement("div", {
        className: "notes-quill"
      }, /*#__PURE__*/_react["default"].createElement(_reactQuill["default"], {
        value: this.state.currentHtml,
        ref: function ref(el) {
          _this2.reactQuillRef = el;
        },
        onChange: (0, _bind["default"])(_context7 = this.handleChange).call(_context7, this),
        theme: this.state.theme,
        modules: canContribute ? NotesWidget.modules : {
          toolbar: false
        },
        formats: NotesWidget.formats,
        readOnly: !canContribute,
        bounds: "#notes-widget",
        style: {},
        placeholder: this.props.placeholder,
        className: dir == "rtl" ? "editorStylesRTL" : ""
      }))), expanded && /*#__PURE__*/_react["default"].createElement("div", {
        id: "notes-widget",
        className: "widget-content"
      }, /*#__PURE__*/_react["default"].createElement(_reactQuill["default"], {
        value: this.state.currentHtml,
        ref: function ref(el) {
          _this2.reactQuillRef = el;
        },
        onChange: this.handleChange,
        theme: this.state.theme,
        modules: canContribute ? NotesWidget.modules : {
          toolbar: false
        },
        formats: NotesWidget.formats,
        readOnly: !canContribute,
        bounds: "#notes-widget",
        style: {},
        placeholder: this.props.placeholder,
        className: dir == "rtl" ? "editorStylesRTL" : ""
      }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
        open: this.props.dialog === "notesWidgetDialog",
        title: (0, _i18n.getTranslation)("global.profiles.widgets.notes.conflictingChanges"),
        textContent: this.state.actor[0] ? this.state.actor.length < 2 ? (0, _i18n.getTranslation)("global.profiles.widgets.notes.textContent1", this.state.actor[0].name) : (0, _i18n.getTranslation)("global.profiles.widgets.notes.textContent2") : "",
        confirm: {
          action: function action() {
            _this2.saveEdit(true);
            _this2.props.closeDialog("notesWidgetDialog");
          },
          label: (0, _i18n.getTranslation)("global.profiles.widgets.notes.confirm")
        },
        abort: {
          action: function action() {
            return _this2.props.closeDialog("notesWidgetDialog");
          },
          label: (0, _i18n.getTranslation)("global.profiles.widgets.notes.cancel")
        },
        dir: dir
      }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
        open: this.props.dialog === "notesWidgetLoadingDialog",
        title: (0, _i18n.getTranslation)("global.profiles.widgets.notes.uploading"),
        textContent: (0, _i18n.getTranslation)("global.profiles.widgets.notes.uploadingNewImages"),
        dir: dir
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      //If an event does not have a notes object, we need to create an empty one
      if (nextProps.event && !nextProps.notes) {
        return {
          originalHTML: "<p><br></p>",
          currentHtml: "<p><br></p>",
          beforeChange: "<p><br></p>"
        };
      }

      //initial loading of the notes and keep loading updates to the notes until user makes changes
      if (nextProps.notes && !prevState.originalHTML || nextProps.notes && nextProps.notes.html !== prevState.originalHTML && !prevState.hasChanged) {
        return {
          originalHTML: nextProps.notes.html,
          currentHtml: nextProps.notes.html,
          beforeChange: nextProps.notes.html
        };
      }

      //We need a flag for when a user is making changes, but the notes has updated since the user started making changes
      if (prevState.hasChanged && nextProps.notes && nextProps.notes.html !== prevState.originalHTML) {
        var newState = {
          hasUpdated: true
        };
        //Flags that will help grab the names of users who made changes while user was editing
        if (!prevState.updatedHTML) {
          newState["updatedHTML"] = nextProps.notes.html;
          newState["actor"] = [nextProps.activities[0].actor];
        } else {
          newState["updatedHTML"] = nextProps.notes.html;
          if (nextProps.activities[0].actor.id !== prevState.actor[0].id) {
            newState["actor"] = prevState.actor;
            newState.actor.push(nextProps.activities[0].actor);
          }
        }
        return newState;
      }
      return null;
    }
  }]);
  return NotesWidget;
}(_react.Component);
NotesWidget.modules = {
  toolbar: [[{
    header: "1"
  }, {
    header: "2"
  }], ["bold", "italic", "underline", "strike"], [{
    list: "ordered"
  }, {
    list: "bullet"
  }, {
    indent: "-1"
  }, {
    indent: "+1"
  }], ["link", "image"], ["clean"]],
  imageDrop: true
};
NotesWidget.formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];
var _default = NotesWidget;
exports["default"] = _default;