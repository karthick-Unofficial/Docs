(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "client-app-core", "orion-components/Dock/Actions/index.js"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("client-app-core"), require("orion-components/Dock/Actions/index.js"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.clientAppCore, global.index);
		global.actions = mod.exports;
	}
})(this, function (exports, _clientAppCore, _index) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createShape = exports.deleteShape = exports.restoreShape = undefined;
	var restoreShape = exports.restoreShape = function restoreShape(id) {
		return _clientAppCore.shapeService.restore(id, function (err, res) {
			if (err) {
				console.log(err);
			}
		});
	};

	var deleteShape = exports.deleteShape = function deleteShape(id, name, undoing) {
		return function (dispatch) {
			_clientAppCore.shapeService.delete(id, function (err, response) {
				if (err) {
					console.log(err);
				} else {
					if (!undoing) {
						var undoFunc = function undoFunc() {
							dispatch(restoreShape(id));
						};
						dispatch((0, _index.createUserFeedback)(name + " has been deleted.", undoFunc));
					}
				}
			});
		};
	};

	var createShape = exports.createShape = function createShape(name, description, symbol, coordinates, type) {
		return function (dispatch) {
			var shape = {
				entityData: {
					type: type,
					properties: {
						name: name,
						symbol: symbol,
						description: description,
						type: type === "LineString" ? "Line" : type
					},
					geometry: {
						coordinates: coordinates,
						type: type
					}
				}
			};

			_clientAppCore.shapeService.create(shape, function (err, response) {
				if (err) {
					console.log(err);
				} else {
					var id = response.generated_keys[0];
					var undo = true;
					var undoFunc = function undoFunc() {
						dispatch(deleteShape(id, name, undo));
					};
					dispatch((0, _index.createUserFeedback)(name + " has been created.", undoFunc));
				}
			});
		};
	};
});