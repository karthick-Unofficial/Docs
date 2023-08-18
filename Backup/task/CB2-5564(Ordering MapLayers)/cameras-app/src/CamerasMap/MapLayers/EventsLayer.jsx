import React, { useEffect, useState } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const EventsLayer = () => {
    let { entityLabelsVisible } = useSelector(state => mapSettingsSelector(state));
    const context = useSelector(state => selectedContextSelector(state));
    const contextLoaded = context && context.entity;

    const [eventsSource, setEventsSource] = useState(null);



    return (
        <>
            {contextLoaded && (
                <>
                    <Source
                        id="ac2-eventPointSource"
                        geoJsonSource={getGeoJSON("Event")}
                    />
                    <Layer
                        id="ac2-unclustered-events"
                        type="symbol"
                        sourceId="ac2-eventPointSource"
                        layout={{
                            "icon-image": "Incident_gray",
                            "icon-size": 1,
                            "text-field": entityLabelsVisible ? "{name}" : "",
                            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                            "text-size": 11,
                            "text-letter-spacing": 0,
                            "text-offset": [2, 0],
                            "text-ignore-placement": true,
                            "icon-allow-overlap": true,
                            "text-max-width": 7,
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
                </>
            )}
        </>

    )

};

export default EventsLayer;