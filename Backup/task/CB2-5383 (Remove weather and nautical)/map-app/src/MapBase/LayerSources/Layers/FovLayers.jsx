import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import MapLayerContainer from "../MapLayer/MapLayerContainer";

const propTypes = {
    activeFOVs: PropTypes.object,
    showAllFOVs: PropTypes.bool,
    activeFeeds: PropTypes.array,
    showFOVs: PropTypes.func,
    map: PropTypes.object
};

const FovLayers = ({
    activeFOVs,
    showAllFOVs,
    activeFeeds,
    showFOVs,
    map
}) => {
    const [initialShowDone, setInitialShowDone] = useState(false);

    // This should not be the responsibility of the FovLayers, it should be handled by the MapAppBar
    // Once the MapAppBar is refactored to be a functional component, this should be moved there.
    useEffect(() => {
        if (showAllFOVs && !initialShowDone && _.includes(activeFeeds, "cameras")) {
            showFOVs();
            setInitialShowDone(true);
        }
    }, [showAllFOVs, initialShowDone, activeFeeds, showFOVs]);

    return (
        <Fragment>
            {
                activeFOVs && (
                    <MapLayerContainer map={map} feedId="fovs" cluster={false} />
                )
            }
        </Fragment>
    );
};

FovLayers.propTypes = propTypes;

export default FovLayers;