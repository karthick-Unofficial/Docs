(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "orion-components/ContextualData/Actions", "orion-components/Dock/Notifications/actions", "orion-components/ContextPanel/Actions", "orion-components/Dock/Cameras/actions", "client-app-core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("orion-components/ContextualData/Actions"), require("orion-components/Dock/Notifications/actions"), require("orion-components/ContextPanel/Actions"), require("orion-components/Dock/Cameras/actions"), require("client-app-core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.Actions, global.actions, global.Actions, global.actions, global.clientAppCore);
		global.alertProfileActions = mod.exports;
	}
})(this, function (exports, _Actions, _actions, _Actions2, _actions2, _clientAppCore) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getActivityDetails = exports.addCameraToDockMode = exports.loadProfile = exports.reopenNotification = exports.closeNotification = exports.unsubscribeFromFeed = exports.updateContext = exports.startCamerasInRangeStream = exports.startActivityStream = exports.startAttachmentStream = exports.removeContext = exports.addContext = undefined;
	Object.defineProperty(exports, "addContext", {
		enumerable: true,
		get: function () {
			return _Actions.addContext;
		}
	});
	Object.defineProperty(exports, "removeContext", {
		enumerable: true,
		get: function () {
			return _Actions.removeContext;
		}
	});
	Object.defineProperty(exports, "startAttachmentStream", {
		enumerable: true,
		get: function () {
			return _Actions.startAttachmentStream;
		}
	});
	Object.defineProperty(exports, "startActivityStream", {
		enumerable: true,
		get: function () {
			return _Actions.startActivityStream;
		}
	});
	Object.defineProperty(exports, "startCamerasInRangeStream", {
		enumerable: true,
		get: function () {
			return _Actions.startCamerasInRangeStream;
		}
	});
	Object.defineProperty(exports, "updateContext", {
		enumerable: true,
		get: function () {
			return _Actions.updateContext;
		}
	});
	Object.defineProperty(exports, "unsubscribeFromFeed", {
		enumerable: true,
		get: function () {
			return _Actions.unsubscribeFromFeed;
		}
	});
	Object.defineProperty(exports, "closeNotification", {
		enumerable: true,
		get: function () {
			return _actions.closeNotification;
		}
	});
	Object.defineProperty(exports, "reopenNotification", {
		enumerable: true,
		get: function () {
			return _actions.reopenNotification;
		}
	});
	Object.defineProperty(exports, "loadProfile", {
		enumerable: true,
		get: function () {
			return _Actions2.loadProfile;
		}
	});
	Object.defineProperty(exports, "addCameraToDockMode", {
		enumerable: true,
		get: function () {
			return _actions2.addCameraToDockMode;
		}
	});
	var getActivityDetails = exports.getActivityDetails = function getActivityDetails(id) {
		return function (dispatch) {
			_clientAppCore.activityService.getActivityDetails(id, function (err, response) {
				if (err) {
					console.log("ERR", err);
				} else {
					dispatch((0, _Actions.updateContext)(id, response));
				}
			});
		};
	};
});