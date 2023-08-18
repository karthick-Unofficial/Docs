import React, { Fragment } from "react";
import PropTypes from "prop-types";
import map from "lodash/map";
import ActiveFloorPlans from "../../ActiveFloorPlans/ActiveFloorPlans";
import FacilitiesLayerWrapper from "../../FacilitiesLayer/FacilitiesLayerWrapper";

const propTypes = {
	facilityFeeds: PropTypes.array
};

const FacilityLayers = ({ facilityFeeds }) => {
	return (
		<Fragment>
			{map(facilityFeeds, (feedId) => (
				<Fragment key={`${feedId}`}>
					<FacilitiesLayerWrapper
						key={`${feedId}_layer`}
						feedId={feedId}
						before="---ac2-facilities-position-end"
					/>
					<ActiveFloorPlans
						key={`${feedId}_floorplans`}
						feedId={feedId}
						before="---ac2-floorplans-position-end"
					/>
				</Fragment>
			))}
		</Fragment>
	);
};

FacilityLayers.propTypes = propTypes;

export default FacilityLayers;
