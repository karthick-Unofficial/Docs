import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";

const propTypes = {
	selectedFloor: PropTypes.object,
	coordinates: PropTypes.array,
	mode: PropTypes.string
};

const defaultProps = {
	selectedFloor: null
};

const ActiveFloorPlans = ({ selectedFloors }) => {
	return selectedFloors && Object.keys(selectedFloors).length ? (
		<Fragment>
			{Object.keys(selectedFloors).map(facilityId => {
				return (
					<FloorPlan
						key={`selected-floorplan-${selectedFloors[facilityId].id}`}
						id={selectedFloors[facilityId].id}
						coordinates={selectedFloors[facilityId].geometry.coordinates[0]}
						image={`/_download?handle=${selectedFloors[facilityId].handle}`}
						editing={false}
					/>
				);
			})}
		</Fragment>)
		: null;
};

ActiveFloorPlans.propTypes = propTypes;
ActiveFloorPlans.defaultProps = defaultProps;

export default ActiveFloorPlans;
