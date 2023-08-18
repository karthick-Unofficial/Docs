(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "../../../../index", "@material-ui/core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("../../../../index"), require("@material-ui/core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.index, global.core);
		global.GISDialog = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _index, _core) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	}

	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

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

	var propTypes = {
		width: _propTypes2.default.string.isRequired,
		open: _propTypes2.default.bool.isRequired,
		error: _propTypes2.default.string,
		success: _propTypes2.default.bool.isRequired,
		isFetching: _propTypes2.default.bool,
		createService: _propTypes2.default.func.isRequired,
		resetRequest: _propTypes2.default.func.isRequired,
		handleClose: _propTypes2.default.func.isRequired
	};
	var defaultProps = {
		error: "",
		isFetching: false
	};

	var GISDialog = function (_Component) {
		_inherits(GISDialog, _Component);

		function GISDialog(props) {
			_classCallCheck(this, GISDialog);

			var _this = _possibleConstructorReturn(this, (GISDialog.__proto__ || Object.getPrototypeOf(GISDialog)).call(this, props));

			_this.handleChange = function (name, field) {
				return function (event) {
					var _this$setState;

					_this.setState((_this$setState = {}, _defineProperty(_this$setState, name, _extends({}, _this.state[name], _defineProperty({}, field, event.target.value))), _defineProperty(_this$setState, "submitted", false), _this$setState));
				};
			};

			_this.handleAuthSelect = function (event) {
				_this.setState({
					authType: event.target.value,
					creds: { username: "", password: "", token: "", submitted: false }
				});
			};

			_this.handleClose = function () {
				var _this$props = _this.props,
				    resetRequest = _this$props.resetRequest,
				    handleClose = _this$props.handleClose;

				_this.setState({
					creds: {
						username: "",
						password: ""
					},
					newService: {
						name: "",
						url: ""
					},
					authType: "none",
					submitted: false
				});
				resetRequest();
				handleClose("gisDialog");
			};

			_this.state = {
				creds: { username: "", password: "", token: "" },
				newService: {
					name: "",
					url: ""
				},
				authType: "none",
				submitted: false
			};

			_this.handleSave = _this.handleSave.bind(_this);
			return _this;
		}

		_createClass(GISDialog, [{
			key: "componentDidUpdate",
			value: function componentDidUpdate(prevProps, prevState) {
				var success = this.props.success;

				if (!prevProps.success && success) this.handleClose();
			}
		}, {
			key: "handleSave",
			value: function handleSave() {
				var createService = this.props.createService;
				var _state = this.state,
				    authType = _state.authType,
				    creds = _state.creds,
				    newService = _state.newService;
				var username = creds.username,
				    password = creds.password,
				    token = creds.token;
				var name = newService.name,
				    url = newService.url;

				createService(name, url, username, password, token, authType);
			}
		}, {
			key: "render",
			value: function render() {
				var _props = this.props,
				    width = _props.width,
				    open = _props.open,
				    error = _props.error,
				    isFetching = _props.isFetching;
				var _state2 = this.state,
				    creds = _state2.creds,
				    newService = _state2.newService,
				    authType = _state2.authType;


				return _react2.default.createElement(
					_index.Dialog,
					{
						open: open,
						confirm: {
							label: error ? "Retry" : "Add",
							action: this.handleSave,
							disabled: !newService.name || !newService.url || authType === "login" && (!creds.username || !creds.password) || authType === "token" && !creds.token
						},
						abort: {
							label: "Cancel",
							action: this.handleClose
						},
						requesting: isFetching
					},
					_react2.default.createElement(
						"div",
						{ style: { width: width === "xs" ? "auto" : 350 } },
						_react2.default.createElement(_index.TextField, {
							id: "name",
							label: "Service Name",
							value: newService.name,
							handleChange: this.handleChange("newService", "name"),
							fullWidth: true
						}),
						_react2.default.createElement(_index.TextField, {
							id: "url",
							label: "ESRI Service Endpoint",
							value: newService.url,
							handleChange: this.handleChange("newService", "url"),
							fullWidth: true,
							helperText: "Example URL: http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer"
						}),
						_react2.default.createElement(
							_index.SelectField,
							{
								id: "auth-select",
								label: "Authentication Type",
								handleChange: this.handleAuthSelect,
								value: authType
							},
							_react2.default.createElement(
								_core.MenuItem,
								{ key: "login", value: "login" },
								"Login"
							),
							_react2.default.createElement(
								_core.MenuItem,
								{ key: "token", value: "token" },
								"Token"
							),
							_react2.default.createElement(
								_core.MenuItem,
								{ key: "none", value: "none" },
								"None"
							)
						),
						authType === "login" && _react2.default.createElement(
							_react.Fragment,
							null,
							_react2.default.createElement(_index.TextField, {
								id: "username",
								label: "Username",
								value: creds.username,
								handleChange: this.handleChange("creds", "username"),
								fullWidth: true
							}),
							_react2.default.createElement(_index.TextField, {
								id: "password",
								label: "Password",
								value: creds.password,
								handleChange: this.handleChange("creds", "password"),
								fullWidth: true,
								type: "password"
							})
						),
						authType === "token" && _react2.default.createElement(_index.TextField, {
							id: "token",
							label: "Token",
							value: creds.token,
							handleChange: this.handleChange("creds", "token"),
							fullWidth: true
						}),
						error && _react2.default.createElement(
							_core.Typography,
							{ color: "error" },
							error
						)
					)
				);
			}
		}]);

		return GISDialog;
	}(_react.Component);

	GISDialog.propTypes = propTypes;
	GISDialog.defaultProps = defaultProps;

	exports.default = (0, _core.withWidth)()(GISDialog);
});