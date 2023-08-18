import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Target } from "orion-components/CBComponents/Icons";
import { isGeometryOnFloorPlan } from "../../MapBase/mapUtilities";
import TargetingLine from "./TargetingLine";

import $ from "jquery";

const propTypes = {
	mapRefs: PropTypes.array,
	floorPlans: PropTypes.object,
	entities: PropTypes.array,
	geometries: PropTypes.array,
	moveToTarget: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const TargetingIcon = ( { mapRefs, floorPlans, entities, geometries, moveToTarget, dir } ) => {
	const [draw, setDraw] = useState(false);
	const [x, setX] = useState(null);
	const [y, setY] = useState(null);
	const [rerender, setRerender] = useState(null);

	const mouseEnter = e => {
		const pos = e.target.getBoundingClientRect();
		setDraw(true);
		setX(pos.right - pos.width / 2 - 6);
		setY(pos.top - 36);

		const rerender = setInterval(
			() =>
				setDraw(true),
			10
		);

		setRerender(rerender);
	};

	const mouseLeave = () => {
		clearInterval(rerender);
		setDraw(false);
		setX(null);
		setY(null);
		setRerender(null);
	};

	const getFloorPlan = (mapRef) => {
		const facilityPlans = floorPlans[mapRef.facilityId];
		if (facilityPlans) {
			return facilityPlans.find(plan => plan.id === mapRef.floorPlanId);
		}
		return null;
	};

	const drawLineToEntities = ( mapRef ) => {
		return entities.map( entity => {
			if (entity.entityData && entity.entityData.geometry 
				&& (!mapRef.floorPlanId || isGeometryOnFloorPlan(entity.entityData.geometry, getFloorPlan(mapRef)))) {
				return (
					<TargetingLine key={`${mapRef.floorPlanId}-${entity.id}`}
						draw={draw}
						x={x}
						y={y}
						map={mapRef.mapRef}
						geometry={entity.entityData.geometry}
						dir={dir}
					/>
				);
			} else {
				return null;
			}
		});
	};

	const drawLineToGeometries = ( mapRef ) => {
		return geometries.map( (geometry, index) => {
			if (!mapRef.floorPlanId || isGeometryOnFloorPlan(geometry, getFloorPlan(mapRef))) {
				return (
					<TargetingLine key={`${mapRef.floorPlanId}-${index}`}
						draw={draw}
						x={x}
						y={y}
						map={mapRef.mapRef}
						geometry={geometry}
						dir={dir}
					/>
				);
			} else {
				return null;
			}
		});
	};

	const centerTarget = (e) => {
		let count = entities ? entities.length : 0;
		count += geometries ? geometries.length : 0;
		if (count === 1) {
			// We have exactly one target, so we can center the main map to that target
			const map = mapRefs.find(mapRef => !mapRef.floorPlanId).mapRef;
			const geometry = entities ? entities[0].entityData.geometry : geometries[0];
			moveToTarget(e, geometry, map);
		} else if (count > 1) {
			// We update the map to fit all the points
			const map = mapRefs.find(mapRef => !mapRef.floorPlanId).mapRef;
			const allPoints = [];
			if (entities) {
				entities.forEach(entity => {
					if (entity.entityData && entity.entityData.geometry) {
						allPoints.push(entity.entityData.geometry.coordinates);
					}
				});
			}
			if (geometries) {
				geometries.forEach(geometry => allPoints.push(geometry.coordinates));
			}
			if (allPoints.length > 0) {
				map.fitBounds(allPoints, { padding: 300 });
			}
		}
	};

	const shouldRender = mapRefs && ((entities && entities.length > 0) || (geometries && geometries.length > 0));

	return (
		shouldRender ? (
			<React.Fragment>
				{draw && $(window).width() > 1023 && entities && entities.length > 0 && mapRefs.map(mapRef => {
					return drawLineToEntities(mapRef);
				})}
				{draw && $(window).width() > 1023 && geometries && geometries.length > 0 && mapRefs.map(mapRef => {
					return drawLineToGeometries(mapRef);
				})}
				<IconButton
					style={{ opacity: 1 }}
					onClick={e => centerTarget(e)}
				>
					<Target
						handleMouseEnter={mouseEnter}
						handleMouseLeave={mouseLeave}
					/>
				</IconButton>
			</React.Fragment>
		) : null
	);
};

TargetingIcon.propTypes = propTypes;
export default TargetingIcon;