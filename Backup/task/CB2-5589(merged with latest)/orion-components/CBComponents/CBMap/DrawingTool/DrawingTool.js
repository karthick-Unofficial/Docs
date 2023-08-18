(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "./components/ShapeSelect", "orion-components/SharedComponents"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("./components/ShapeSelect"), require("orion-components/SharedComponents"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.ShapeSelect, global.SharedComponents);
		global.DrawingTool = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _ShapeSelect, _SharedComponents) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _ShapeSelect2 = _interopRequireDefault(_ShapeSelect);

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

	var propTypes = {
		map: _propTypes2.default.object.isRequired,
		entity: _propTypes2.default.object,
		drawingTools: _propTypes2.default.object.isRequired,
		createShape: _propTypes2.default.func.isRequired,
		updateShape: _propTypes2.default.func.isRequired,
		setDrawingMode: _propTypes2.default.func.isRequired,
		drawControl: _propTypes2.default.object.isRequired,
		fetchSymbols: _propTypes2.default.func.isRequired
	};

	var defaultProps = {
		entity: null
	};

	var DrawingTool = function (_Component) {
		_inherits(DrawingTool, _Component);

		function DrawingTool(props) {
			_classCallCheck(this, DrawingTool);

			var _this = _possibleConstructorReturn(this, (DrawingTool.__proto__ || Object.getPrototypeOf(DrawingTool)).call(this, props));

			_this.componentDidMount = function () {
				var _this$props = _this.props,
				    map = _this$props.map,
				    drawControl = _this$props.drawControl;
				var valid = _this.state.valid;
				var draw = drawControl.draw;

				map.on("draw.create", function (e) {
					_this.setState({ valid: true });
				});
				map.on("draw.modechange", function (e) {
					var _draw$getAll = draw.getAll(),
					    features = _draw$getAll.features;

					/**
      * Handle closing a polygon with insufficient points
      * Re-initializes drawing mode
      */
					if (!valid && !features.length) {
						_this.handleDraw();
					}
				});
			};

			_this.componentDidUpdate = function (prevProps, prevState) {
				var drawingTools = _this.props.drawingTools;

				if (drawingTools.active && !prevProps.drawingTools.active) {
					_this.handleDraw();
				}
			};

			_this.handleSelectShapeType = function (type) {
				var setDrawingMode = _this.props.setDrawingMode;

				// active, editing, geometry type
				setDrawingMode(true, false, type);
			};

			_this.handleDraw = function () {
				var _this$props2 = _this.props,
				    entity = _this$props2.entity,
				    drawingTools = _this$props2.drawingTools,
				    drawControl = _this$props2.drawControl;
				var editing = drawingTools.editing,
				    type = drawingTools.type;
				var draw = drawControl.draw;

				if (entity && editing) {
					var id = entity.id,
					    entityData = entity.entityData;
					var geometry = entityData.geometry,
					    properties = entityData.properties;
					var _type = geometry.type,
					    coordinates = geometry.coordinates;

					if (_type && coordinates) {
						_this.setState({ valid: true });
					}
					var feature = { id: id, type: "Feature", properties: properties, geometry: geometry };
					draw.add(feature);
					draw.changeMode(_type === "Point" ? "simple_select" : "direct_select", {
						featureId: id
					});
				} else {
					// Change shape type from camel to underscore case
					var mode = type.replace(/([A-Z])/g, function (value) {
						return "_" + value.toLowerCase();
					});
					draw.changeMode("draw" + mode);
				}
			};

			_this.handleCleanUp = function () {
				var _this$props3 = _this.props,
				    setDrawingMode = _this$props3.setDrawingMode,
				    drawControl = _this$props3.drawControl;
				var draw = drawControl.draw;

				_this.setState({ valid: false });
				draw.trash();
				draw.deleteAll();
				draw.changeMode("simple_select");
				setDrawingMode(false, null);
			};

			_this.handleSave = function (name, description, symbol) {
				var _this$props4 = _this.props,
				    drawingTools = _this$props4.drawingTools,
				    entity = _this$props4.entity,
				    createShape = _this$props4.createShape,
				    updateShape = _this$props4.updateShape,
				    drawControl = _this$props4.drawControl;
				var editing = drawingTools.editing;
				var draw = drawControl.draw;

				var feature = draw.getAll().features[0];
				var _feature$geometry = feature.geometry,
				    coordinates = _feature$geometry.coordinates,
				    type = _feature$geometry.type;

				if (!editing) {
					createShape(name, description, symbol, coordinates, type);
				} else {
					updateShape(entity.id, name, description, symbol, coordinates, type);
				}
				_this.handleCleanUp();
			};

			_this.state = { mode: null, valid: false };
			return _this;
		}

		_createClass(DrawingTool, [{
			key: "render",
			value: function render() {
				var _props = this.props,
				    drawingTools = _props.drawingTools,
				    setDrawingMode = _props.setDrawingMode,
				    map = _props.map,
				    fetchSymbols = _props.fetchSymbols,
				    entity = _props.entity;
				var valid = this.state.valid;
				var active = drawingTools.active,
				    type = drawingTools.type,
				    editing = drawingTools.editing;

				return _react2.default.createElement(
					_react.Fragment,
					null,
					!active ? _react2.default.createElement(_ShapeSelect2.default, { handleSelect: this.handleSelectShapeType }) : _react2.default.createElement(_SharedComponents.ShapeEdit, {
						map: map,
						type: type,
						entity: entity,
						setDrawingMode: setDrawingMode,
						fetchSymbols: fetchSymbols,
						handleCancel: this.handleCleanUp,
						valid: valid,
						handleSave: this.handleSave,
						editing: editing
					})
				);
			}
		}]);

		return DrawingTool;
	}(_react.Component);

	DrawingTool.propTypes = propTypes;
	DrawingTool.defaultProps = defaultProps;

	exports.default = DrawingTool;
});