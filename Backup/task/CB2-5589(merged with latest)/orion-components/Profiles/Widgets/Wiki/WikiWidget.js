(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "material-ui", "material-ui/svg-icons/maps/zoom-out-map", "../../../CBComponents", "react-quill", "quill-image-resize-module", "quill-image-drop-module/image-drop.min.js"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("material-ui"), require("material-ui/svg-icons/maps/zoom-out-map"), require("../../../CBComponents"), require("react-quill"), require("quill-image-resize-module"), require("quill-image-drop-module/image-drop.min.js"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.materialUi, global.zoomOutMap, global.CBComponents, global.reactQuill, global.quillImageResizeModule, global.imageDropMin);
		global.WikiWidget = mod.exports;
	}
})(this, function (exports, _react, _materialUi, _zoomOutMap, _CBComponents, _reactQuill, _quillImageResizeModule) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _zoomOutMap2 = _interopRequireDefault(_zoomOutMap);

	var _reactQuill2 = _interopRequireDefault(_reactQuill);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var WikiWidget = function (_Component) {
		_inherits(WikiWidget, _Component);

		function WikiWidget(props) {
			_classCallCheck(this, WikiWidget);

			var _this = _possibleConstructorReturn(this, (WikiWidget.__proto__ || Object.getPrototypeOf(WikiWidget)).call(this, props));

			_this.handleExpand = function () {
				_this.props.selectWidget("Wiki");
			};

			_this.replaceWhitespace = function (str) {
				var newStr = str.slice().split(" ").join("&nbsp;");
				newStr = str.slice().split("img&nbsp;").join("img ");
				return newStr;
			};

			_this.saveEdit = function (forceUpdate) {

				if (forceUpdate === undefined) {
					forceUpdate = !_this.state.hasUpdated;
				}

				if (forceUpdate) {
					_this.props.updateWiki(_this.props.event, _this.replaceWhitespace(_this.state.currentHtml));
					_this.props.updateWikiStatus(false);
					_this.setState({
						hasChanged: false,
						hasUpdated: false,
						actors: [],
						updatedHTML: ""
					});
				} else {
					_this.props.openDialog("wikiWidgetDialog");
				}
			};

			_this.cancelEdit = function () {
				_this.props.updateWikiStatus(false);
				_this.setState({
					originalHTML: _this.replaceWhitespace(_this.props.wiki),
					currentHtml: _this.replaceWhitespace(_this.props.wiki),
					beforeChange: _this.replaceWhitespace(_this.props.wiki),
					updatedHTML: "",
					actors: [],
					hasChanged: false
				});
			};

			_this.state = {
				currentHtml: "",
				beforeChange: "",
				originalHTML: "",
				updatedHTML: "",
				actor: [],
				theme: "snow",
				hasChanged: false,
				hasUpdated: false
			};
			_this.reactQuillRef = null;
			_this.replaceWhitespace = _this.replaceWhitespace.bind(_this);
			_this.handleChange = _this.handleChange.bind(_this);
			_this.cancelEdit = _this.cancelEdit.bind(_this);
			_this.saveEdit = _this.saveEdit.bind(_this);

			return _this;
		}

		_createClass(WikiWidget, [{
			key: "handleChange",
			value: function handleChange(content, delta, source, editor) {
				var imgCount = (editor.getHTML().match(/<img/g) || []).length;
				if (editor.getText().length <= 10000 && imgCount <= 10) {
					var html = editor.getHTML();
					var change = this.replaceWhitespace(html);
					var original = this.replaceWhitespace(this.state.originalHTML);
					var hasChanged = original !== change;
					this.props.updateWikiStatus(hasChanged);
					this.setState({
						currentHtml: html,
						beforeChange: html,
						hasChanged: hasChanged
					});
				} else {
					this.setState({
						currentHtml: this.state.beforeChange
					});
				}
			}
		}, {
			key: "shouldComponentUpdate",
			value: function shouldComponentUpdate(nextProps, nextState) {
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
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    selected = _props.selected,
				    title = _props.title,
				    order = _props.order,
				    expanded = _props.expanded,
				    enabled = _props.enabled,
				    disabled = _props.disabled;


				return selected || !enabled ? _react2.default.createElement("div", null) : _react2.default.createElement(
					"section",
					{
						id: "wiki-wrapper",
						className: (expanded ? "expanded" : "collapsed") + " " + ("index-" + order) + " widget-wrapper"
					},
					!expanded && _react2.default.createElement(
						"div",
						{ className: "widget-header" },
						_react2.default.createElement(
							"div",
							{ className: "cb-font-b2" },
							title
						),
						_react2.default.createElement(
							"div",
							{ className: "widget-expand-button" },
							!disabled && _react2.default.createElement(
								_materialUi.IconButton,
								{
									style: { paddingRight: 0, width: "auto" },
									onClick: this.handleExpand
								},
								_react2.default.createElement(_zoomOutMap2.default, null)
							)
						)
					),
					expanded && _react2.default.createElement(
						"div",
						{ id: "wiki-widget", className: "widget-content" },
						_react2.default.createElement(_reactQuill2.default, { value: this.state.currentHtml,
							ref: function ref(el) {
								_this2.reactQuillRef = el;
							},
							onChange: this.handleChange,
							theme: this.state.theme,
							modules: WikiWidget.modules,
							formats: WikiWidget.formats,
							bounds: "#wiki-widget",
							style: {},
							placeholder: this.props.placeholder
						}),
						_react2.default.createElement(_CBComponents.Dialog, {
							open: this.props.dialog === "wikiWidgetDialog",
							title: "Conflicting changes",
							textContent: this.state.actor[0] ? this.state.actor.length < 2 ? "Saving your changes will overwrite " + this.state.actor[0].name + "'s recent changes." : "Saving your changes will overwrite multiple users' recent changes." : "",
							confirm: {
								action: function action() {
									_this2.saveEdit(true);
									_this2.props.closeDialog("wikiWidgetDialog");
								},
								label: "Confirm"
							},
							abort: {
								action: function action() {
									return _this2.props.closeDialog("wikiWidgetDialog");
								},
								label: "Cancel"
							}
						})
					)
				);
			}
		}], [{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(nextProps, prevState) {
				//If an event does not have a wiki object, we need to create an empty one
				if (nextProps.event && !nextProps.wiki) {
					return {
						originalHTML: "<p><br></p>",
						currentHtml: "<p><br></p>",
						beforeChange: "<p><br></p>"
					};
				}

				//initial loading of the wiki and keep loading updates to the wiki until user makes changes
				if (nextProps.wiki && !prevState.originalHTML || nextProps.wiki && nextProps.wiki !== prevState.originalHTML && !prevState.hasChanged) {
					return {
						originalHTML: nextProps.wiki,
						currentHtml: nextProps.wiki,
						beforeChange: nextProps.wiki
					};
				}

				//We need a flag for when a user is making changes, but the wiki has updated since the user started making changes
				if (prevState.hasChanged && nextProps.wiki !== prevState.originalHTML) {
					var newState = {
						hasUpdated: true
					};
					//Flags that will help grab the names of users who made changes while user was editing
					if (!prevState.updatedHTML) {
						newState["updatedHTML"] = nextProps.wiki;
						newState["actor"] = [nextProps.activities[0].actor];
					} else {
						newState["updatedHTML"] = nextProps.wiki;
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

		return WikiWidget;
	}(_react.Component);

	WikiWidget.modules = {
		toolbar: [[{ "header": "1" }, { "header": "2" }, { "font": [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }], ["link", "image"], ["clean"]],
		imageDrop: true
	};

	WikiWidget.formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];
	exports.default = WikiWidget;
});