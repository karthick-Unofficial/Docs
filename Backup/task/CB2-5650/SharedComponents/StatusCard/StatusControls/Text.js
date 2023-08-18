"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var propTypes = {
  control: _propTypes["default"].object.isRequired,
  dir: _propTypes["default"].string
};
var styles = {
  container: {
    width: "100%",
    height: "calc(100% - 91px)",
    lineHeight: 1,
    position: "relative"
  },
  gradient: {
    background: "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(137,255,241,0)), color-stop(100%,rgb(73, 77, 83, 1)))",
    height: 30,
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 1,
    display: "none"
  }
};
var Text = function Text(_ref) {
  var control = _ref.control,
    dir = _ref.dir,
    id = _ref.id;
  var body = control.body;
  var _useState = (0, _react.useState)(_draftJs.EditorState.createEmpty()),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    text = _useState2[0],
    setText = _useState2[1];

  // On mount, if a body exists, convert it and set it
  (0, _react.useEffect)(function () {
    if (body) {
      setText(_draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(body)));
    }
  }, [body]);

  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  (0, _react.useEffect)(function () {
    var container = document.querySelector("#text-boundary_".concat(id, " .public-DraftEditor-content"));
    var gradientContainer = document.querySelector("#gradient_".concat(id));
    var maxHeight = window.getComputedStyle(container).getPropertyValue('max-height').replace("px", "");

    // gettings sortable textCard element to validate scrollHeight, avoiding conflicts from global status panel.
    var sortableContainer = document.querySelector(".grid-list-item #text-boundary_".concat(id, " .public-DraftEditor-content"));
    var gridContainer = document.querySelector("#grid-list-item".concat(id));

    //ResizeObserver is being used to monitor editor container scrollHeight and trigger truncation method if overflown.
    var observer = new ResizeObserver(function (entries) {
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          if (entry.target === container) {
            console.log(">>>", container.clientHeight, container.scrollHeight);
            if (container.scrollHeight > maxHeight) {
              gradientContainer.style.display = "block";
            } else {
              if (sortableContainer.clientHeight < 50) {
                gridContainer.classList.add("grid-list-short");
              } else {
                gridContainer.classList.remove("grid-list-short");
              }
              gradientContainer.style.display = "none";
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    observer.observe(container);
    return function () {
      observer.unobserve(container);
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "text-boundary_".concat(id),
    style: styles.container,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
    editorState: text,
    toolbarHidden: true,
    readOnly: true,
    toolbarClassName: "toolbarClassName",
    wrapperClassName: "textAreaWrapper",
    editorClassName: "viewOnlyEditor ".concat(dir == "rtl" ? "textEditorRTL" : "textEditor"),
    editorStyle: {
      color: "#B5B9BE"
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "gradient_".concat(id),
    style: styles.gradient
  }));
};
Text.propTypes = propTypes;
var _default = Text;
exports["default"] = _default;