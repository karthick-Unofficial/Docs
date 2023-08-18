import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";

const propTypes = {
    weatherVisible: PropTypes.bool,
    weatherRadarLayerOpacity: PropTypes.number,
    aerisKey: PropTypes.string
};

const WeatherLayer = ({
    weatherVisible,
    weatherRadarLayerOpacity,
	aerisKey
}) => {
	const [reloadWeather, setReloadWeather] = useState(false);
	const [wxSource, setWxSource] = useState(null);
    const [reloadInterval, setReloadInterval] = useState(null);

    useEffect(() => {
        _startWeatherReload(300);

        return () => {
            clearInterval(reloadInterval);
        };
    }, []);
    
    useEffect(() => {
		setWxSource({
			type: "raster",
			tiles: [
				window.location.protocol +
				`//maps1.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				window.location.protocol +
				`//maps2.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				window.location.protocol +
				`//maps3.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				window.location.protocol +
				`//maps4.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`
			]
		});
	}, [aerisKey]);

	const _startWeatherReload = (interval = 60) => {
		setReloadInterval(
            setInterval(() => {
                setReloadWeather(true);
                setReloadWeather(false);
            }, interval * 1000)
        );
	};

    return (
        <Fragment>
            {
                weatherVisible && !reloadWeather && wxSource && (
                    <Fragment>
                        <Source id="ac2-currentRadarTiles" tileJsonSource={wxSource} />
                        <Layer
                            type="raster"
                            id="ac2-current-radar"
                            sourceId="ac2-currentRadarTiles"
                            paint={{ "raster-opacity": weatherRadarLayerOpacity }}
                            before="---ac2-weather-position-end"
                        />
                    </Fragment>
                )
            }
        </Fragment>
    );
};

WeatherLayer.propTypes = propTypes;

export default WeatherLayer;