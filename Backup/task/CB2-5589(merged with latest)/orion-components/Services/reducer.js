(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.reducer = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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

	var initialState = {
		health: {},
		hasHealthError: false
	};

	var systemHealth = function systemHealth() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
		var type = action.type,
		    payload = action.payload;

		switch (type) {
			case "SYSTEM_HEALTH_RECEIVED":
				{
					var hasError = Object.keys(payload).find(function (key) {
						var data = payload[key];
						return data.error === false;
					});
					return _extends({}, state, {
						health: payload,
						hasHealthError: !!hasError
					});
				}

			default:
				return state;
		}
	};

	exports.default = systemHealth;
});