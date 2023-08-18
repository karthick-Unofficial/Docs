(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "mapbox-gl", "prop-types", "../../../index", "@material-ui/core", "@material-ui/core/styles", "classnames", "lodash", "axios"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("mapbox-gl"), require("prop-types"), require("../../../index"), require("@material-ui/core"), require("@material-ui/core/styles"), require("classnames"), require("lodash"), require("axios"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.mapboxGl, global.propTypes, global.index, global.core, global.styles, global.classnames, global.lodash, global.axios);
		global.GISLayers = mod.exports;
	}
})(this, function (exports, _react, _mapboxGl, _propTypes, _index, _core, _styles, _classnames, _lodash, _axios) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _axios2 = _interopRequireDefault(_axios);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _asyncToGenerator(fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				return step("next");
			});
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

	var GISLayers = function (_Component) {
		_inherits(GISLayers, _Component);

		function GISLayers(props) {
			_classCallCheck(this, GISLayers);

			var _this = _possibleConstructorReturn(this, (GISLayers.__proto__ || Object.getPrototypeOf(GISLayers)).call(this, props));

			_this.handleChange = function (name, field) {
				return function (event) {
					_this.setState(_defineProperty({}, name, _extends({}, _this.state[name], _defineProperty({}, field, event.target.value))));
				};
			};

			_this.handleClose = function () {
				_this.setState({
					open: false,
					creds: {
						username: "",
						password: ""
					},
					newLayer: {
						name: "",
						url: ""
					}
				});
			};

			_this.handleOpen = function () {
				_this.setState({ open: true });
			};

			_this.state = {
				open: false,
				creds: { username: "", password: "" },
				newLayer: { name: "", url: "" }
			};

			_this.fetchLayer = _this.fetchLayer.bind(_this);
			return _this;
		}

		_createClass(GISLayers, [{
			key: "fetchLayer",
			value: function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
					var map, layers;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									map = this.props.map;
									layers = null;
									_context.next = 4;
									return _axios2.default.get("/gis-app/api/gis-data-new?username=pgbruser&password=pgbr8994&endpoint=https://arcgis4.roktech.net/arcgis/rest/services/marinergroup/Port_of_Baton_Rouge_Server/MapServer/").then(function (response) {
										return layers = response.data;
									}).catch(function (error) {
										return console.log("ERROR", error);
									}).then(function () {
										var newLayers = _lodash2.default.filter(layers, function (layer) {
											return !layer.error;
										});
										var popup = new _mapboxGl2.default.Popup({
											closeButton: false,
											closeOnClick: false
										});
										_lodash2.default.each(newLayers, function (layer, index) {
											var layerType = layer.layerType,
											    paint = layer.paint,
											    layout = layer.layout;

											map.addSource(index + "-source", {
												type: "geojson",
												data: layer
											});
											var layers = map.getStyle().layers;
											// Find the index of the first symbol layer in the map style
											var firstLine = void 0;
											var firstPoint = void 0;
											for (var i = 0; i < layers.length; i++) {
												if (layers[i].type === "line") {
													firstLine = layers[i].id;
													break;
												}
											}
											for (var _i = 0; _i < layers.length; _i++) {
												if (layers[_i].type === "symbol") {
													firstLine = layers[_i].id;
													break;
												}
											}
											if (layerType === "fill") {
												var polyPaint = _lodash2.default.pickBy(paint, function (value, key) {
													return key !== "line-color" && key !== "line-width";
												});
												var linePaint = _lodash2.default.pickBy(paint, function (value, key) {
													return key === "line-color" && key === "line-width";
												});
												map.addLayer({
													id: index + "-line",
													source: index + "-source",
													type: "line",
													paint: linePaint,
													layout: layout
												});
												map.addLayer({
													id: index + "-fill",
													source: index + "-source",
													type: layerType,
													paint: polyPaint,
													layout: layout
												}, firstLine);
												map.on("mouseenter", index + "-fill", function (e) {
													var label = e.features[0].properties.label;
													map.getCanvas().style.cursor = "pointer";
													popup.setLngLat(e.lngLat).setHTML(label).addTo(map);
												});
												map.on("mouseleave", index + "-fill", function (e) {
													map.getCanvas().style.cursor = "";
													popup.remove();
												});
											} else {
												map.addLayer({
													id: "" + index,
													source: index + "-source",
													type: layerType,
													paint: paint,
													layout: layout
												}, firstPoint);
												map.on("mouseenter", "" + index, function (e) {
													var label = e.features[0].properties.label;
													map.getCanvas().style.cursor = "pointer";
													popup.setLngLat(e.lngLat).setHTML(label).addTo(map);
												});
												map.on("mouseleave", "" + index, function (e) {
													map.getCanvas().style.cursor = "";
													popup.remove();
												});
											}
										});
									});

								case 4:
									this.handleClose();

								case 5:
								case "end":
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				function fetchLayer() {
					return _ref.apply(this, arguments);
				}

				return fetchLayer;
			}()
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    width = _props.width,
				    classes = _props.classes;
				var _state = this.state,
				    open = _state.open,
				    creds = _state.creds,
				    newLayer = _state.newLayer;

				var layers = [];

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
					_lodash2.default.size(layers) ? null : _react2.default.createElement(
						_core.Typography,
						{ style: { color: "#828283", padding: 6 }, align: "center" },
						"You have yet to add any GIS Services"
					),
					_react2.default.createElement(
						_index.Dialog,
						{
							open: open,
							confirm: {
								label: "Add",
								action: function action() {
									return _this2.fetchLayer();
								},
								disabled: !newLayer.name || !newLayer.url || !creds.username || !creds.password
							},
							abort: {
								label: "Cancel",
								action: this.handleClose
							}
						},
						_react2.default.createElement(
							"div",
							{ style: { width: width === "xs" ? "auto" : 350 } },
							_react2.default.createElement(_index.TextField, {
								id: "name",
								label: "Layer Name",
								value: newLayer.name,
								handleChange: this.handleChange("newLayer", "name"),
								fullWidth: true
							}),
							_react2.default.createElement(_index.TextField, {
								id: "url",
								label: "URL",
								value: newLayer.url,
								handleChange: this.handleChange("newLayer", "url"),
								fullWidth: true
							}),
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
						)
					)
				);
			}
		}]);

		return GISLayers;
	}(_react.Component);

	exports.default = (0, _styles.withStyles)(styles)((0, _core.withWidth)()(GISLayers));
});