import midpoint from "@turf/midpoint";
import { point, lineString } from "@turf/helpers";
import distance from "@turf/distance";
import center from "@turf/center";
import bearing from "@turf/bearing";
import rotate from "@turf/transform-rotate";
import destination from "@turf/destination";
import scale from "@turf/transform-scale";

const FloorPlanMode = {};

FloorPlanMode.getHandle = function (coordinates) {
	const polyBearing = bearing(coordinates[0], coordinates[1]);
	const polyCenter = center({ type: "Polygon", coordinates: [coordinates] });
	const pointA = point(coordinates[1]);
	const pointB = point(coordinates[2]);
	const sideMidpoint = midpoint(pointA, pointB);
	const distanceFromSide = distance(pointA, pointB) / 3;
	const distanceFromCenter = distance(sideMidpoint, polyCenter);
	const handlePoint = destination(polyCenter, distanceFromSide + distanceFromCenter, polyBearing);
	return handlePoint;
};

FloorPlanMode.addHandles = function (coordinates, { initial }) {
	const handles = {};
	let rotateArm;
	let rotateHandle;
	if (initial) {
		const handlePoint = this.getHandle(coordinates);
		rotateHandle = this.newFeature({
			...handlePoint,
			properties: { rotateHandle: true }
		});
		rotateArm = this.newFeature({
			...lineString([
				handlePoint.geometry.coordinates,
				midpoint(coordinates[1], coordinates[2]).geometry.coordinates
			])
		});

		this.addFeature(rotateHandle);
		this.addFeature(rotateArm);
		this.setSelected(rotateHandle.id);
		this.setSelected(rotateArm.id);
	}
	coordinates.forEach((coordinates, index) => {
		const handle = this.newFeature({
			geometry: {
				type: "Point",
				coordinates
			},
			properties: {
				index
			}
		});
		this.addFeature(handle);
		this.setSelected(handle.id);
		handles[handle.id] = handle;
	});
	return { handles, rotateHandle, rotateArm };
};

FloorPlanMode.setRotationHandle = function (state) {
	const { floorPlan } = state;
	const pointA = point(floorPlan.coordinates[0][1]);
	const pointB = point(floorPlan.coordinates[0][2]);
	const sideMidpoint = midpoint(pointA, pointB);
	const newHandle = this.getHandle(floorPlan.coordinates[0]);
	state.rotateArm.updateCoordinate("0", sideMidpoint.geometry.coordinates[0], sideMidpoint.geometry.coordinates[1]);
	state.rotateArm.updateCoordinate("1", newHandle.geometry.coordinates[0], newHandle.geometry.coordinates[1]);
	state.rotateHandle.updateCoordinate("0", newHandle.geometry.coordinates[0], newHandle.geometry.coordinates[1]);
};

FloorPlanMode.removeHandles = function (state) {
	const { handles, hovered } = state;
	Object.keys(handles).forEach((id) => this.deleteFeature(id));
	if (hovered) {
		this.deleteFeature(hovered);
		state.hovered = false;
	}
	state.handles = {};
};

FloorPlanMode.dragMove = function (state, e) {
	const { lngLat } = e;
	const { dragMoveLocation, floorPlan } = state;
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
	const newCoords = floorPlan.coordinates[0].map(moveCoordinates);
	newCoords.forEach((c, index) => {
		floorPlan.updateCoordinate(`0.${index}`, c[0], c[1]);
	});
	state.dragMoveLocation = lngLat;
};

FloorPlanMode.onSetup = function (opts) {
	const { id, properties = {}, geometry } = opts.feature;
	const floorPlan = this.newFeature({
		type: "Feature",
		geometry,
		...(id && { id }),
		...(properties && { properties })
	});
	this.addFeature(floorPlan);
	this.setSelected(floorPlan.id);
	this.setActionableState({ trash: true });
	this.map.getCanvas().style.cursor = "";
	const { handles, rotateHandle, rotateArm } = this.addHandles(floorPlan.coordinates[0], { initial: true });
	return { floorPlan, handles, rotateHandle, rotateArm };
};

