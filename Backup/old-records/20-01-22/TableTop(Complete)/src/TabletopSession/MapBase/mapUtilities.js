import _ from "lodash";
import { point } from "@turf/helpers";
import pointInPolygon from "@turf/boolean-point-in-polygon";

export const filterEntities = ( entities, floorPlan ) => {
	const filteredEntities = [];
	if (entities) {
		if (floorPlan) {
			_.values(entities).forEach(entity => {
				if (entity.entityData && entity.entityData.geometry
					&& isGeometryOnFloorPlan(entity.entityData.geometry, floorPlan)) {
					filteredEntities.push(entity);
				}
			});
		} else {
			_.values(entities).forEach(entity => {
				if (entity.entityData && entity.entityData.geometry) {
					filteredEntities.push(entity);
				}
			});
		}
	}
	return filteredEntities;
};

export const filterFeatures = ( features, floorPlan ) => {
	const filteredFeatures = [];
	if (features) {
		if (floorPlan) {
			features.forEach(feature => {
				if (isGeometryOnFloorPlan(feature.geometry, floorPlan)) {
					filteredFeatures.push(feature);
				}
			});
		} else {
			return features;
		}
	}
	return filteredFeatures;
};

export const isGeometryOnFloorPlan = ( geometry, floorPlan ) => {
	if (!geometry || !floorPlan) {
		return false;
	}

	let coords;
	if (geometry.type === "Point") {
		coords = geometry.coordinates;
	} else if (geometry.type === "LineString") {
		coords = geometry.coordinates[0]; // We only check for first point, if first point is on floor, we assume entire line to be on floor
	}
	if (coords[0] >= floorPlan.bbox[0] && coords[0] <= floorPlan.bbox[2]
		&& coords[1] >= floorPlan.bbox[1] && coords[1] <= floorPlan.bbox[3]
		&& coords[2] >= floorPlan.altitude && coords[2] < floorPlan.nextPlanAltitude) {
		const turfPoint = point([coords[0], coords[1]]);
		const fpGeometry = floorPlan.boundingPolygon ? floorPlan.boundingPolygon : floorPlan.geometry;
		if (pointInPolygon(turfPoint, fpGeometry)) {
			return true;
		}
	}

	return false;
};

export const getGeometryFloorPlan = ( geometry, facilityFloorplans ) => {
	if (!geometry || !facilityFloorplans) {
		return false;
	}

	let coords;
	if (geometry.type === "Point") {
		coords = geometry.coordinates;
	} else if (geometry.type === "LineString") {
		coords = geometry.coordinates[0]; // We only check for first point, if first point is on floor, we assume entire line to be on floor
	}

	const facilityIds = _.keys(facilityFloorplans);
	let containingFacilityId;
	let containingFloorPlan;
	for (let i = 0; i < facilityIds.length; i++) {
		const facilityId = facilityIds[i];
		const floorPlan = facilityFloorplans[facilityId][0]; // We only pick up the first floor for bounds check
		if (coords[0] >= floorPlan.bbox[0] && coords[0] <= floorPlan.bbox[2]
			&& coords[1] >= floorPlan.bbox[1] && coords[1] <= floorPlan.bbox[3]) {
			const turfPoint = point([coords[0], coords[1]]);
			const fpGeometry = floorPlan.boundingPolygon ? floorPlan.boundingPolygon : floorPlan.geometry;
			if (pointInPolygon(turfPoint, fpGeometry)) {
				containingFacilityId = facilityId;
				if (coords.length > 2) {
					for (let j = 0; j < facilityFloorplans[facilityId].length; j++) {
						const fp = facilityFloorplans[facilityId][j];
						if (coords[2] >= fp.altitude && coords[2] < fp.nextPlanAltitude) {
							containingFloorPlan = fp;
							break;
						}
					}
				}
				break;
			}
		}
	}

	return {
		inFacility: !!containingFacilityId,
		facilityId: containingFacilityId,
		floorPlanId: containingFloorPlan ? containingFloorPlan.id : null
	};
};

export const isGeometryOnFloorPlanWithoutAlitudeCheck = ( geometry, floorPlan ) => {
	if (!geometry || !floorPlan) {
		return false;
	}

	let coords;
	if (geometry.type === "Point") {
		coords = geometry.coordinates;
	} else if (geometry.type === "LineString") {
		coords = geometry.coordinates[0]; // We only check for first point, if first point is on floor, we assume entire line to be on floor
	}
	if (coords[0] >= floorPlan.bbox[0] && coords[0] <= floorPlan.bbox[2]
		&& coords[1] >= floorPlan.bbox[1] && coords[1] <= floorPlan.bbox[3]) {
		const turfPoint = point([coords[0], coords[1]]);
		const fpGeometry = floorPlan.boundingPolygon ? floorPlan.boundingPolygon : floorPlan.geometry;
		if (pointInPolygon(turfPoint, fpGeometry)) {
			return true;
		}
	}

	return false;
};


// Going forward, this data could come from configuration. An alternative could be to change the 
// contents of the svgs referred below to update the icons.
export const iconConfig = {
	agent: "static/map-icons/map-transparent.svg",
	objective: "static/map-icons/map-objective.svg",
	objective_onfloor: "static/map-icons/map-objective-onfloor.svg",
	objective_modification: "static/map-icons/map-objective-modification.svg",
	interdictionSite: "static/map-icons/map-interdiction-point.svg",
	interdictionSite_onfloor: "static/map-icons/map-interdiction-point-onfloor.svg",
	facility: "static/map-icons/map-facility.svg",
	BLUE_barrierBreach: "static/map-icons/map-blue-barrier-breach.svg",
	RED_barrierBreach: "static/map-icons/map-red-barrier-breach.svg",
	RED_targetDestroyed: "static/map-icons/map-target-destroyed.svg"
};

let mapIcons = null;
export const getMapIcons = () => {
	if (!mapIcons) {
		mapIcons = [];
		_.keys(iconConfig).forEach(entityType => {
			const img = new Image(40, 40);
			img.src = iconConfig[entityType];
			mapIcons.push([entityType, img]);
		});
	}
	return mapIcons;
};

export const getEntitiesForMapFeatures = ( features ) => {
	const agents = [];
	const facilities = [];
	const objectives = [];
	const interdictionSites = [];

	let count = 0;
	features.forEach(feature => {
		const entity = feature.properties;
		if (entity) {
			if (entity.entityType === "agent") {
				agents.push(feature);
				count++;
			} else if (entity.type === "Facility") {
				facilities.push(feature);
				count++;
			} else if (entity.entityType === "objective") {
				objectives.push(feature);
				count++;
			} else if (entity.entityType === "interdictionSite") {
				interdictionSites.push(feature);
				count++;
			}
		}
	});
	return {
		count,
		agents,
		facilities,
		objectives,
		interdictionSites
	};
};