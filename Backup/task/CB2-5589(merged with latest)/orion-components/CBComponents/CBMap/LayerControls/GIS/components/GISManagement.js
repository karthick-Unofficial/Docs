(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "orion-components/CBComponents", "@material-ui/core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("orion-components/CBComponents"), require("@material-ui/core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.CBComponents, global.core);
		global.GISManagement = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _CBComponents, _core) {
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
		open: _propTypes2.default.bool.isRequired,
		handleClose: _propTypes2.default.func.isRequired,
		serviceId: _propTypes2.default.string.isRequired,
		name: _propTypes2.default.string.isRequired,
		updateGISService: _propTypes2.default.func.isRequired,
		deleteGISService: _propTypes2.default.func.isRequired
	};

	var GISManagement = function (_Component) {
		_inherits(GISManagement, _Component);

		function GISManagement(props) {
			_classCallCheck(this, GISManagement);

			var _this = _possibleConstructorReturn(this, (GISManagement.__proto__ || Object.getPrototypeOf(GISManagement)).call(this, props));

			_initialiseProps.call(_this);

			var name = _this.props.name;

			_this.state = { deleting: false, name: name };
			return _this;
		}

		_createClass(GISManagement, [{
			key: "render",
			value: function render() {
				var _props = this.props,
				    width = _props.width,
				    open = _props.open;
				var _state = this.state,
				    name = _state.name,
				    deleting = _state.deleting;


				return _react2.default.createElement(
					_CBComponents.Dialog,
					{
						confirm: {
							label: deleting ? "Confirm" : "Save",
							action: deleting ? this.handleConfirm : this.handleSave
						},
						abort: { label: "Cancel", action: this.handleCancel },
						deletion: deleting ? null : { label: "Delete", action: this.handleDelete },
						open: open
					},
					_react2.default.createElement(
						"div",
						{ style: { width: width === "xs" ? "auto" : 350 } },
						_react2.default.createElement(
							_core.Collapse,
							{ "in": !deleting },
							_react2.default.createElement(_CBComponents.TextField, {
								id: "gis-rename",
								value: name,
								label: "Service Name",
								handleChange: this.handleChange,
								fullWidth: true
							})
						),
						_react2.default.createElement(
							_core.Collapse,
							{ "in": deleting },
							_react2.default.createElement(
								_core.Typography,
								{ variant: "subtitle1" },
								"Are you sure you want to delete this GIS Service?"
							)
						)
					)
				);
			}
		}]);

		return GISManagement;
	}(_react.Component);

	var _initialiseProps = function _initialiseProps() {
		var _this2 = this;

		this.handleSave = function () {
			var _props2 = _this2.props,
			    serviceId = _props2.serviceId,
			    handleClose = _props2.handleClose,
			    updateGISService = _props2.updateGISService;
			var name = _this2.state.name;

			updateGISService(serviceId, { properties: { name: name } });
			handleClose();
		};

		this.handleDelete = function () {
			_this2.setState({ deleting: true });
		};

		this.handleConfirm = function () {
			var _props3 = _this2.props,
			    serviceId = _props3.serviceId,
			    handleClose = _props3.handleClose,
			    deleteGISService = _props3.deleteGISService;

			deleteGISService(serviceId);
			handleClose();
		};

		this.handleCancel = function () {
			var _props4 = _this2.props,
			    handleClose = _props4.handleClose,
			    name = _props4.name;

			handleClose();

			setTimeout(function () {
				_this2.setState({ deleting: false, name: name });
			}, 1000);
		};

		this.handleChange = function (event) {
			_this2.setState({ name: event.target.value });
		};
	};

	GISManagement.propTypes = propTypes;

	exports.default = (0, _core.withWidth)()(GISManagement);
});