FloorPlanMode.onMouseDown = function (state, e) {
	const { handles, activeHandle, hovered } = state;
	const { featureTarget, lngLat } = e;
	if (featureTarget) {
		this.map.dragPan.disable();
		const { id, user_rotateHandle } = featureTarget.properties;
		if (user_rotateHandle) {
			state.rotating = true;
			state.activeHandle = handles[id];
		} else if (hovered || activeHandle) {
			this.map.getCanvas().style.cursor = "grabbing";
			state.prevLng = lngLat.lng;
			state.prevLat = lngLat.lat;
			state.origin =
				activeHandle.properties.index > 1
					? Object.values(handles).find(
							(handle) => handle.properties.index === activeHandle.properties.index - 2
					  )
					: Object.values(handles).find(
							(handle) => handle.properties.index === activeHandle.properties.index + 2
					  );
		} else {
			state.dragFloorPlan = true;
			state.dragMoveLocation = lngLat;
		}
	}
};

FloorPlanMode.onDrag = function (state, e) {
	const { lng, lat } = e.lngLat;
	const { activeHandle, dragFloorPlan, rotating, floorPlan, rotateHandle } = state;
	this.removeHandles(state, e);
	if (rotating) {
		const polyCenter = center(floorPlan);
		const prevBearing = bearing(polyCenter, point(rotateHandle.coordinates));
		const newBearing = bearing(polyCenter, point([lng, lat]));
		const newPoly = rotate(floorPlan, newBearing - prevBearing, {
			pivot: polyCenter
		});
		newPoly.coordinates[0].forEach((coord, index) => {
			state.floorPlan.updateCoordinate(`0.${index}`, coord[0], coord[1]);
		});
	} else if (dragFloorPlan) {
		this.dragMove(state, e);
	} else if (activeHandle) {
		this.handleScale(state, e);
	}
	this.setRotationHandle(state);
};

FloorPlanMode.handleScale = function (state, e) {
	const { lngLat } = e;
	const { floorPlan, prevLng, prevLat, origin } = state;
	const { lng, lat } = lngLat;
	const prevDistance = distance([prevLng, prevLat], origin);
	const newDistance = distance([lng, lat], origin);
	const factor = newDistance / prevDistance;
	const newPlan = scale(floorPlan, factor, {
		origin: origin.coordinates
	});
	newPlan.coordinates[0].forEach((coord, index) => {
		state.floorPlan.updateCoordinate(`0.${index}`, coord[0], coord[1]);
	});
	state.prevLng = lng;
	state.prevLat = lat;
};

FloorPlanMode.onMouseUp = function (state) {
	const { floorPlan } = state;
	this.map.dragPan.enable();
	this.map.fire("draw.floorPlanUpdate", { floorPlan });
	state.activeHandle = null;
	if (!Object.values(state.handles).length) {
		const { handles } = this.addHandles(floorPlan.coordinates[0], {
			initial: false
		});
		state.handles = handles;
	}
	state.dragFloorPlan = false;
	state.rotating = false;
	state.initialShape = null;
};

FloorPlanMode.onMouseMove = function (state, e) {
	const { handles, hovered } = state;
	const { featureTarget } = e;
	if (featureTarget) {
		const { id } = featureTarget.properties;
		const handle = handles[id];
		if (id && !handle) {
			this.map.getCanvas().style.cursor = "move";
			if (hovered) {
				this.deleteFeature(hovered);
				state.hovered = false;
			}
		} else {
			this.map.getCanvas().style.cursor = "pointer";
			state.activeHandle = handles[id];
			if (id && !hovered) {
				const hoverPoint = this.newFeature({
					geometry: featureTarget.geometry,
					properties: { hover: true }
				});
				this.addFeature(hoverPoint);
				this.setSelected(hoverPoint.id);
				state.hovered = hoverPoint.id;
			}
		}
	} else {
		this.map.getCanvas().style.cursor = "grab";
		if (hovered) {
			this.deleteFeature(hovered);
			state.hovered = false;
			state.activeHandle = null;
		}
	}
};

FloorPlanMode.toDisplayFeatures = function (state, geojson, display) {
	display(geojson);
};

export default FloorPlanMode;
