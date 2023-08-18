import React, { Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ActiveFloorPlansContainer from "../../ActiveFloorPlans/ActiveFloorPlansContainer";
import FacilitiesLayerContainer from "../../FacilitiesLayer/FacilitiesLayerConatiner";

const propTypes = {
    facilityFeeds: PropTypes.array
};

const FacilityLayers = ({
    facilityFeeds
}) => {
    return (
        <Fragment>
            {
                _.map(facilityFeeds, feedId =>
                    <Fragment key={`${feedId}`}>
                        <FacilitiesLayerContainer key={`${feedId}_layer`} feedId={feedId} before="---ac2-feed-entities-position-end" />
                        <ActiveFloorPlansContainer key={`${feedId}_floorplans`} feedId={feedId} before="---ac2-floorplans-position-end" />
                    </Fragment>
                )
            }
        </Fragment>
    );
};

FacilityLayers.propTypes = propTypes;

export default FacilityLayers;