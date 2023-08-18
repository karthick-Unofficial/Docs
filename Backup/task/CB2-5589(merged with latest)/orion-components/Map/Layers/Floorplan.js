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
		global.FloorPlan = mod.exports;
	}
})(this, function (exports, _react, _propTypes) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	var propTypes = {
		map: _propTypes2.default.object.isRequired,
		imgSrc: _propTypes2.default.string.isRequired,
		coordinates: _propTypes2.default.array
	};

	var defaultProps = {
		coordinates: null
	};

	var FloorPlan = function FloorPlan(_ref) {
		var map = _ref.map,
		    imgSrc = _ref.imgSrc,
		    coordinates = _ref.coordinates;

		(0, _react.useEffect)(function () {
			var addFloorPlan = function addFloorPlan() {
				var parseDim = function parseDim(coords) {
					return Object.values(map.unproject(coords));
				};
				var img = new Image();
				img.src = imgSrc;
				img.onload = function () {
					var height = img.height;
					var width = img.width;
					var center = map.project(map.getCenter());
					var x = center.x,
					    y = center.y;

					var imgXMax = x + width / 2;
					var imgXMin = x - width / 2;
					var imgYMax = y + height / 2;
					var imgYMin = y - height / 2;
					var dimA = parseDim({ x: imgXMin, y: imgYMax });
					var dimB = parseDim({ x: imgXMax, y: imgYMax });
					var dimC = parseDim({ x: imgXMax, y: imgYMin });
					var dimD = parseDim({ x: imgXMin, y: imgYMin });
					map.fitBounds([].concat(_toConsumableArray(dimA), _toConsumableArray(dimC)), { padding: 150 });
					var sourceData = {
						type: "image",
						url: imgSrc,
						coordinates: coordinates || [dimA, dimB, dimC, dimD]
					};
					map.addSource(imgSrc + "-floor-plan-source", sourceData);
					map.addLayer({
						id: "overlay",
						source: imgSrc + "-floor-plan-source",
						type: "raster",
						paint: {
							"raster-opacity": 0.7
						}
					});
				};
			};
			if (map) {
				addFloorPlan();
			}
		}, [map]);
		return null;
	};

	FloorPlan.propTypes = propTypes;
	FloorPlan.defaultProps = defaultProps;

	exports.default = FloorPlan;
});