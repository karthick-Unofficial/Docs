import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Map from "lodash/map";
import { BasicLayer } from "orion-components/Map/Layers";

const propTypes = {
    gisLayers: PropTypes.object,
    loadGISProfile: PropTypes.func,
    labelsVisible: PropTypes.bool,
    map: PropTypes.object
};

const GisLayers = ({
    gisLayers,
    loadGISProfile,
    labelsVisible,
    map
}) => {
    const [layers, setLayers] = useState({});

    useEffect(() => {
        const newLayers = { ...gisLayers };

        // Enforce layer naming convention
        Object.keys(newLayers).forEach(layerId => {
            if (!newLayers[layerId].name.startsWith("gis-")) {
                newLayers[layerId].name = `gis-${newLayers[layerId].name}`;
            }
        });

        setLayers(newLayers);
    }, [gisLayers]);

    const handleLoadGIS = (featureId, featureName, layerId) => {
        loadGISProfile(
            featureId,
            featureName,
            layerId,
            "gis",
            "profile",
            "primary"
        );
    };

    return (
        <Fragment>
            {
                Map(layers, layer => (
                    <BasicLayer
                        key={layer.name}
                        map={map}
                        layer={layer}
                        handleClick={handleLoadGIS}
                        labelsVisible={labelsVisible}
                        before="---ac2-gis-{mapboxType}s-position-end"
                    />
                ))
            }
        </Fragment>
    );
};

GisLayers.propTypes = propTypes;

export default GisLayers;