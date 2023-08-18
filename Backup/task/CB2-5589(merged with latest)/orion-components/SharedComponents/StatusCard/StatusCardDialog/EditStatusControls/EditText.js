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
var _react = _interopRequireWildcard(require("react"));
var _draftJs = require("draft-js");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  control: _propTypes["default"].object.isRequired,
  setData: _propTypes["default"].func.isRequired,
  global: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var styles = {
  container: {
    width: "100%",
    height: "100%"
  }
};
var handleChange = function handleChange(value, setText, setData, changed, setChanged, setEditorData) {
  if (!changed) {
    setChanged(1);
  }
  setText(value);
  // Convert to raw format and send to parent component to use when saving
  var contentState = value.getCurrentContent();
  var raw = (0, _draftJs.convertToRaw)(contentState);
  setEditorData(raw);
  setData(raw);
};
var stopPropagation = function stopPropagation(e) {
  e.stopPropagation();
};
var EditText = function EditText(_ref) {
  var control = _ref.control,
    setData = _ref.setData,
    global = _ref.global,
    dir = _ref.dir;
  var body = control.body;
  var _useState = (0, _react.useState)(_draftJs.EditorState.createEmpty()),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    text = _useState2[0],
    setText = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    changed = _useState4[0],
    setChanged = _useState4[1];
  var _useState5 = (0, _react.useState)(body),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    editorData = _useState6[0],
    setEditorData = _useState6[1];
  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event

  // On mount, if a body exists, convert it and set it
  (0, _react.useEffect)(function () {
    if (body && !changed) {
      setText(_draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(body)));
    }
  }, [body, changed]);
  (0, _react.useEffect)(function () {
    setData(editorData);
  }, [global]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "text-boundary",
    style: styles.container,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
    editorState: text,
    toolbarClassName: "toolbarClassName",
    wrapperClassName: "textAreaWrapper",
    editorClassName: dir == "rtl" ? "textEditorRTL" : "textEditor",
    onEditorStateChange: function onEditorStateChange(value) {
      return handleChange(value, setText, setData, changed, setChanged, setEditorData);
    },
    toolbar: {
      options: ["inline", "fontSize", "list", "history"],
      inline: {
        options: ["bold", "italic", "underline"]
      },
      fontSize: {
        options: ["14", "16", "18", "24"],
        dropdownClassName: "fontDropdown"
      },
      list: {
        options: ["unordered", "ordered"]
      }
    }
  }));
};
EditText.propTypes = propTypes;
var _default = EditText;
exports["default"] = _default;