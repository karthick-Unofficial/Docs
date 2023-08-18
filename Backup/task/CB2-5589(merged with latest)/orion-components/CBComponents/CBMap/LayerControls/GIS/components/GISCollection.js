(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "@material-ui/core", "@material-ui/icons", "@material-ui/core/styles", "./GISManagement", "lodash"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("@material-ui/core"), require("@material-ui/icons"), require("@material-ui/core/styles"), require("./GISManagement"), require("lodash"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.core, global.icons, global.styles, global.GISManagement, global.lodash);
		global.GISCollection = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _core, _icons, _styles, _GISManagement, _lodash) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _GISManagement2 = _interopRequireDefault(_GISManagement);

	var _lodash2 = _interopRequireDefault(_lodash);

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

	var styles = {
		root: {
			color: "#FFF",
			"&:hover": {
				backgroundColor: "transparent"
			}
		},
		text: {
			"&:hover": {
				backgroundColor: "transparent"
			},
			textTransform: "none",
			padding: 0,
			justifyContent: "flex-start"
		}
	};

	var propTypes = {
		service: _propTypes2.default.object.isRequired,
		handleToggle: _propTypes2.default.func.isRequired,
		serviceState: _propTypes2.default.object,
		updateGISService: _propTypes2.default.func.isRequired,
		deleteGISService: _propTypes2.default.func.isRequired
	};

	var defaultProps = {
		serviceState: {}
	};

	var GISCollection = function (_Component) {
		_inherits(GISCollection, _Component);

		function GISCollection(props) {
			_classCallCheck(this, GISCollection);

			var _this = _possibleConstructorReturn(this, (GISCollection.__proto__ || Object.getPrototypeOf(GISCollection)).call(this, props));

			_this.renderListItem = function (layer) {
				var _this$props = _this.props,
				    classes = _this$props.classes,
				    service = _this$props.service,
				    handleToggle = _this$props.handleToggle,
				    serviceState = _this$props.serviceState;
				var expanded = _this.state.expanded;
				var layers = service.layers;
				var subLayerIds = layer.subLayerIds,
				    id = layer.id,
				    name = layer.name;

				var listItem = void 0;
				var isSubLayer = _lodash2.default.includes(_lodash2.default.flattenDeep(_lodash2.default.map(layers, function (layer) {
					return layer.subLayerIds;
				})), id);
				if (subLayerIds) {
					listItem = _react2.default.createElement(
						_react.Fragment,
						{ key: id },
						_react2.default.createElement(
							_core.ListItem,
							{ disableGutters: true },
							_react2.default.createElement(_core.ListItemText, {
								style: { paddingLeft: 12 },
								primary: name,
								secondary: _lodash2.default.size(subLayerIds) + " " + (_lodash2.default.size(subLayerIds) === 1 ? "Layer" : "Layers") + " ",
								primaryTypographyProps: { noWrap: true },
								secondaryTypographyProps: { noWrap: true }
							}),
							_react2.default.createElement(
								_core.ListItemSecondaryAction,
								null,
								_react2.default.createElement(
									_core.IconButton,
									{
										className: classes.root,
										disableRipple: true,
										onClick: function onClick() {
											return _this.handleExpand(id);
										}
									},
									expanded[id] ? _react2.default.createElement(_icons.ExpandLess, null) : _react2.default.createElement(_icons.ExpandMore, null)
								)
							)
						),
						_react2.default.createElement(
							_core.Collapse,
							{ "in": expanded[id] },
							_react2.default.createElement(
								_core.List,
								null,
								_lodash2.default.map(_lodash2.default.filter(layers, function (layer) {
									return _lodash2.default.includes(subLayerIds, layer.id);
								}), function (layer) {
									return _react2.default.createElement(
										_core.ListItem,
										{ key: layer.id },
										_react2.default.createElement(_core.ListItemText, {
											primary: layer.name,
											primaryTypographyProps: { noWrap: true },
											secondaryTypographyProps: { noWrap: true }
										}),
										_react2.default.createElement(
											_core.ListItemSecondaryAction,
											null,
											_react2.default.createElement(_core.Switch, {
												color: "primary",
												checked: serviceState[service.id + "-" + layer.id] // Layers are stored in state with a unique ID from service and layer ID
												, onChange: function onChange() {
													return handleToggle(service.id, layer.id);
												}
											})
										)
									);
								})
							)
						)
					);
				} else if (!isSubLayer) {
					listItem = _react2.default.createElement(
						_core.ListItem,
						{ key: id, disableGutters: true },
						_react2.default.createElement(_core.ListItemText, {
							style: { paddingLeft: 12 },
							primary: name,
							primaryTypographyProps: { noWrap: true },
							secondaryTypographyProps: { noWrap: true }
						}),
						_react2.default.createElement(
							_core.ListItemSecondaryAction,
							null,
							_react2.default.createElement(_core.Switch, {
								color: "primary",
								checked: serviceState[service.id + "-" + id],
								onChange: function onChange() {
									return handleToggle(service.id, id);
								}
							})
						)
					);
				}

				return listItem;
			};

			_this.handleExpand = function (id) {
				var expanded = _this.state.expanded;

				expanded[id] ? _this.setState({ expanded: _extends({}, expanded, _defineProperty({}, id, false)) }) : _this.setState({ expanded: _extends({}, expanded, _defineProperty({}, id, true)) });
			};

			_this.handleOpen = function () {
				_this.setState({ open: true });
			};

			_this.handleClose = function () {
				_this.setState({ open: false });
			};

			_this.state = { expanded: {}, open: false };
			return _this;
		}

		_createClass(GISCollection, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    classes = _props.classes,
				    service = _props.service,
				    updateGISService = _props.updateGISService,
				    deleteGISService = _props.deleteGISService;
				var _state = this.state,
				    expanded = _state.expanded,
				    open = _state.open;
				var layers = service.layers,
				    properties = service.properties,
				    id = service.id;

				return _react2.default.createElement(
					_react.Fragment,
					null,
					_react2.default.createElement(
						_core.ListItem,
						{ disableGutters: true },
						_react2.default.createElement(_core.ListItemText, {
							primary: properties.name,
							secondary: _react2.default.createElement(
								_core.Button,
								{
									onClick: this.handleOpen,
									size: "small",
									variant: "text",
									color: "primary",
									className: classes.text,
									disableRipple: true
								},
								"Manage"
							),
							primaryTypographyProps: { noWrap: true },
							secondaryTypographyProps: { noWrap: true }
						}),
						_react2.default.createElement(
							_core.ListItemSecondaryAction,
							null,
							_react2.default.createElement(
								_core.IconButton,
								{
									className: classes.root,
									disableRipple: true,
									onClick: function onClick() {
										return _this2.handleExpand(id);
									}
								},
								expanded[id] ? _react2.default.createElement(_icons.ExpandLess, null) : _react2.default.createElement(_icons.ExpandMore, null)
							)
						)
					),
					_react2.default.createElement(
						_core.Collapse,
						{ "in": expanded[id] },
						_react2.default.createElement(
							_core.List,
							null,
							_lodash2.default.map(layers, function (layer) {
								return _this2.renderListItem(layer);
							})
						)
					),
					_react2.default.createElement(_GISManagement2.default, {
						open: open,
						handleClose: this.handleClose,
						serviceId: id,
						name: properties.name,
						updateGISService: updateGISService,
						deleteGISService: deleteGISService
					})
				);
			}
		}]);

		return GISCollection;
	}(_react.Component);

	GISCollection.propTypes = propTypes;
	GISCollection.defaultProps = defaultProps;

	exports.default = (0, _styles.withStyles)(styles)(GISCollection);
});