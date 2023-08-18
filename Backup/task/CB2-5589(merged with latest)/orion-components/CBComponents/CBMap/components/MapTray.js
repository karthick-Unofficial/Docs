(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes);
		global.MapTray = mod.exports;
	}
})(this, function (exports, _react, _propTypes) {
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

	var propTypes = {
		children: _propTypes2.default.array
	};
	var defaultProps = {
		children: []
	};

	var MapTray = function MapTray(_ref) {
		var children = _ref.children;

		var styles = {
			position: "absolute",
			bottom: "2.55rem",
			right: ".5rem"
		};
		return _react2.default.createElement(
			"div",
			{ style: styles },
			children
		);
	};

	MapTray.propTypes = propTypes;
	MapTray.defaultProps = defaultProps;

	exports.default = MapTray;
});