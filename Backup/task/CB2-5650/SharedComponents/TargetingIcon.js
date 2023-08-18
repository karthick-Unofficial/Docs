(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "../Dock", "material-ui/svg-icons/device/gps-not-fixed", "jquery"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("../Dock"), require("material-ui/svg-icons/device/gps-not-fixed"), require("jquery"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.Dock, global.gpsNotFixed, global.jquery);
		global.TargetingIcon = mod.exports;
	}
})(this, function (exports, _react, _Dock, _gpsNotFixed, _jquery) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _gpsNotFixed2 = _interopRequireDefault(_gpsNotFixed);

	var _jquery2 = _interopRequireDefault(_jquery);

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

	var TargetingIcon = function (_Component) {
		_inherits(TargetingIcon, _Component);

		function TargetingIcon(props) {
			_classCallCheck(this, TargetingIcon);

			var _this = _possibleConstructorReturn(this, (TargetingIcon.__proto__ || Object.getPrototypeOf(TargetingIcon)).call(this, props));

			_this.mouseEnter = function (e, x, y, geometry) {
				var map = _this.props.map;

				var pos = e.target.getBoundingClientRect();

				_this.setState({
					draw: true,
					x: pos.right - pos.width / 2 - 6,
					y: pos.top - 36,
					geometry: geometry
				});

				var rerender = setInterval(function () {
					return _this.setState({
						draw: true,
						geometry: _this.state.geometry
					});
				}, 10);

				_this.setState({
					rerender: rerender
				});

				map.on("move", function () {
					return rerender;
				});
				map.on("moveend", function () {
					clearInterval(rerender);
				});
			};

			_this.mouseLeave = function () {
				clearInterval(_this.state.rerender);

				_this.setState({
					draw: false,
					x: null,
					y: null,
					geometry: null,
					rerender: null
				});
			};

			_this.state = {
				draw: false,
				x: null,
				y: null,
				geometry: null
			};
			return _this;
		}

		_createClass(TargetingIcon, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    geometry = _props.geometry,
				    map = _props.map,
				    primaryOpen = _props.primaryOpen,
				    secondaryOpen = _props.secondaryOpen;
				var _state = this.state,
				    x = _state.x,
				    y = _state.y,
				    draw = _state.draw;

				return _react2.default.createElement(
					_react2.default.Fragment,
					null,
					draw && geometry && (0, _jquery2.default)(window).width() > 1023 && _react2.default.createElement(_Dock.TargetingLine, {
						draw: draw,
						x: x,
						y: y,
						map: this.props.map,
						entityGeo: geometry,
						config: {}
					}),
					_react2.default.createElement(
						"a",
						{
							className: "target",
							onClick: function onClick() {
								return (0, _Dock.flyToTarget)(geometry, map, {
									isOpen: secondaryOpen,
									isListPanelOpen: primaryOpen
								});
							},
							onMouseLeave: this.mouseLeave
						},
						_react2.default.createElement(_gpsNotFixed2.default, {
							onMouseEnter: function onMouseEnter(e, x, y) {
								return _this2.mouseEnter(e, x, y, geometry);
							}
						})
					)
				);
			}
		}]);

		return TargetingIcon;
	}(_react.Component);

	exports.default = TargetingIcon;
});