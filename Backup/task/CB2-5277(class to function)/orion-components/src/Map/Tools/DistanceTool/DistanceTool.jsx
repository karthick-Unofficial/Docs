import React, { Fragment, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import tLineSegment from "@turf/line-segment";
import tBearing from "@turf/bearing";
import tLength from "@turf/length";
import { lineString as tLineString } from "@turf/helpers";
import tDistance from "@turf/distance";
import tMidpoint from "@turf/midpoint";
import { point as tPoint } from "@turf/helpers";
import { Source, Layer, Popup } from "react-mapbox-gl";
import _ from "lodash";
import isEqual from "react-fast-compare";

import UnitSelect from "../components/UnitSelect";
import { UnitParser } from "../../../CBComponents";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const DistanceTool = (props) => {
	const { activePath, updatePaths, updatePath, distanceTool, map, setMapTools, setActivePath, tracks, landUnitSystem, toolType, dir, before } = props;
	const [state, setState] = useState({
		currentPath: {
			id: null,
			coordinates: [],
			segments: [],
			distance: null,
			eta: null,
			index: null,
			name: null,
			zoomLevel: null,
			tracks: [], // Tracks associated with path,
			trackData: []
		},
		paths: [],
		editing: false,
		dragging: false,
		hovering: false,
		adding: null,
		pointFocus: null,
		count: 1,
		tooltipParent: null,
		tooltip: null,
		pathFocus: null,
		target: null,
		targetPath: null,
		unit: null,
		pathName: false,
		lightMap: false
	});

	const stateRef = useRef(state);
	const distanceToolRef = useRef(distanceTool);

	useEffect(() => {
		stateRef.current = state;
		distanceToolRef.current = distanceTool;
	}, [state, distanceTool]);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	const getTrackCoords = id => {
		const features = map.queryRenderedFeatures();

		_.filter(features, feature => feature.properties.id === id);
	};

	useEffect(() => {
		map.on("click", e => handleDraw(e));
		map.on("touchend", e => handleDraw(e));

		map.on("mouseenter", "circles", e => {
			stateRef.current = {
				...stateRef.current,
				hovering: true,
				pointFocus: e.features[0].properties.id,
				pathFocus: e.features[0].properties.pathId
			};
			setState(prevState => ({
				...prevState,
				hovering: true,
				pointFocus: e.features[0].properties.id,
				pathFocus: e.features[0].properties.pathId
			}));

			setPopup(e.features[0]);
		});

		map.on("mouseleave", "circles", e => {
			stateRef.current = {
				...stateRef.current,
				hovering: false,
				pointFocus: null,
				pathFocus: null,
				tooltip: null
			};
			setState(prevState => ({
				...prevState,
				hovering: false,
				pointFocus: null,
				pathFocus: null,
				tooltip: null
			}));
		});

		map.on("mousedown", "circles", e => {
			// Set the target and target's path
			stateRef.current = {
				...stateRef.current,
				target: e.features[0],
				targetPath: activePath
			};
			setState(prevState => ({
				...prevState,
				target: e.features[0],
				targetPath: activePath
			}));
			mouseDown();
		});
		stateRef.current = {
			...stateRef.current,
			tooltipParent: document.getElementsByClassName("mapboxgl-map")[0]
		};
		setState(prevState => ({
			...prevState,
			tooltipParent: document.getElementsByClassName("mapboxgl-map")[0]
		}));
	}, []);

	const setPopup = (feature) => {
		const coordinates = feature.geometry.coordinates;
		const name = feature.properties.name;
		if (coordinates && coordinates.length === 2) {
			stateRef.current = {
				...stateRef.current,
				tooltip: (
					<Popup coordinates={coordinates} offset={12}>
						<div>
							{name && (<p>Name: {name}</p>)}
							<p>Lat: <UnitParser sourceUnit={"decimal-degrees"} value={coordinates[1]} /></p>
							<p>Lon: <UnitParser sourceUnit={"decimal-degrees"} value={coordinates[0]} /></p>
						</div>
					</Popup>
				)
			};
			setState(prevState => ({
				...prevState,
				tooltip: (
					<Popup coordinates={coordinates} offset={12}>
						<div>
							{name && (<p>Name: {name}</p>)}
							<p>Lat: <UnitParser sourceUnit={"decimal-degrees"} value={coordinates[1]} /></p>
							<p>Lon: <UnitParser sourceUnit={"decimal-degrees"} value={coordinates[0]} /></p>
						</div>
					</Popup>
				)
			}));
		}
	};

	useEffect(() => {
		const { paths, activePath } = distanceTool;
		const completedPaths = _.filter(paths, path => path && path.id);
		_.each(completedPaths, path => {
			if (path.tracks.filter(t => !!t).length > 0) {
				updatePathEvent(path);
			}
		});
		if (prevProps) {
			if (
				!stateRef.current.currentPath.id &&
				!prevProps.distanceTool.activePath &&
				activePath
			) {
				stateRef.current = {
					...stateRef.current,
					editing: true,
					adding: true,
					currentPath: activePath,
					unit: activePath.unit
				};
				setState(prevState => ({
					...prevState,
					editing: true,
					adding: true,
					currentPath: activePath,
					unit: activePath.unit
				}));
				const canvas = map.getCanvasContainer();
				canvas.style.cursor = "pointer";
				setMapTools({ type: "distance" });
			}
			if (prevProps.toolType === "distance" && !toolType) {
				handleClear();
			}

		}
	}, [prevProps, state]);

	const handleDraw = e => {
		const pathArray = Object.values(distanceToolRef.current.paths);
		if (stateRef.current.editing === true) {
			// Check to see if user is clicking on a track
			const features = _.filter(
				map.queryRenderedFeatures(e.point),
				feature => feature.properties.type === "Track" || feature.properties.entityType === "track"
			);
			// Get the coordinates of the track or the user click
			const coords =
				features.length > 0
					? features[0].geometry.coordinates
					: Object.values(e.lngLat);

			// Save the name of the first track you click on
			if (features[0] && !stateRef.current.pathName) {
				const newPath = {
					...stateRef.current.currentPath,
					name: features[0].properties.name
				};
				stateRef.current = { ...stateRef.current, currentPath: newPath };
				setState(prevState => ({
					...prevState,
					currentPath: newPath
				}));
			}

			// Add the click coordinates to the currentPath's coordinates
			const coordinateUpdate = {
				...stateRef.current.currentPath,
				coordinates: [coords, ...stateRef.current.currentPath.coordinates]
			};
			stateRef.current = { ...stateRef.current, currentPath: coordinateUpdate };
			setState(prevState => ({
				...prevState,
				currentPath: coordinateUpdate
			}));
			// const currentPath = stateRef.current.currentPath;

			// Check to see if user is adding to an existing path
			const isAdding = stateRef.current.adding !== null;
			
			// Get the individual line segments of the path in order to get distances
			// Made a reusable method
			const segments = getSegments(
				stateRef.current.currentPath.coordinates,
				stateRef.current.currentPath.unit,
				stateRef.current.currentPath.trackData
			);
			const path = {
				id: isAdding ? stateRef.current.currentPath.id : "path" + (pathArray.length + 1),
				segments: segments,
				distance:
					stateRef.current.currentPath.coordinates.length > 1
						? getDistance(stateRef.current.currentPath.coordinates, stateRef.current.unit)
						: 0,
				eta: getETA(segments),
				unit: stateRef.current.unit
			};

			// -- get track speed value and make sure it's in knots
			let trackSpeed = null;
			if (features[0] && features[0].properties.speed) {
				const speedObj = features[0].properties.speed;
				if (typeof speedObj === "number")
					trackSpeed = speedObj;
				else if (typeof speedObj === "object") {
					const { val, unit } = speedObj;
					if (unit === "mph")
						trackSpeed = val / 1.151;
					else if (unit === "kph")
						trackSpeed = val / 1.852;
					else if (unit === "knot" || unit === "kn")
						trackSpeed = val;
				}
			}
			const newTrackData = features.length > 0 && trackSpeed ?
				{
					id: features[0].properties.id,
					speed: trackSpeed
				} : null;

			const newPath = {
				...stateRef.current.currentPath,
				id: path.id,
				segments: path.segments,
				distance: path.distance,
				eta: path.eta,
				index: isAdding ? stateRef.current.currentPath.index : pathArray.length,
				tracks:
					features.length > 0
						? [features[0].properties.id, ...stateRef.current.currentPath.tracks]
						: [null, ...stateRef.current.currentPath.tracks],
				trackData: [...stateRef.current.currentPath.trackData, newTrackData],
				name: stateRef.current.currentPath.name ? stateRef.current.currentPath.name : getTranslation("global.map.tools.distanceTool.path") + (pathArray.length + 1),
				zoomLevel: isAdding ? stateRef.current.currentPath.zoomLevel : map.getZoom(),
				unit: stateRef.current.unit
			};

			stateRef.current = { ...stateRef.current, currentPath: newPath };
			setState(prevState => ({
				...prevState,
				currentPath: newPath
			}));
			setActivePath(newPath);
		}
	};
	/*
	 * Used when a path has a trackId(s). Pass in the path and an array of tracks. If the tracks have different
	 * coordinate data, an updated path will return. Else a null value will return.
	 */
	const updatePathEvent = path => {
		const trackArr = _.values(tracks);
		let update = false;
		// Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
		const coordinates = path.coordinates.map((coord, index, array) => {
			const track = _.find(trackArr, track => track.id === path.tracks[index]);
			if (track) {
				update = true;
				return track.entityData.geometry.coordinates;
			} else return coord;
		});

		if (update) {
			const segments =
				path.segments.length > 0
					? getSegments(coordinates, path.unit, path.trackData)
					: [];
			const newPath = { ...path };

			if (newPath) {
				newPath.coordinates = coordinates;
				newPath.segments = segments;
				newPath.distance =
					coordinates.length > 1
						? getDistance(coordinates, stateRef.current.unit || newPath.unit)
						: null;
				newPath.eta = getETA(segments);
				newPath.unit = stateRef.current.unit || newPath.unit;
			}

			let newPaths = { ...distanceTool.paths };
			if (newPath && newPaths[newPath.id]) {
				newPaths[newPath.id] = newPath;
			} else {
				newPaths = { ...newPaths, newPath };
			}
			stateRef.current = {
				...stateRef.current,
				paths: newPaths
			};
			setState(prevState => ({
				...prevState,
				paths: newPaths
			}));
			updatePaths(_.keyBy(newPaths, "id"));
		}
	};

	// Get the individual line segments of the path in order to get distances
	// Made reusable in order to update distances on line edit
	const getSegments = (path, unit, trackData) => {
		if (path.length > 0) {
			const lineString = path.length > 1 ? tLineString(path) : tPoint(path[0]);
			let segmentsArr =
				lineString.geometry.coordinates.length > 0
					? tLineSegment(lineString)
					: [];
			segmentsArr = segmentsArr.features
				? segmentsArr.features.map(segment => {
					return segment.geometry;
				})
				: [];

			const trackSpeedMPH = trackData[0] ? trackData[0].speed * 1.151 : null;
			const segments = segmentsArr.length > 0 ? segmentsArr.map((feature, index, array) => {
				const coords = feature.coordinates;
				const a = coords[0];
				const b = coords[1];
				const distance = tDistance(a, b, { units: "miles" });
				const bearing = tBearing(b, a);
				const eta = trackSpeedMPH ? (distance / trackSpeedMPH) * 60 : null;
				const id = index;
				const segment = {
					id: id,
					segment: [a, b],
					distance: unit.type === "nautical-miles" ? distance / 1.151 : distance,
					bearing: bearing > 0 ? bearing : 360 + bearing, // Convert bearing from 180/-180 deg to 360 deg
					eta
				};
				return segment;
			})
				: [];

			return segments;
		}
	};

	// Called when you start dragging points around
	const mouseDown = () => {

		// Check to see if cursor is over a point
		if (!stateRef.current.hovering) {
			return;
		}

		// Allow dragging
		stateRef.current = { ...stateRef.current, dragging: true };
		setState(prevState => ({ ...prevState, dragging: true }));

		map.getCanvasContainer().style.cursor = "grab";

		// Keep map from trying to pan on drag
		map.dragPan.disable();

		// Controls coordinate updates
		map.on("mousemove", e => {
			handleMove(e);
		});

		// Clears target and target's path from state
		map.on("mouseup", mouseUp);
	};

	const handleMove = e => {
		if (!stateRef.current.editing) {
			return;
		}
		// const paths = state.paths;

		// Check to see if dragging is allowed
		if (!stateRef.current.dragging) {
			return;
		}

		// Get the coordinates of the cursor
		const coords = e.lngLat;
		const newCoords = [coords.lng, coords.lat];

		map.getCanvasContainer().style.cursor = "grabbing";

		// Get the currentPath's array of coordinates and replace the coords at the targets index with the newCoords
		const pathCoords = stateRef.current.currentPath.coordinates.slice();
		pathCoords.splice(stateRef.current.target.properties.index, 1, newCoords);

		// Update the segments of the based on the new coordinates array
		const newSegments = getSegments(pathCoords, stateRef.current.currentPath.unit, stateRef.current.currentPath.trackData);

		// Update the coordinates/segments/distance on the new path
		const newPath = {
			id: stateRef.current.currentPath.id,
			segments: newSegments,
			distance: getDistance(pathCoords, stateRef.current.currentPath.unit),
			eta: getETA(newSegments),
			coordinates: pathCoords,
			name: stateRef.current.currentPath.name,
			tracks: stateRef.current.currentPath.tracks,
			index: stateRef.current.currentPath.index,
			zoomLevel: stateRef.current.currentPath.zoomLevel,
			unit: stateRef.current.currentPath.unit,
			trackData: stateRef.current.currentPath.trackData
		};

		// Replace the old path with the new path
		stateRef.current = { ...stateRef.current, currentPath: newPath };
		setState(prevState => ({
			...prevState,
			currentPath: newPath
		}));
		setActivePath(newPath);
	};

	const mouseUp = e => {

		// Don't reset state if still dragging point
		if (!stateRef.current.dragging) {
			return;
		}

		map.getCanvasContainer().style.cursor = "";

		// Disable ability to drag points
		stateRef.current = {
			...stateRef.current,
			dragging: true
		};
		setState(prevState => ({
			...prevState,
			dragging: false
		}));

		// Allow drag panning again
		map.dragPan.enable();

		// Unbind mouse events and clear out the state
		map.off("mousemove", handleMove);
		map.off("mouseup", mouseUp);

		stateRef.current = {
			...stateRef.current,
			target: null,
			targetPath: [[]]
		};
		setState(prevState => ({
			...prevState,
			target: null,
			targetPath: [[]]
		}));
	};

	const handleEdit = unit => {
		const { paths } = distanceTool;
		// unit is for measurement via turf (does not accept nautical miles)
		let unitData;
		switch (unit) {
			case "kilometers":
				unitData = { type: unit, measurement: unit, display: getTranslation("global.map.tools.distanceTool.km") };
				break;
			case "miles":
				unitData = { type: unit, measurement: unit, display: getTranslation("global.map.tools.distanceTool.mi") };
				break;
			case "nautical-miles":
				unitData = { type: unit, measurement: unit, display: getTranslation("global.map.tools.distanceTool.nm") };
				break;
			default:
				break;
		}
		stateRef.current = {
			...stateRef.current,
			unit: unitData
		};
		setState(prevState => ({
			...prevState,
			unit: unitData
		}));
		// get the maps canvas in order to change the cursor in edit mode
		const canvas = map.getCanvasContainer();
		// If adding, replace path being edited with the current path on save
		if (stateRef.current.adding !== null && stateRef.current.editing) {
			let currentPathValue = stateRef.current.currentPath;
			const newPaths = { ...paths, currentPathValue };
			stateRef.current = {
				...stateRef.current,
				paths: Object.values(newPaths),
				adding: null
			};
			setState(prevState => ({
				...prevState,
				paths: Object.values(newPaths),
				adding: null
			}));
			updatePath(stateRef.current.currentPath);
			canvas.style.cursor = "";
			handleClear();
			// Save off the current path and reset if a path has been drawn
		} else if (stateRef.current.editing && stateRef.current.currentPath.coordinates.length > 1) {
			stateRef.current = {
				...stateRef.current,
				paths: [...Object.values(paths), stateRef.current.currentPath],
				count: stateRef.current.count + 1
			};
			setState(prevState => ({
				...prevState,
				paths: [...Object.values(paths), stateRef.current.currentPath],
				count: stateRef.current.count + 1
			}));
			updatePath(stateRef.current.currentPath);
			setActivePath(null);
			handleClear();
			canvas.style.cursor = "";
		} else {
			stateRef.current = { ...stateRef.current, editing: true };
			setState(prevState => ({
				...prevState,
				editing: true
			}));
			// Set app state to prevent entity profile from opening if clicking on a track
			setMapTools({ type: "distance" });
			canvas.style.cursor = "pointer";
		}
	};

	// Cancel drawing a path
	const handleClear = () => {
		const canvas = map.getCanvasContainer();

		setMapTools({ type: null });
		stateRef.current = {
			...stateRef.current,
			editing: false,
			adding: null,
			currentPath: {
				id: null,
				coordinates: [],
				segments: [],
				distance: null,
				eta: null,
				index: null,
				name: null,
				zoomLevel: null,
				tracks: [],
				trackData: []
			}
		};
		setState(prevState => ({
			...prevState,
			editing: false,
			adding: null,
			currentPath: {
				id: null,
				coordinates: [],
				segments: [],
				distance: null,
				eta: null,
				index: null,
				name: null,
				zoomLevel: null,
				tracks: [],
				trackData: []
			}
		}));
		setActivePath(null);
		canvas.style.cursor = "";
	};

	// Delete path when click on close path's chip
	const handleDelete = index => {

		const newPaths = [...stateRef.current.paths];

		newPaths.splice(index, 1);

		stateRef.current = {
			...stateRef.current,
			paths: newPaths
		};
		setState(prevState => ({
			...prevState,
			paths: newPaths
		}));
		stateRef.current.deletePath(stateRef.current.paths[index].id);
	};

	const getPathData = () => {
		const tracks = _.values(tracks);
		const { paths, activePath } = distanceTool;
		let filteredPaths = Object.values(paths);

		if (stateRef.current.editing) {
			filteredPaths = filteredPaths.filter(path => {
				if (activePath) {
					return activePath.id !== path.id;
				}
				return true;
			});
		}
		if (activePath) {
			filteredPaths.push(activePath);
		}

		// Ensure that the current path user is creating shows up on map
		const allPaths = _.filter(filteredPaths, path => path.id);

		// Set the GeoJSON for all paths
		const pathFeatures =
			allPaths.length > 0 && allPaths[0].coordinates.length > 0
				? allPaths
					.filter(path => {
						return path !== undefined;
					})
					.map((path, index) => {
						const trackArr =
							_.compact(path.tracks).length > 0
								? _.compact(_.values(tracks)).filter(track => {
									return path.tracks.includes(
										track.entityData.properties.id
									);
								})
								: [];

						// Paths disappear once user zooms out a certain distance relative to the zoom level on creation.
						const pathVisible = path.zoomLevel - map.getZoom() > 4 ? 0 : 1;

						// Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
						const coordinateData = path.coordinates.map(
							(coord, index, array) => {
								const track = trackArr.filter(track => {
									return (
										track.entityData.properties.id === path.tracks[index]
									);
								});
								if (
									trackArr.length > 0 &&
									track[0] &&
									path.tracks[index] === track[0].entityData.properties.id
								) {
									const newCoords = track[0].entityData.geometry.coordinates;
									return {
										coords: newCoords,
										name: track[0].entityData && track[0].entityData.properties ?
											track[0].entityData.properties.name :
											(track[0].id || null)
									};
								} else {
									return {
										coords: coord
									};
								}
							}
						);
						const coordinates = coordinateData.map(data => data.coords);

						// Get all the vertices from the path for the circles coordinates
						const points = coordinateData.map(({ coords, name }, index, array) => {
							// Check if point is associated with a track (for setting radius)
							const onTrack =
								path.tracks.length > 0 && path.tracks[index] !== null;

							const pointFeatures = {
								type: "Feature",
								properties: {
									id: "point" + index,
									pathId: path.id,
									index: index,
									color:
										stateRef.current.editing &&
											stateRef.current.pointFocus === "point" + index &&
											stateRef.current.pathFocus === path.id
											? "#35b7f3"
											: "#666",
									radius: onTrack ? 20 : map.getZoom() / 2,
									subtype: "Circle",
									pathVisibility: pathVisible
								},
								geometry: {
									type: "Point",
									coordinates: coords
								}
							};
							if (name) pointFeatures.properties["name"] = name;
							return pointFeatures;
						});

						// Get all the line segments (for displaying distances)
						const pathSegments = getSegments(coordinates, path.unit, path.trackData);
						const segments =
							path.segments.length > 0
								? _.flatten(
									pathSegments.map(
										(segment, index, array) => {
											// Labels disappear once user zooms out a certain distance relative to the zoom level on creation.
											const labelsVisible =
												path.zoomLevel - map.getZoom() > 0.9 ? 0 : 1;

											// Find the midpoint of the segment (for label placement)
											const p1 = tPoint(segment.segment[0]);
											const p2 = tPoint(segment.segment[1]);
											const midpoint = tMidpoint(p1, p2);
											const coords = midpoint.geometry.coordinates;

											const distance = segment.distance ?
												segment.distance.toFixed(2) +
												` ${path.unit ? path.unit.display : ""
												}`
												: 0;
											const bearing = segment.bearing ? segment.bearing.toFixed(2) + "\xB0" : null;
											const etaString = segment.eta ? `\nETA: ${(segment.eta).toFixed(2)} min` : "";
											const segmentFeatures = [
												{
													type: "Feature",
													properties:
														segment.id !== null
															? {
																id: segment.id,
																pathId: path.id,
																subtype: segment.eta ? "EtaSegment" : "Segment", // differentiate Paths from Segments when rendering layers
																labelVisibility: labelsVisible,
																labelText: `${distance}\n${bearing}${etaString}`
															}
															: {},
													geometry: {
														type: "Point",
														coordinates: coords
													}
												}
											];

											return segmentFeatures;
										}
									)
								)
								: [];

						// Concat all the paths, points, and segments
						const features = [
							{
								type: "LineString",
								properties: path.id
									? {
										id: path.id,
										distance: coordinates.length > 1
											? getDistance(coordinates, path.unit).toFixed(2) + ` ${path.unit.display}`
											: null,
										subtype: "Path", // differentiate Paths from Segments when rendering layers
										name: path.name,
										pathVisibility: pathVisible
									}
									: {},
								geometry: {
									type: "LineString",
									coordinates: coordinates
								}
							},
							...points,
							...segments
						];
						return features;
					})
				: [];

		// Reduce all the features down to a single array to fit GeoJSON syntax
		// Filter to remove incomplete paths and segments
		const allFeatures = pathFeatures
			.reduce((a, b) => {
				return a.concat(b);
			}, [])
			.filter(feature => {
				return feature.geometry.coordinates.length > 0;
			});

		const pathData = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: allFeatures
			}
		};

		return pathData;
	};

	const getDistance = (coordinates, unit) => {
		const { type } = unit;
		const length = tLength(tLineString(coordinates), { units: "miles" });
		if (type === "nautical-miles") {
			return length * 0.86897624;
		} else {
			return length;
		}
	};

	const getETA = (segments) => {
		return segments.reduce((totalEta, segment) => {
			const eta = segment.eta ? segment.eta : 0;
			return totalEta + eta;
		}, 0);
	};

	const { lightMap, editing, tooltip, tooltipParent } = stateRef.current;

	const pathData = getPathData();

	return (
		<Fragment>
			{/* DISTANCE TOOL LAYERS */}
			{pathData && pathData.data.features && (
				<Fragment>
					<Source id="pathSource" geoJsonSource={pathData} />

					<Layer
						id="ac2-distance-tool-segment-info"
						type="symbol"
						sourceId="pathSource"
						layout={{
							"symbol-avoid-edges": true,
							"symbol-placement": "point",
							"text-field": "{labelText}",
							"text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
							"text-size": 11,
							"text-letter-spacing": 0,
							"text-ignore-placement": true,
							"text-max-width": 15,
							"text-anchor": "center",
							"text-justify": "center",
							"text-allow-overlap": true
						}}
						paint={{
							"text-color": "#fff",
							"text-opacity": {
								type: "identity",
								property: "labelVisibility"
							}
						}}
						filter={["any", ["==", "subtype", "Segment"], ["==", "subtype", "EtaSegment"]]}
						before={before}
					/>

					{/* Segment Info Circle */}
					<Layer
						id="ac2-distance-tool-segment-info-circle"
						type="circle"
						sourceId="pathSource"
						filter={["==", "subtype", "Segment"]}
						paint={{
							"circle-color": "#666",
							"circle-stroke-width": 2,
							"circle-stroke-color": "#ffffff",
							"circle-radius": [
								"case",
								["==", ["get", "subtype"], "EtaSegment"],
								45,
								25
							],
							"circle-opacity": {
								type: "identity",
								property: "labelVisibility"
							},
							"circle-stroke-opacity": {
								type: "identity",
								property: "labelVisibility"
							}
						}}
						before="ac2-distance-tool-segment-info"
					/>

					{/* Vertex Point Circle */}
					<Layer
						id="ac2-distance-tool-circles"
						type="circle"
						sourceId="pathSource"
						paint={{
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
						}}
						filter={["==", "subtype", "Circle"]}
						before="ac2-distance-tool-segment-info-circle"
					/>

					{/* Segment Lines */}
					<Layer
						id="ac2-distance-tool-paths"
						type="line"
						sourceId="pathSource"
						paint={{
							"line-color": lightMap ? "#000000" : "#FFFFFF",
							"line-width": 2,
							"line-opacity": {
								type: "identity",
								property: "pathVisibility"
							}
						}}
						filter={["==", "subtype", "Path"]}
						before="ac2-distance-tool-circles"
					/>
					{/* Coordinates Tooltip */}
					{!editing && tooltip && tooltipParent &&
						ReactDOM.createPortal(
							tooltip,
							tooltipParent
						)
					}
				</Fragment>
			)}
			{!toolType && (
				<UnitSelect
					handleSelect={handleEdit}
					landUnitSystem={landUnitSystem}
					dir={dir}
				/>
			)}
		</Fragment>
	);
};

const handleComponentUpdate = (prevProps, nextProps) => {
	return (
		isEqual(prevProps, nextProps)
	);
};
//export default memo(DistanceTool, handleComponentUpdate);
export default DistanceTool;