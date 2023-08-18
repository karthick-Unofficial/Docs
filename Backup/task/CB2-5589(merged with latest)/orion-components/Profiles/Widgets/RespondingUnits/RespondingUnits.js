(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react);
		global.RespondingUnits = mod.exports;
	}
})(this, function (exports, _react) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.RespondingUnitsWidget = undefined;

	var _react2 = _interopRequireDefault(_react);

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

	var RespondingUnitsWidget = exports.RespondingUnitsWidget = function (_Component) {
		_inherits(RespondingUnitsWidget, _Component);

		function RespondingUnitsWidget(props) {
			_classCallCheck(this, RespondingUnitsWidget);

			var _this = _possibleConstructorReturn(this, (RespondingUnitsWidget.__proto__ || Object.getPrototypeOf(RespondingUnitsWidget)).call(this, props));

			_this.state = {};
			return _this;
		}

		_createClass(RespondingUnitsWidget, [{
			key: "render",
			value: function render() {
				var _props = this.props,
				    respondingUnits = _props.respondingUnits,
				    order = _props.order;


				return _react2.default.createElement(
					"section",
					{ className: "widget-wrapper cad-details-widget " + ("index-" + order) },
					_react2.default.createElement(
						"div",
						{ className: "widget-header" },
						_react2.default.createElement(
							"div",
							{ className: "cb-font-b2" },
							"Responding Units"
						)
					)
				);
			}
		}]);

		return RespondingUnitsWidget;
	}(_react.Component);

	exports.default = RespondingUnitsWidget;
});