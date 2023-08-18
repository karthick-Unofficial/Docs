import midpoint from "@turf/midpoint";
import { point } from "@turf/helpers";
const SpotlightMode = {};

SpotlightMode.addHandles = function (coordinates) {
	const handles = {};
	const getMidpoint = (indexA, indexB) =>
		midpoint(point(coordinates[indexA]), point(coordinates[indexB]));
	coordinates.forEach((c, index) => {
		let mid = null;
		if (index !== coordinates.length - 1) {
			mid = getMidpoint(index, index + 1);
		} else {
			mid = getMidpoint(index, 0);
		}
		const handle = this.newFeature({
			...mid,
			properties: {
				...mid.properties,
				index,
				movement: index % 2 === 0 ? "lat" : "lng"
			}
		});
		this.addFeature(handle);
		this.setSelected(handle.id);
		handles[handle.id] = handle;
	});
	return handles;
};

SpotlightMode.removeHandles = function (state) {
	const { handles } = state;
	Object.keys(handles).forEach((id) => this.deleteFeature(id));
	state.handles = {};
};

SpotlightMode.dragMove = function (state, e) {
	const { lngLat } = e;
	const { dragMoveLocation, spotlight } = state;
	const delta = {
		lng: lngLat.lng - dragMoveLocation.lng,
		lat: lngLat.lat - dragMoveLocation.lat
	};
	const moveCoordinates = (coord) => {
		const point = {
			lng: coord[0] + delta.lng,
			lat: coord[1] + delta.lat
		};
		return [point.lng, point.lat];
	};
	const newCoords = spotlight.coordinates[0].map(moveCoordinates);
	newCoords.forEach((c, index) => {
		spotlight.updateCoordinate(`0.${index}`, c[0], c[1]);
	});
	state.dragMoveLocation = lngLat;
};

SpotlightMode.onSetup = function (opts) {
	const { id, properties = {}, geometry } = opts.feature;
	const spotlight = this.newFeature({
		type: "Feature",
		geometry,
		...(id && { id }),
		...(properties && { properties })
	});
	this.addFeature(spotlight);
	this.setSelected(spotlight.id);
	this.setActionableState({ trash: true });
	this.map.getCanvas().style.cursor = "";
	const handles = this.addHandles(spotlight.coordinates[0]);
	return { spotlight, handles };
};

SpotlightMode.onMouseDown = function (state, e) {
	const { handles } = state;
	const { featureTarget, lngLat } = e;
	if (featureTarget) {
		this.map.dragPan.disable();
		const { id } = featureTarget.properties;
		if (handles[id]) {
			state.activeHandle = handles[id];
		} else {
			state.dragSpotlight = true;
			state.dragMoveLocation = lngLat;
		}
	}
};

SpotlightMode.onDrag = function (state, e) {
	const { lng, lat } = e.lngLat;
	const { activeHandle, dragSpotlight, handles } = state;
	if (dragSpotlight) {
		this.removeHandles(state, e);
		this.dragMove(state, e);
	} else if (activeHandle) {
		const { index, movement } = activeHandle.properties;
		const getHandle = (index) =>
			Object.values(handles).find(
				(handle) => handle.properties.index === index
			);

		const preIndex = index === 0 ? 3 : index - 1;
		const postIndex = index === 3 ? 0 : index + 1;
		const longitude = (index) =>
			movement === "lng" ? lng : state.spotlight.coordinates[0][index][0];
		const latitude = (index) =>
			movement === "lat" ? lat : state.spotlight.coordinates[0][index][1];
		state.spotlight.updateCoordinate(
			`0.${index}`,
			longitude(index),
			latitude(index)
		);
		state.spotlight.updateCoordinate(
			`0.${postIndex}`,
			longitude(postIndex),
			latitude(postIndex)
		);
		const getNewMid = (index) => {
			const newMid =
				index === 3
					? midpoint(
							point(state.spotlight.coordinates[0][index]),
							point(state.spotlight.coordinates[0][0])
					  )
					: midpoint(
							point(state.spotlight.coordinates[0][index]),
							point(state.spotlight.coordinates[0][index + 1])
					  );
			return newMid.geometry.coordinates;
		};
		getHandle(preIndex).updateCoordinate(
			"0",
			getNewMid(preIndex)[0],
			getNewMid(preIndex)[1]
		);
		getHandle(postIndex).updateCoordinate(
			"0",
			getNewMid(postIndex)[0],
			getNewMid(postIndex)[1]
		);
		if (movement === "lng") {
			activeHandle.updateCoordinate(
				"0",
				lng,
				activeHandle.coordinates[1]
			);
		} else {
			activeHandle.updateCoordinate(
				"0",
				activeHandle.coordinates[0],
				lat
			);
		}
	}
};

SpotlightMode.onMouseUp = function (state, e) {
	const { dragSpotlight, spotlight } = state;
	this.map.dragPan.enable();
	this.map.fire("draw.spotlightUpdate", { spotlight });
	state.activeHandle = null;
	if (dragSpotlight) {
		const handles = this.addHandles(spotlight.coordinates[0]);
		state.dragSpotlight = false;
		state.handles = handles;
	}
};

SpotlightMode.onMouseMove = function (state, e) {
	const { handles } = state;
	const { featureTarget } = e;
	if (featureTarget) {
		const { id } = featureTarget.properties;
		const handle = handles[id];
		if (handle) {
			this.map.getCanvas().style.cursor =
				handle.properties.movement === "lng"
					? "ew-resize"
					: "ns-resize";
		} else {
			this.map.getCanvas().style.cursor = "move";
		}
	}
};

SpotlightMode.toDisplayFeatures = function (state, geojson, display) {
	display(geojson);
};

export default SpotlightMode;
