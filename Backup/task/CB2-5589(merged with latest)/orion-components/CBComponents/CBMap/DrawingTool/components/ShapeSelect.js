(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "@material-ui/core", "@material-ui/icons"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("@material-ui/core"), require("@material-ui/icons"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.core, global.icons);
		global.ShapeSelect = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _core, _icons) {
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
		handleSelect: _propTypes2.default.func.isRequired
	};

	var ShapeSelect = function (_Component) {
		_inherits(ShapeSelect, _Component);

		function ShapeSelect(props) {
			_classCallCheck(this, ShapeSelect);

			var _this = _possibleConstructorReturn(this, (ShapeSelect.__proto__ || Object.getPrototypeOf(ShapeSelect)).call(this, props));

			_this.handleMenuOpen = function (event) {
				_this.setState({ anchorEl: event.currentTarget });
			};

			_this.handleMenuClose = function () {
				_this.setState({ anchorEl: null });
			};

			_this.handleSelect = function (type) {
				var handleSelect = _this.props.handleSelect;

				handleSelect(type);
				_this.handleMenuClose();
			};

			_this.state = { open: false, anchorEl: null };
			return _this;
		}

		_createClass(ShapeSelect, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var anchorEl = this.state.anchorEl;

				var open = !!anchorEl;
				return _react2.default.createElement(
					_react.Fragment,
					null,
					_react2.default.createElement(
						_core.Fab,
						{
							onClick: open ? this.handleMenuClose : this.handleMenuOpen,
							color: "primary"
						},
						_react2.default.createElement(_icons.Add, { style: { color: "#FFF" } })
					),
					_react2.default.createElement(
						_core.Popover,
						{
							open: open,
							anchorEl: anchorEl,
							onClose: this.handleMenuClose,
							anchorOrigin: {
								vertical: "top",
								horizontal: "right"
							},
							transformOrigin: {
								vertical: "bottom",
								horizontal: "right"
							}
						},
						_react2.default.createElement(
							_core.MenuItem,
							{ onClick: function onClick() {
									return _this2.handleSelect("Point");
								} },
							_react2.default.createElement(
								_core.ListItemIcon,
								null,
								_react2.default.createElement(_icons.Place, null)
							),
							_react2.default.createElement(_core.ListItemText, { primary: "Point" })
						),
						_react2.default.createElement(
							_core.MenuItem,
							{ onClick: function onClick() {
									return _this2.handleSelect("Polygon");
								} },
							_react2.default.createElement(
								_core.ListItemIcon,
								null,
								_react2.default.createElement(_icons.Layers, null)
							),
							_react2.default.createElement(_core.ListItemText, { primary: "Polygon" })
						),
						_react2.default.createElement(
							_core.MenuItem,
							{ onClick: function onClick() {
									return _this2.handleSelect("LineString");
								} },
							_react2.default.createElement(
								_core.ListItemIcon,
								null,
								_react2.default.createElement(_icons.Timeline, null)
							),
							_react2.default.createElement(_core.ListItemText, { primary: "Line" })
						)
					)
				);
			}
		}]);

		return ShapeSelect;
	}(_react.Component);

	ShapeSelect.propTypes = propTypes;

	exports.default = ShapeSelect;
});