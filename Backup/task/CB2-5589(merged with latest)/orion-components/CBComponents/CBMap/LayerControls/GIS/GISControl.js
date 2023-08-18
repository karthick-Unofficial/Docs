(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "./components/GISDialog", "@material-ui/core", "@material-ui/core/styles", "classnames", "lodash", "./components/GISCollection"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("./components/GISDialog"), require("@material-ui/core"), require("@material-ui/core/styles"), require("classnames"), require("lodash"), require("./components/GISCollection"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.GISDialog, global.core, global.styles, global.classnames, global.lodash, global.GISCollection);
		global.GISControl = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _GISDialog, _core, _styles, _classnames, _lodash, _GISCollection) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _GISDialog2 = _interopRequireDefault(_GISDialog);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _GISCollection2 = _interopRequireDefault(_GISCollection);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
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
		text: {
			textTransform: "none",
			color: "#35b7f3",
			padding: 0,
			textAlign: "left",
			"&:hover": {
				backgroundColor: "transparent"
			}
		},
		label: {
			textTransform: "none"
		}
	};

	var propTypes = {
		classes: _propTypes2.default.object.isRequired,
		app: _propTypes2.default.string.isRequired,
		gisData: _propTypes2.default.object.isRequired,
		gisState: _propTypes2.default.object,
		createService: _propTypes2.default.func.isRequired,
		getLayers: _propTypes2.default.func.isRequired,
		resetRequest: _propTypes2.default.func.isRequired,
		updateVisibleGIS: _propTypes2.default.func.isRequired,
		updateGISService: _propTypes2.default.func.isRequired,
		deleteGISService: _propTypes2.default.func.isRequired
	};

	var defaultProps = {
		gisState: {}
	};

	var GISControl = function (_Component) {
		_inherits(GISControl, _Component);

		function GISControl(props) {
			_classCallCheck(this, GISControl);

			var _this = _possibleConstructorReturn(this, (GISControl.__proto__ || Object.getPrototypeOf(GISControl)).call(this, props));

			_this.handleOpen = function () {
				_this.setState({ open: true });
			};

			_this.handleClose = function () {
				_this.setState({ open: false });
			};

			_this.handleLayerToggle = function (serviceId, layerId) {
				var _this$props = _this.props,
				    gisData = _this$props.gisData,
				    getLayers = _this$props.getLayers,
				    app = _this$props.app,
				    updateVisibleGIS = _this$props.updateVisibleGIS,
				    gisState = _this$props.gisState;
				var layers = gisData.layers;

				var sState = gisState[serviceId];
				/**
     * Prevent duplicate layer IDs being added to state.
     * IDs for any services' layers are numbered sequentially,
     * therefore when a layer's data is saved to state, it is with
     * a unique ID created from the service and layer ID
     */
				var uniqueLayerId = serviceId + "-" + layerId;
				if (!layers[uniqueLayerId] && (!sState || sState && !sState[uniqueLayerId])) getLayers(serviceId, layerId);
				var update = void 0;
				if (!sState) {
					update = _defineProperty({}, uniqueLayerId, true);
				} else if (sState && !sState[uniqueLayerId]) {
					update = _extends({}, sState, _defineProperty({}, uniqueLayerId, true));
				} else if (sState && sState[uniqueLayerId]) {
					update = _extends({}, sState, _defineProperty({}, uniqueLayerId, false));
				}
				if (app && update) updateVisibleGIS(app, serviceId, update);
			};

			_this.state = { open: false };
			return _this;
		}

		_createClass(GISControl, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    classes = _props.classes,
				    gisData = _props.gisData,
				    gisState = _props.gisState,
				    createService = _props.createService,
				    resetRequest = _props.resetRequest,
				    updateGISService = _props.updateGISService,
				    deleteGISService = _props.deleteGISService;
				var open = this.state.open;
				var services = gisData.services,
				    error = gisData.error,
				    isFetching = gisData.isFetching,
				    success = gisData.success;

				return _react2.default.createElement(
					"div",
					{ style: { padding: 16 } },
					_react2.default.createElement(
						"div",
						{
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 12
							}
						},
						_react2.default.createElement(
							_core.Typography,
							{ variant: "subtitle1" },
							"GIS"
						),
						_react2.default.createElement(
							_core.Button,
							{
								onClick: this.handleOpen,
								variant: "text",
								className: (0, _classnames2.default)(classes.label, classes.text),
								color: "primary"
							},
							"Add New Service"
						)
					),
					_lodash2.default.size(services) ? _react2.default.createElement(
						_core.List,
						null,
						_lodash2.default.map(services, function (service) {
							return _react2.default.createElement(_GISCollection2.default, {
								key: service.id,
								service: service,
								handleToggle: _this2.handleLayerToggle,
								serviceState: gisState[service.id],
								updateGISService: updateGISService,
								deleteGISService: deleteGISService
							});
						})
					) : _react2.default.createElement(
						_core.Typography,
						{ style: { color: "#828283", padding: 6 }, align: "center" },
						"You have yet to add any GIS Services"
					),
					_react2.default.createElement(_GISDialog2.default, {
						open: open,
						error: error,
						success: success,
						isFetching: isFetching,
						createService: createService,
						resetRequest: resetRequest,
						handleClose: this.handleClose
					})
				);
			}
		}]);

		return GISControl;
	}(_react.Component);

	GISControl.propTypes = propTypes;
	GISControl.defaultProps = defaultProps;

	exports.default = (0, _styles.withStyles)(styles)(GISControl);
});