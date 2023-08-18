import React, { useEffect } from "react";
import PropTypes from "prop-types";
import FacilityListContainer from "./FacilityListContainer";
import FacilityContainer from "./FacilityContainer";

const propTypes = {
	facilities: PropTypes.object,
	floorPlans: PropTypes.object,
	externalMessage: PropTypes.object,
	clearComponentMessage: PropTypes.func.isRequired,
	useLocalState: PropTypes.func.isRequired
};

const Facilities = ( { facilities, floorPlans, externalMessage, clearComponentMessage, useLocalState } ) => {
	const [ currentFacility, setCurrentFacility ] = useLocalState("currentFacility", null);
	const [ currentFloorPlan, setCurrentFloorPlan ] = useLocalState("currentFloorPlan", null);

	const navigate = (facility, floorPlan) => {
		setCurrentFacility(facility);
		setCurrentFloorPlan(floorPlan);
	};

	useEffect(() => {
		if (externalMessage && externalMessage.facilityId) {
			if (facilities.hasOwnProperty(externalMessage.facilityId)) {
				let floorPlan = null;
				if (externalMessage.floorPlanId) {
					floorPlan = floorPlans[externalMessage.facilityId].find(fp => fp.id === externalMessage.floorPlanId);
				}
				if (!currentFacility || currentFacility.id !== externalMessage.facilityId
					|| (!currentFloorPlan && floorPlan) || (currentFloorPlan && !floorPlan)
					|| (currentFloorPlan && floorPlan && currentFloorPlan.id !== floorPlan.id)) {
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
			{!currentFacility && 
				<FacilityListContainer facilities={facilities} navigate={navigate} />
			}
			{currentFacility && !currentFloorPlan &&
				<FacilityContainer facility={currentFacility} navigate={navigate} />
			}
			{currentFacility && currentFloorPlan &&
				<FacilityContainer facility={currentFacility} floorPlan={currentFloorPlan} navigate={navigate} />
			}
		</div>
	);
};

Facilities.propTypes = propTypes;
export default Facilities;