import React, { useEffect } from "react";
import PropTypes from "prop-types";
import FacilityListContainer from "./FacilityListContainer";
import FacilityContainer from "./FacilityContainer";

const propTypes = {
	facilities: PropTypes.object,
	floorPlans: PropTypes.object,
	externalMessage: PropTypes.object,
	localState: PropTypes.object,
	clearComponentMessage: PropTypes.func.isRequired,
	setLocalAppState: PropTypes.func.isRequired
};

const defaultProps = {
	localState: {
		currentFacility: null,
		currentFloorPlan: null
	}
};

const Facilities = ( { facilities, floorPlans, externalMessage, localState, clearComponentMessage, setLocalAppState } ) => {

	const navigate = (facility, floorPlan) => {
		const newState = {
			currentFacility: facility,
			currentFloorPlan: floorPlan
		};
		setLocalAppState("panel_facilities", newState);
	};

	useEffect(() => {
		if (externalMessage && externalMessage.facilityId) {
			if (facilities.hasOwnProperty(externalMessage.facilityId)) {
				let floorPlan = null;
				if (externalMessage.floorPlanId) {
					floorPlan = floorPlans[externalMessage.facilityId].find(fp => fp.id === externalMessage.floorPlanId);
				}
				if (!localState.currentFacility || localState.currentFacility.id !== externalMessage.facilityId
					|| (!localState.currentFloorPlan && floorPlan) || (localState.currentFloorPlan && !floorPlan)
					|| (localState.currentFloorPlan && floorPlan && localState.currentFloorPlan.id !== floorPlan.id)) {
					navigate(facilities[externalMessage.facilityId], floorPlan);
				}
			} else {
				console.log("Facility not found");
			}
			clearComponentMessage(); // Clear the message now that we have handled it
		}
	}, [ externalMessage ]);

	return (
		<div>
			{!localState.currentFacility && 
				<FacilityListContainer facilities={facilities} navigate={navigate} />
			}
			{localState.currentFacility && !localState.currentFloorPlan &&
				<FacilityContainer facility={localState.currentFacility} navigate={navigate} />
			}
			{localState.currentFacility && localState.currentFloorPlan &&
				<FacilityContainer facility={localState.currentFacility} floorPlan={localState.currentFloorPlan} navigate={navigate} />
			}
		</div>
	);
};

Facilities.propTypes = propTypes;
Facilities.defaultProps = defaultProps;
export default Facilities;