(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "@turf/line-segment", "@turf/bearing", "@turf/length", "@turf/helpers", "@turf/distance", "@turf/midpoint", "react-mapbox-gl", "orion-components/SharedComponents", "@material-ui/core", "@material-ui/icons", "material-ui/Chip", "material-ui/Avatar", "material-ui/svg-icons/content/clear", "mdi-react/RulerIcon", "jquery", "lodash"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("@turf/line-segment"), require("@turf/bearing"), require("@turf/length"), require("@turf/helpers"), require("@turf/distance"), require("@turf/midpoint"), require("react-mapbox-gl"), require("orion-components/SharedComponents"), require("@material-ui/core"), require("@material-ui/icons"), require("material-ui/Chip"), require("material-ui/Avatar"), require("material-ui/svg-icons/content/clear"), require("mdi-react/RulerIcon"), require("jquery"), require("lodash"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.lineSegment, global.bearing, global.length, global.helpers, global.distance, global.midpoint, global.reactMapboxGl, global.SharedComponents, global.core, global.icons, global.Chip, global.Avatar, global.clear, global.RulerIcon, global.jquery, global.lodash);
		global.DistanceTool = mod.exports;
	}
})(this, function (exports, _react, _lineSegment, _bearing, _length, _helpers, _distance, _midpoint, _reactMapboxGl, _SharedComponents, _core, _icons, _Chip, _Avatar, _clear, _RulerIcon, _jquery, _lodash) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _lineSegment2 = _interopRequireDefault(_lineSegment);

	var _bearing2 = _interopRequireDefault(_bearing);

	var _length2 = _interopRequireDefault(_length);

	var _distance2 = _interopRequireDefault(_distance);

	var _midpoint2 = _interopRequireDefault(_midpoint);

	var _Chip2 = _interopRequireDefault(_Chip);

	var _Avatar2 = _interopRequireDefault(_Avatar);

	var _clear2 = _interopRequireDefault(_clear);

	var _RulerIcon2 = _interopRequireDefault(_RulerIcon);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _lodash2 = _interopRequireDefault(_lodash);

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

	var DistanceTool = function (_Component) {
		_inherits(DistanceTool, _Component);

		function DistanceTool(props) {
			_classCallCheck(this, DistanceTool);

			var _this = _possibleConstructorReturn(this, (DistanceTool.__proto__ || Object.getPrototypeOf(DistanceTool)).call(this, props));

			_this.getTrackCoords = function (id) {
				var map = _this.props.map;

				var features = map.queryRenderedFeatures();

				_lodash2.default.filter(features, function (feature) {
					return feature.properties.id === id;
				});
			};

			_this.handleDraw = function (e) {
				if (_this.state.editing === true) {
					// Check to see if user is clicking on a track
					var features = _lodash2.default.filter(_this.props.map.queryRenderedFeatures(e.point), function (feature) {
						return feature.properties.type === "Track";
					});
					// Get the coordinates of the track or the user click
					var coords = features.length > 0 ? features[0].geometry.coordinates : Object.values(e.lngLat);

					// Save the name of the first track you click on
					if (features[0] && !_this.state.pathName) {
						_this.setState({
							currentPath: _extends({}, _this.state.currentPath, {
								name: features[0].properties.name
							})
						});
					}

					// Add the click coordinates to the currentPath's coordinates
					_this.setState({
						currentPath: _extends({}, _this.state.currentPath, {
							coordinates: [coords].concat(_toConsumableArray(_this.state.currentPath.coordinates))
						})
					});
					var currentPath = _this.state.currentPath;

					// Check to see if user is adding to an existing path
					var isAdding = _this.state.adding !== null;

					// Get the individual line segments of the path in order to get distances
					// Made a reusable method
					var segments = _this.getSegments(currentPath.coordinates);

					var path = {
						id: isAdding ? currentPath.id : "path" + _this.state.count,
						segments: segments,
						distance: currentPath.coordinates.length > 1 ? (0, _length2.default)((0, _helpers.lineString)(currentPath.coordinates), "miles") : 0
					};
					_this.setState({
						currentPath: _extends({}, _this.state.currentPath, {
							id: path.id,
							segments: path.segments,
							distance: path.distance,
							index: isAdding ? currentPath.index : _this.state.paths.length,
							tracks: features.length > 0 ? [features[0].properties.id].concat(_toConsumableArray(_this.state.currentPath.tracks)) : [null].concat(_toConsumableArray(_this.state.currentPath.tracks)),
							name: currentPath.name ? currentPath.name : "Path " + _this.state.count,
							zoomLevel: isAdding ? currentPath.zoomLevel : _this.props.map.getZoom()
						})
					});
				}
			};

			_this.updatePath = function (path) {
				var tracks = _this.props.tracks;

				var trackArr = _lodash2.default.values(tracks);

				var update = false;
				// Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
				var coordinates = path.coordinates.map(function (coord, index, array) {
					var track = _lodash2.default.find(trackArr, function (track) {
						return track.id === path.tracks[index];
					});
					if (track) {
						update = true;
						return track.entityData.geometry.coordinates;
					} else return coord;
				});

				if (update) {
					var segments = path.segments.length > 0 ? _this.getSegments(coordinates) : [];
					var newPath = _extends({}, path);

					if (newPath) {
						newPath.coordinates = coordinates;
						newPath.segments = segments;
						newPath.distance = coordinates.length > 1 ? (0, _length2.default)((0, _helpers.lineString)(coordinates), "miles") : null;
					}

					var newPaths = [].concat(_toConsumableArray(_this.state.paths));
					var index = _lodash2.default.findIndex(newPaths, function (path) {
						return path.id === newPath.id;
					});
					if (index > -1) {
						var pathUpdate = _lodash2.default.merge(newPaths[index], newPath);
						newPaths[index] = pathUpdate;
					}
					_this.setState({
						paths: newPaths
					});
				}
			};

			_this.getSegments = function (path) {
				if (path.length > 0) {
					var lineString = path.length > 1 ? (0, _helpers.lineString)(path) : (0, _helpers.point)(path[0]);
					var segmentsArr = lineString.geometry.coordinates.length > 0 ? (0, _lineSegment2.default)(lineString) : [];
					segmentsArr = segmentsArr.features ? segmentsArr.features.map(function (segment) {
						return segment.geometry;
					}) : [];
					var segments = segmentsArr.length > 0 ? segmentsArr.map(function (feature, index, array) {
						var coords = feature.coordinates;
						var a = coords[0];
						var b = coords[1];
						var distance = (0, _distance2.default)(a, b, "miles");
						var bearing = (0, _bearing2.default)(b, a);
						var id = index;
						var segment = {
							id: id,
							segment: [a, b],
							distance: distance,
							bearing: bearing > 0 ? bearing : 360 + bearing // Convert bearing from 180/-180 deg to 360 deg
						};
						return segment;
					}) : [];
					return segments;
				}
			};

			_this.mouseDown = function () {
				var map = _this.props.map;

				// Check to see if cursor is over a point
				if (!_this.state.hovering) {
					return;
				}

				// Allow dragging
				_this.setState({ dragging: true });

				_this.props.map.getCanvasContainer().style.cursor = "grab";

				// Keep map from trying to pan on drag
				map.dragPan.disable();

				// Controls coordinate updates
				map.on("mousemove", function (e) {
					_this.handleMove(e);
				});

				// Clears target and target's path from state
				map.on("mouseup", _this.mouseUp);
			};

			_this.handleMove = function (e) {
				var map = _this.props.map;
				var _this$state = _this.state,
				    target = _this$state.target,
				    editing = _this$state.editing,
				    currentPath = _this$state.currentPath,
				    dragging = _this$state.dragging;

				if (!editing) {
					return;
				}
				// const paths = this.state.paths;

				// Check to see if dragging is allowed
				if (!dragging) {
					return;
				}

				// Get the coordinates of the cursor
				var coords = e.lngLat;
				var newCoords = [coords.lng, coords.lat];

				map.getCanvasContainer().style.cursor = "grabbing";

				// Get the currentPath's array of coordinates and replace the coords at the targets index with the newCoords
				var pathCoords = currentPath.coordinates.slice();
				pathCoords.splice(target.properties.index, 1, newCoords);

				// Update the segments of the based on the new coordinates array
				var newSegments = _this.getSegments(pathCoords);

				// Update the coordinates/segments/distance on the new path
				var newPath = {
					id: currentPath.id,
					segments: newSegments,
					distance: (0, _length2.default)((0, _helpers.lineString)(pathCoords), "miles"),
					coordinates: pathCoords,
					name: currentPath.name,
					tracks: currentPath.tracks,
					index: currentPath.index,
					zoomLevel: currentPath.zoomLevel
				};

				// Replace the old path with the new path
				_this.setState({
					currentPath: newPath
				});
			};

			_this.mouseUp = function (e) {
				var map = _this.props.map;

				// Don't reset state if still dragging point
				if (!_this.state.dragging) {
					return;
				}

				map.getCanvasContainer().style.cursor = "";

				// Disable ability to drag points
				_this.setState({
					dragging: false
				});

				// Allow drag panning again
				map.dragPan.enable();

				// Unbind mouse events and clear out the state
				map.off("mousemove", _this.handleMove);
				map.off("mouseup", _this.mouseUp);

				_this.setState({
					target: null,
					targetPath: [[]]
				});
			};

			_this.handleEdit = function () {
				// get the maps canvas in order to change the cursor in edit mode
				var canvas = _this.props.map.getCanvasContainer();
				var currentPath = _this.state.currentPath;
				var paths = _this.state.paths;

				// If adding, replace path being edited with the current path on save
				if (_this.state.adding !== null && _this.state.editing) {
					paths.splice(_this.state.adding, 1, currentPath);
					_this.setState({
						paths: paths,
						adding: null
					});
					canvas.style.cursor = "";
					_this.handleClear();
					// Save off the current path and reset if a path has been drawn
				} else if (_this.state.editing && currentPath.coordinates.length > 1) {
					_this.setState({
						paths: [].concat(_toConsumableArray(paths), [currentPath]),
						count: _this.state.count + 1
					});
					_this.handleClear();
					canvas.style.cursor = "";
				} else {
					_this.setState({
						editing: true
					});
					// Set app state to prevent entity profile from opening if clicking on a track
					_this.props.toggleDistanceTool();
					canvas.style.cursor = "pointer";
				}
			};

			_this.handleAddToPath = function (index) {
				var map = _this.props.map;
				var paths = _this.state.paths;

				var canvas = map.getCanvasContainer();

				if (_this.state.adding === null) {
					_this.setState({
						editing: true,
						adding: index,
						currentPath: paths[index]
					});
					// Set app state to prevent entity profile from opening if clicking on a track
					_this.props.toggleDistanceTool();

					canvas.style.cursor = "pointer";
				} else {
					_this.setState({
						editing: false,
						adding: null
					});
					_this.handleClear();
				}
			};

			_this.handleClear = function () {
				var canvas = _this.props.map.getCanvasContainer();

				_this.props.toggleDistanceTool();

				_this.setState({
					editing: false,
					adding: null,
					currentPath: {
						id: null,
						coordinates: [],
						segments: [],
						distance: null,
						index: null,
						name: null,
						tracks: []
					}
				});
				canvas.style.cursor = "";
			};

			_this.handleDelete = function (index) {
				var paths = _this.state.paths;


				var newPaths = [].concat(_toConsumableArray(paths));

				newPaths.splice(index, 1);

				_this.setState({
					paths: newPaths
				});
			};

			_this.getPathData = function () {
				var map = _this.props.map;
				var _this$state2 = _this.state,
				    editing = _this$state2.editing,
				    currentPath = _this$state2.currentPath,
				    pointFocus = _this$state2.pointFocus,
				    pathFocus = _this$state2.pathFocus;

				var tracks = _lodash2.default.values(_this.props.tracks);

				var paths = _this.state.paths;

				if (editing) {
					paths = paths.filter(function (e) {
						return e.id !== currentPath.id;
					});
				}

				// Ensure that the current path user is creating shows up on map
				var allPaths = _lodash2.default.filter([].concat(_toConsumableArray(paths), [currentPath]), function (path) {
					return path.id;
				});

				// Set the GeoJSON for all paths
				var pathFeatures = allPaths.length > 0 && allPaths[0].coordinates.length > 0 ? allPaths.filter(function (path) {
					return path !== undefined;
				}).map(function (path, index) {
					var trackArr = _lodash2.default.compact(path.tracks).length > 0 ? _lodash2.default.compact(_lodash2.default.values(tracks)).filter(function (track) {
						return path.tracks.includes(track.entityData.properties.id);
					}) : [];

					// Paths disappear once user zooms out a certain distance relative to the zoom level on creation.
					var pathVisible = path.zoomLevel - map.getZoom() > 4 ? 0 : 1;

					// Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
					var coordinates = path.coordinates.map(function (coord, index, array) {
						var track = trackArr.filter(function (track) {
							return track.entityData.properties.id === path.tracks[index];
						});
						if (trackArr.length > 0 && track[0] && path.tracks[index] === track[0].entityData.properties.id) {
							var newCoords = track[0].entityData.geometry.coordinates;
							return newCoords;
						} else {
							return coord;
						}
					});
					// Get all the vertices from the path for the circles coordinates
					var points = coordinates.map(function (coords, index, array) {
						// Check if point is associated with a track (for setting radius)
						var onTrack = path.tracks.length > 0 && path.tracks[index] !== null;

						var pointFeatures = {
							type: "Feature",
							properties: {
								id: "point" + index,
								pathId: path.id,
								index: index,
								color: editing && pointFocus === "point" + index && pathFocus === path.id ? "#35b7f3" : "#666",
								radius: onTrack ? 20 : map.getZoom() / 2,
								subtype: "Circle",
								pathVisibility: pathVisible
							},
							geometry: {
								type: "Point",
								coordinates: coords
							}
						};
						return pointFeatures;
					});

					// Get all the line segments (for displaying distances)
					var segments = path.segments.length > 0 ? _lodash2.default.flatten(_this.getSegments(coordinates).map(function (segment, index, array) {
						// Labels disappear once user zooms out a certain distance relative to the zoom level on creation.
						var labelsVisible = path.zoomLevel - map.getZoom() > 0.9 ? 0 : 1;

						// Find the midpoint of the segment (for label placement)
						var p1 = (0, _helpers.point)(segment.segment[0]);
						var p2 = (0, _helpers.point)(segment.segment[1]);
						var midpoint = (0, _midpoint2.default)(p1, p2);
						var coords = midpoint.geometry.coordinates;

						var segmentFeatures = [{
							type: "Feature",
							properties: segment.id !== null ? {
								id: segment.id,
								pathId: path.id,
								distance: segment.distance ? segment.distance.toFixed(2) + " mi" : 0,
								bearing: segment.bearing ? segment.bearing.toFixed(2) + "\xB0" : null,
								subtype: "Segment", // differentiate Paths from Segments when rendering layers
								labelVisibility: labelsVisible
							} : {},
							geometry: {
								type: "Point",
								coordinates: coords
							}
						}];

						return segmentFeatures;
					})) : [];

					// Concat all the paths, points, and segments
					var features = [{
						type: "LineString",
						properties: path.id ? {
							id: path.id,
							distance: coordinates.length > 1 ? (0, _length2.default)((0, _helpers.lineString)(coordinates), "miles").toFixed(2) + " mi" : null,
							subtype: "Path", // differentiate Paths from Segments when rendering layers
							name: path.name,
							pathVisibility: pathVisible
						} : {},
						geometry: {
							type: "LineString",
							coordinates: coordinates
						}
					}].concat(_toConsumableArray(points), _toConsumableArray(segments));
					return features;
				}) : [];

				// Reduce all the features down to a single array to fit GeoJSON syntax
				// Filter to remove incomplete paths and segments
				var allFeatures = pathFeatures.reduce(function (a, b) {
					return a.concat(b);
				}, []).filter(function (feature) {
					return feature.geometry.coordinates.length > 0;
				});

				var pathData = {
					type: "geojson",
					data: {
						type: "FeatureCollection",
						features: allFeatures
					}
				};

				return pathData;
			};

			_this.state = {
				currentPath: {
					id: null,
					coordinates: [],
					segments: [],
					distance: null,
					index: null,
					name: null,
					zoomLevel: null,
					tracks: [] // Tracks associated with path
				},
				paths: [],
				editing: false,
				dragging: false,
				hovering: false,
				adding: null,
				pointFocus: null,
				count: 1
			};
			return _this;
		}

		_createClass(DistanceTool, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this2 = this;

				var map = this.props.map;


				map.on("click", function (e) {
					return _this2.handleDraw(e);
				});
				map.on("touchend", function (e) {
					return _this2.handleDraw(e);
				});

				map.on("mouseenter", "circles", function (e) {
					_this2.setState({
						hovering: true,
						pointFocus: e.features[0].properties.id,
						pathFocus: e.features[0].properties.pathId
					});
				});

				map.on("mouseleave", "circles", function (e) {
					_this2.setState({
						hovering: false,
						pointFocus: null,
						pathFocus: null
					});
				});

				map.on("mousedown", "circles", function (e) {
					// Get the path that contains the targeted circle
					var targetPath = _this2.state.paths.filter(function (path) {
						return path.id === e.features[0].properties.pathId;
					});
					// Set the target and target's path
					_this2.setState({
						target: e.features[0],
						targetPath: targetPath
					});
					_this2.mouseDown();
				});
			}
		}, {
			key: "shouldComponentUpdate",
			value: function shouldComponentUpdate(nextProps, nextState) {
				return !_lodash2.default.isEqual(this.props, nextProps) || !_lodash2.default.isEqual(this.state, nextState);
			}
		}, {
			key: "componentDidUpdate",
			value: function componentDidUpdate() {
				var _this3 = this;

				var _state = this.state,
				    paths = _state.paths,
				    currentPath = _state.currentPath;

				var allPaths = _lodash2.default.filter([].concat(_toConsumableArray(paths), [currentPath]), function (path) {
					return path.id;
				});
				_lodash2.default.each(allPaths, function (path) {
					if (path.tracks.length > 0) _this3.updatePath(path);
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this4 = this;

				var _props = this.props,
				    panelOffset = _props.panelOffset,
				    buttonCount = _props.buttonCount;
				var _state2 = this.state,
				    paths = _state2.paths,
				    currentPath = _state2.currentPath,
				    editing = _state2.editing,
				    adding = _state2.adding,
				    lightMap = _state2.lightMap;


				var mobile = (0, _jquery2.default)(window).width() <= 1023;

				var allPaths = _lodash2.default.uniqBy(_lodash2.default.filter([].concat(_toConsumableArray(paths), [currentPath]), function (path) {
					return path.id;
				}), "id");

				var chipStyle = {
					border: "1px solid white",
					marginRight: ".5rem",
					cursor: "pointer"
				};

				var pathData = this.getPathData();

				return _react2.default.createElement(
					_react.Fragment,
					null,
					_react2.default.createElement(
						"div",
						{
							style: {
								display: "flex",
								flexDirection: "row-reverse",
								width: "calc(100vw - 380px - " + 60 * buttonCount + "px - " + panelOffset + "px)",
								overflowX: "scroll",
								marginRight: 8
							}
						},
						allPaths.length > 0 && allPaths.map(function (path, index) {
							var distance = path.distance ? path.distance.toFixed(2) + " mi" : 0 + " mi";
							// Targeting Line
							var geometry = {
								coordinates: path.coordinates[path.coordinates.length - 1],
								type: "Point"
							};
							return _react2.default.createElement(
								_Chip2.default,
								{
									key: path.id
									// Change background color when editing path
									, style: _extends({}, chipStyle, {
										backgroundColor: adding === index ? "#35b7f3" : "#41454A"
									})
									// Remove delete button while creating or editing
									, onRequestDelete: path.id === currentPath.id ? null : function () {
										return _this4.handleDelete(index);
									},
									onClick: function onClick() {
										return _this4.handleAddToPath(index);
									}
								},
								_react2.default.createElement(
									_Avatar2.default,
									null,
									_react2.default.createElement(_SharedComponents.TargetingIcon, { geometry: geometry })
								),
								path.name + "  |  " + distance
							);
						})
					),
					pathData && pathData.data.features && _react2.default.createElement(
						_react.Fragment,
						null,
						_react2.default.createElement(_reactMapboxGl.Source, { id: "pathSource", ref: "path", geoJsonSource: pathData }),
						_react2.default.createElement(_reactMapboxGl.Layer, {
							id: "paths",
							type: "line",
							sourceId: "pathSource",
							paint: {
								"line-color": lightMap ? "#000000" : "#FFFFFF",
								"line-width": 2,
								"line-opacity": {
									type: "identity",
									property: "pathVisibility"
								}
							},
							filter: ["==", "subtype", "Path"]
						}),
						_react2.default.createElement(_reactMapboxGl.Layer, {
							id: "circles",
							type: "circle",
							sourceId: "pathSource",
							paint: {
								"circle-radius": {
									type: "identity",
									property: "radius"
								},
								"circle-color": {
									type: "identity",
									property: "color"
								},
								"circle-stroke-width": 2,
								"circle-stroke-color": lightMap ? "#000000" : "#FFFFFF",
								"circle-stroke-opacity": {
									type: "identity",
									property: "pathVisibility"
								},
								"circle-opacity": {
									type: "identity",
									property: "pathVisibility"
								}
							},
							filter: ["==", "subtype", "Circle"]
						}),
						_react2.default.createElement(_reactMapboxGl.Layer, {
							id: "segment-info-circle",
							type: "circle",
							sourceId: "pathSource",
							filter: ["==", "subtype", "Segment"],
							paint: {
								"circle-color": "#666",
								"circle-stroke-width": 2,
								"circle-stroke-color": "#ffffff",
								"circle-radius": 25,
								"circle-opacity": {
									type: "identity",
									property: "labelVisibility"
								},
								"circle-stroke-opacity": {
									type: "identity",
									property: "labelVisibility"
								}
							}
						}),
						_react2.default.createElement(_reactMapboxGl.Layer, {
							id: "segment-info",
							type: "symbol",
							sourceId: "pathSource",
							layout: {
								"symbol-avoid-edges": true,
								"symbol-placement": "point",
								"text-field": "{distance}\n{bearing}",
								"text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
								"text-size": 11,
								"text-letter-spacing": 0,
								"text-ignore-placement": true,
								"text-max-width": 15,
								"text-anchor": "center",
								"text-justify": "center",
								"text-allow-overlap": true
							},
							paint: {
								"text-color": "#fff",
								"text-opacity": {
									type: "identity",
									property: "labelVisibility"
								}
							},
							filter: ["==", "subtype", "Segment"]
						})
					),
					editing && _react2.default.createElement(
						_core.Fab,
						{
							size: "small",
							onClick: this.handleClear,
							style: {
								backgroundColor: "#E85858",
								color: "#FFF",
								bottom: 24
							}
						},
						_react2.default.createElement(_clear2.default, null)
					),
					_react2.default.createElement(
						_core.Fab,
						{
							onClick: this.handleEdit,
							style: { backgroundColor: editing ? "#4CAF50" : "#35b7f3" }
						},
						editing ? _react2.default.createElement(_icons.Check, { style: { color: "#FFF" } }) : _react2.default.createElement(_RulerIcon2.default, { style: { color: "#FFF", fill: "#FFF" } })
					)
				);
			}
		}]);

		return DistanceTool;
	}(_react.Component);

	exports.default = DistanceTool;
});