import React from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";

const propTypes = {
	selectedFloor: PropTypes.object,
	coordinates: PropTypes.array,
	mode: PropTypes.string,
	creating: PropTypes.bool,
	map: PropTypes.object,
	image: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

const defaultProps = {
	selectedFloor: null
};

const ActiveFloorPlan = ({ selectedFloor, coordinates, mode, creating, map }) => {
	return selectedFloor && map && !creating ? (
		<FloorPlan
			id={selectedFloor.id}
			coordinates={coordinates ? [...coordinates] : [...selectedFloor.geometry.coordinates[0]]}
			image={`/_download?handle=${selectedFloor.handle}`}
			editing={mode === "floor_plan_mode" ? true : false}
			map={map}
			before="---ac2-floorplans-position-end"
		/>
	) : null;
};

ActiveFloorPlan.propTypes = propTypes;
ActiveFloorPlan.defaultProps = defaultProps;

export default ActiveFloorPlan;
