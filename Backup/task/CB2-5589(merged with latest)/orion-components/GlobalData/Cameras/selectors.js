(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "reselect", "lodash", "../../ContextPanel/Selectors"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("reselect"), require("lodash"), require("../../ContextPanel/Selectors"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.reselect, global.lodash, global.Selectors);
		global.selectors = mod.exports;
	}
})(this, function (exports, _reselect, _lodash, _Selectors) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getCameras = exports.camerasBySearch = exports.camerasSelector = undefined;

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var cameraState = function cameraState(state) {
		var globalDataIds = Object.keys(state.globalData);
		var cameras = {};
		globalDataIds.forEach(function (id) {
			if (id.includes("camera")) {
				cameras = _lodash2.default.merge(cameras, _lodash2.default.cloneDeep(state.globalData[id]));
			}
		});
		return cameras;
	};

	var camerasSelector = exports.camerasSelector = (0, _reselect.createSelector)(cameraState, function (cameras) {
		return _lodash2.default.values(cameras);
	});

	var camerasBySearch = exports.camerasBySearch = (0, _reselect.createSelector)(cameraState, _Selectors.searchValueSelector, function (cameras, searchValue) {
		return _lodash2.default.filter(_lodash2.default.values(cameras), function (camera) {
			return camera.entityData.properties.name.toLowerCase().includes(searchValue);
		});
	});

	var getCameras = exports.getCameras = (0, _reselect.createSelector)(cameraState, function (cameras) {
		return cameras ? cameras.data : {};
	});
});