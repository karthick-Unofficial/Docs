(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "material-ui-pickers", "material-ui-pickers/utils/moment-utils", "material-ui-pickers/utils/MuiPickersUtilsProvider", "moment", "client-app-core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("material-ui-pickers"), require("material-ui-pickers/utils/moment-utils"), require("material-ui-pickers/utils/MuiPickersUtilsProvider"), require("moment"), require("client-app-core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.materialUiPickers, global.momentUtils, global.MuiPickersUtilsProvider, global.moment, global.clientAppCore);
		global.CBDateTimePicker = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _materialUiPickers, _momentUtils, _MuiPickersUtilsProvider, _moment, _clientAppCore) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _momentUtils2 = _interopRequireDefault(_momentUtils);

	var _MuiPickersUtilsProvider2 = _interopRequireDefault(_MuiPickersUtilsProvider);

	var _moment2 = _interopRequireDefault(_moment);

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
		id: _propTypes2.default.string,
		label: _propTypes2.default.string,
		value: _propTypes2.default.object,
		handleChange: _propTypes2.default.func.isRequired,
		format: _propTypes2.default.string,
		minDate: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object])
	};

	var defaultProps = {
		id: "date-time-picker",
		label: "",
		format: "full",
		value: null,
		minDate: "1900-01-01"
	};

	var CBDateTimePicker = function (_Component) {
		_inherits(CBDateTimePicker, _Component);

		function CBDateTimePicker() {
			var _ref;

			var _temp, _this, _ret;

			_classCallCheck(this, CBDateTimePicker);

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CBDateTimePicker.__proto__ || Object.getPrototypeOf(CBDateTimePicker)).call.apply(_ref, [this].concat(args))), _this), _this.formatDateLabel = function (date, invalidLabel, format) {
				return date === null ? "" : format && date ? _clientAppCore.timeConversion.convertToUserTime(date, format) : invalidLabel;
			}, _temp), _possibleConstructorReturn(_this, _ret);
		}

		_createClass(CBDateTimePicker, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    id = _props.id,
				    label = _props.label,
				    value = _props.value,
				    handleChange = _props.handleChange,
				    format = _props.format,
				    minDate = _props.minDate;

				var clearable = void 0;
				if (this.props.clearable === undefined) {
					clearable = true;
				}
				return _react2.default.createElement(
					_MuiPickersUtilsProvider2.default,
					{ utils: _momentUtils2.default, moment: _moment2.default },
					_react2.default.createElement(_materialUiPickers.DateTimePicker, {
						id: id || "date-time-picker",
						label: label,
						value: value,
						onChange: handleChange,
						fullWidth: true,
						margin: "normal",
						labelFunc: function labelFunc(date, label) {
							return _this2.formatDateLabel(date, label, format);
						},
						clearable: clearable,
						minDate: minDate
					})
				);
			}
		}]);

		return CBDateTimePicker;
	}(_react.Component);

	CBDateTimePicker.propTypes = propTypes;
	CBDateTimePicker.defaultProps = defaultProps;

	exports.default = CBDateTimePicker;
});