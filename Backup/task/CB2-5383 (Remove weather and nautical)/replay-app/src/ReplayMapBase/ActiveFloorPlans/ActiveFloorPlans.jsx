/* eslint react/prop-types: 0 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";

const propTypes = {
	selectedFloor: PropTypes.object,
	feedId: PropTypes.string
};

const defaultProps = {
	selectedFloors: {}
};

const ActiveFloorPlans = ({ selectedFloors, feedId }) => {
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
						feedId={feedId}
					/>
				);
			})}
		</Fragment>)
		: null;
};

ActiveFloorPlans.propTypes = propTypes;
ActiveFloorPlans.defaultProps = defaultProps;

export default ActiveFloorPlans;
