(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "react-mapbox-gl", "lodash", "mapbox-gl"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("react-mapbox-gl"), require("lodash"), require("mapbox-gl"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.reactMapboxGl, global.lodash, global.mapboxGl);
		global.BasicLayer = mod.exports;
	}
})(this, function (exports, _react, _reactMapboxGl, _lodash, _mapboxGl) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

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

	var BasicLayer = function (_Component) {
		_inherits(BasicLayer, _Component);

		function BasicLayer() {
			var _ref;

			var _temp, _this, _ret;

			_classCallCheck(this, BasicLayer);

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BasicLayer.__proto__ || Object.getPrototypeOf(BasicLayer)).call.apply(_ref, [this].concat(args))), _this), _this.state = { images: [] }, _this.renderLayers = function () {
				var layer = _this.props.layer;
				var name = layer.name,
				    layerTypes = layer.layerTypes,
				    layout = layer.layout,
				    paint = layer.paint;

				var sourceId = name + "-source";

				var layers = _react2.default.createElement(
					_react.Fragment,
					null,
					_react2.default.createElement(_reactMapboxGl.Source, {
						id: sourceId,
						geoJsonSource: { type: "geojson", data: layer }
					}),
					_lodash2.default.map(_lodash2.default.uniq(layerTypes), function (type) {
						return _react2.default.createElement(_reactMapboxGl.Layer, {
							key: name + "-" + type,
							id: name + "-" + type,
							sourceId: sourceId,
							type: type,
							layout: layout[type],
							paint: paint[type]
						});
					})
				);

				return layers;
			}, _temp), _possibleConstructorReturn(_this, _ret);
		}

		_createClass(BasicLayer, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _props = this.props,
				    map = _props.map,
				    layer = _props.layer;
				var layerTypes = layer.layerTypes,
				    images = layer.images,
				    name = layer.name;

				if (_lodash2.default.includes(layerTypes, "symbol")) {
					_lodash2.default.each(images, function (image) {
						var url = image.url,
						    id = image.id;
						var serviceId = layer.serviceId;

						var sID = serviceId + "-";
						var removeSID = new RegExp(sID, "g");
						var layerId = layer.id.replace(removeSID, "");
						map.loadImage("/gis-app/api/proxy-resource?serviceId=" + serviceId + "&resourceUrl=" + layerId + "/images/" + url, function (err, data) {
							if (err) console.log("ERROR", err);else if (!map.hasImage(id)) map.addImage(id, data);
						});
					});
				}

				// TODO: There must be a better way ensure layers are rendered in the correct order
				// TODO: Move this logic to the Map components onRender prop?
				if (_lodash2.default.includes(layerTypes, "line")) map.moveLayer(name + "-line");
				if (_lodash2.default.includes(layerTypes, "circle")) map.moveLayer(name + "-circle");
				if (_lodash2.default.includes(layerTypes, "symbol")) map.moveLayer(name + "-symbol");

				var popup = new _mapboxGl2.default.Popup({
					closeButton: false,
					closeOnClick: false
				});
				map.on("mouseenter", name + "-" + layerTypes[0], function (e) {
					if (e.features[0].properties.label) {
						popup.setLngLat(e.lngLat).setHTML(e.features[0].properties.label).addTo(map);
						map.on("mousemove", name + "-" + layerTypes[0], function (e) {
							map.getCanvas().style.cursor = "pointer";
							popup.setLngLat(e.lngLat);
						});
					}
				});
				map.on("mouseleave", name + "-" + layerTypes[0], function () {
					map.getCanvas().style.cursor = "";
					popup.remove();
				});
			}
		}, {
			key: "render",
			value: function render() {
				return this.renderLayers();
			}
		}]);

		return BasicLayer;
	}(_react.Component);

	exports.default = BasicLayer;
});