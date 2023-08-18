import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Map from "lodash/map";
import MapLayer from "../MapLayer/MapLayer";

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
                Map(activeFeeds, feedId => (
                    <MapLayer key={feedId} map={map} feedId={feedId} />
                ))
            }
        </Fragment>
    );
};

FeedLayers.propTypes = propTypes;

export default FeedLayers;