import React, { Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import MapLayerContainer from "../MapLayer/MapLayerContainer";

const propTypes = {
    activeFeeds: PropTypes.array,
    map: PropTypes.object
};

const FeedLayers = ({
    activeFeeds,
    map
}) => {
    return (
        <Fragment>
            {
                _.map(activeFeeds, feedId => (
                    <MapLayerContainer key={feedId} map={map} feedId={feedId} />
                ))
            }
        </Fragment>
    );
};

FeedLayers.propTypes = propTypes;

export default FeedLayers;