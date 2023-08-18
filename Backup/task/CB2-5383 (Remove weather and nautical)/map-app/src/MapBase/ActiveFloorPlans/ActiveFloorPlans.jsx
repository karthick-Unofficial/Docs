import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";

const propTypes = {
	selectedFloor: PropTypes.object,
	feedId: PropTypes.string,
	before: PropTypes.string
};

const defaultProps = {
	selectedFloors: {}
};

const ActiveFloorPlans = ({ selectedFloors, feedId, before, style }) => {
	const [styleReloaded, setStyleReloaded] = useState(true);

	// This is necessary to re-add the floor plan images after the map style changes
	// because the map style change clears out the image.
	useEffect(() => {
		setStyleReloaded(false);
	 	setTimeout(() => setStyleReloaded(true), 10);
	}, [style]);

	return selectedFloors && styleReloaded && Object.keys(selectedFloors).length ? (
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
						before={before}
					/>
				);
			})}
		</Fragment>)
		: null;
};

ActiveFloorPlans.propTypes = propTypes;
ActiveFloorPlans.defaultProps = defaultProps;

export default ActiveFloorPlans;
