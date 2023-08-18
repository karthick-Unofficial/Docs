import React, { useEffect, useState } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

import * as camerasMapLayersActions from "../CamerasMapLayers/camerasMapLayersActions";

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const CamerasLayer = ({ map }) => {
    let { entityLabelsVisible } = useSelector(state => mapSettingsSelector(state));
    const context = useSelector(state => selectedContextSelector(state));
    const contextLoaded = context && context.entity;

    const mapState = useSelector(state => state.mapState);
    const cameraFeatures = useSelector(state => cameraMapFeatures(contextId)(state));


    const [eventsSource, setEventsSource] = useState(null);

    const {
        loadProfile,
        setMapEntities,
        updateCamera
    } = camerasMapLayersActions;

    const handleEntityClick = (e, context = "secondary") => {
        if (mapState.mapTools.type !== "drawing") {
            // Add custom cancel bubble property to original event
            e.originalEvent.cancelBubble = true;
            const { id } = e.features[0].properties;
            filterAndLoadProfile(id, context);
        }
    };

    const filterAndLoadProfile = (id, context) => {
        const entitiesFiltered = Object.values(items)
            .filter(entity => {
                return _.includes(entity.id, id);
            })
            // Prevent click on selected camera's FOV polygon
            .filter(entity => {
                return !entity.parentEntity;
            });
        if (
            entitiesFiltered.length > 0 &&
            mapState.mapTools.type !== "distance"
        ) {
            const { id, entityData, entityType } = entitiesFiltered[0];
            dispatch(loadProfile(
                id,
                entityData.properties.name,
                entityType,
                "profile",
                context
            ));
        }
    };

    const getGeoJSON = entityType => {
        const { mode, feature } = mapState.mapTools;
        const filteredItems = Object.values(cameraFeatures)
            .filter(item => {
                const type = item.entityType;
                return (
                    type.toLowerCase() === entityType.toLowerCase() && !item.parentEntity
                );
            })
            .filter(item => {
                // Remove current FOV or camera from map while editing
                if (!!mode && !!feature) {
                    return item.id !== feature.id;
                } else {
                    return item;
                }
            })
            .map(item => {
                if (item.entityData.properties.type === "Polygon") {
                    item.entityData.type = "Feature";
                }
                item.entityData.properties.id = item.id;
                item.entityData.properties.entityType = item.entityType;

                if (item.entityType === "track" || item.entityType === "accessPoint") {
                    // -- set mapIcon based on jsonata expression
                    item.entityData.properties.mapIcon = profileIconTemplates[item.feedId].evaluate(item.entityData);
                }

                if (item.hasOwnProperty("controls"))
                    item.entityData.properties.controls = item.controls;

                return item.entityData;
            });

        const source = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: filteredItems
            }
        };
        return source;
    };

    useEffect(() => {
        // Loads details for cameras
        map.on("click", "unclustered-camera", e => handleEntityClick(e, "primary"));
        map.on("touchend", "unclustered-camera", e =>
            handleEntityClick(e, "primary")
        );
    }, []);


    return (
        <>
            <Source
                id="CameraSource"
                geoJsonSource={getGeoJSON("Camera")}
            />
            {hasSource("Camera") && (
                <Layer
                    id="ac2-unclustered-camera"
                    type="symbol"
                    sourceId="CameraSource"
                    filter={["!has", "point_count"]}
                    layout={{
                        "icon-image": [
                            "case",
                            ["has", "mapIcon"],
                            ["get", "mapIcon"],
                            "Camera_gray"
                        ],
                        "icon-size": 1,
                        "icon-allow-overlap": true,
                        "text-field": entityLabelsVisible ? "{name}" : "",
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 12,
                        "text-letter-spacing": 0,
                        "text-offset": [2, 0],
                        "icon-rotation-alignment": "map",
                        "text-anchor": "left",
                        "text-transform": "uppercase",
                        "text-optional": true
                    }}
                    paint={{
                        "text-color": "#000000",
                        "text-halo-color": "rgba(255, 255, 255, 1)",
                        "text-halo-width": 2
                    }}
                    before="---ac2-feed-entities-position-end"
                />
            )}
        </>

    )

};

export default CamerasLayer;