/* eslint react/prop-types: 0 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";
import { useSelector } from "react-redux";
import { persistedState } from "orion-components/AppState/Selectors";
import { layerSourcesSelector } from "orion-components/GlobalData/Selectors";

const propTypes = {
	feedId: PropTypes.string
};

const ActiveFloorPlans = (props) => {
	const { feedId } = props;

	const SelectedFloors = useSelector(state => persistedState(state).selectedFloors) || {};
	const feedData = useSelector(state => layerSourcesSelector(state, props));
	const filteredFps = {};
	if (feedData && SelectedFloors) {
		Object.keys(feedData).forEach(facilityId => {
			if (SelectedFloors[facilityId] && SelectedFloors[facilityId].id) {
				filteredFps[facilityId] = SelectedFloors[facilityId];
			}
		});
	}
	const selectedFloors = Object.keys(filteredFps).length ? filteredFps : null;

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

export default ActiveFloorPlans;
