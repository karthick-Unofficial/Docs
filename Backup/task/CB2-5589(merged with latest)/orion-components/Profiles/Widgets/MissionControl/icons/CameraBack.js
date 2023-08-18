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
		global.CameraBack = mod.exports;
	}
})(this, function (exports, _react) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var CameraBack = function CameraBack() {
		return _react2.default.createElement(
			"svg",
			{ xmlns: "http://www.w3.org/2000/svg", width: "23", height: "15", viewBox: "0 0 23 15" },
			_react2.default.createElement(
				"g",
				{ id: "Group_929", "data-name": "Group 929", transform: "translate(-697 -804)" },
				_react2.default.createElement(
					"g",
					{ id: "video", transform: "translate(697 804)" },
					_react2.default.createElement("path", { id: "video-2", "data-name": "video", d: "M20.889,11.625V7.25A1.264,1.264,0,0,0,19.611,6H4.278A1.264,1.264,0,0,0,3,7.25v12.5A1.264,1.264,0,0,0,4.278,21H19.611a1.264,1.264,0,0,0,1.278-1.25V15.375l5.111,5V6.625Z", transform: "translate(-3 -6)", fill: "#fff" })
				),
				_react2.default.createElement(
					"text",
					{ id: "B", transform: "translate(706 815)", fill: "#434343", "font-size": "11", "font-family": "Roboto-Medium, Roboto", "font-weight": "500" },
					_react2.default.createElement(
						"tspan",
						{ x: "-3.47", y: "0" },
						"B"
					)
				)
			)
		);
	};

	exports.default = CameraBack;
});