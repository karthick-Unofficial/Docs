import React, { useEffect, useState } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector, weatherRadarLayerOpacitySelector } from "orion-components/AppState/Selectors";

import { trackHistorySelector } from "orion-components/ContextualData/Selectors";


// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const WeatherLayer = () => {
    const { weatherEnabled, AERIS_API_KEY: aerisKey } = useSelector(state => state.clientConfig && state.clientConfig.mapSettings);
    const weatherRadarLayerOpacity = useSelector(state => weatherRadarLayerOpacitySelector(state));
    let { weatherVisible } = useSelector(state => mapSettingsSelector(state));

    const [reloadWeather, setReloadWeather] = useState(false);

    weatherVisible = !!weatherVisible;

    const _startWeatherReload = (interval = 60) => {
        setInterval(() => {
            setReloadWeather(true);
            setReloadWeather(false);
        }, interval * 1000);
    };

    useEffect(() => {
        // Start timer for reloading current radar overlay
        _startWeatherReload(300);
    }, []);

    const weatherSource = {
        type: "raster",
        tiles: [
            protocol +
            `//maps1.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
            protocol +
            `//maps2.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
            protocol +
            `//maps3.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
            protocol +
            `//maps4.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`
        ]
    };

    return (
        <>
            {!weatherEnabled ? null : weatherVisible && (
                <Source id="currentRadarTiles" tileJsonSource={weatherSource} />
            )}
            {!weatherEnabled ? null : !reloadWeather && weatherVisible && (
                <Layer
                    type="raster"
                    id="current-radar"
                    sourceId="currentRadarTiles"
                    paint={{ "raster-opacity": weatherRadarLayerOpacity }}
                    before="---ac2-weather-position-end"
                />
            )}

        </>
    )

};

export default WeatherLayer;