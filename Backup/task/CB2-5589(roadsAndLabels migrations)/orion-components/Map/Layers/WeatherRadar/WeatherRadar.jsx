import React, { useEffect, useState } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector, weatherRadarLayerOpacitySelector } from "orion-components/AppState/Selectors";
import PropTypes from "prop-types";

const propTypes = {
	weatherReload: PropTypes.boolean,
	defaultOpacity: PropTypes.boolean
};

const defaultProps = {
	weatherReload: true,
	defaultOpacity: false
};

const WeatherRadar = ({ weatherReload, defaultOpacity }) => {
	const { weatherEnabled, AERIS_API_KEY: aerisKey } = useSelector((state) => state.clientConfig && state.clientConfig.mapSettings);
	const weatherRadarLayerOpacity = useSelector((state) => weatherRadarLayerOpacitySelector(state));
	const mapSettings = useSelector((state) => mapSettingsSelector(state));

	const [wxSource, setWxSource] = useState(null);
	const [reloadWeather, setReloadWeather] = useState(false);

	const opacity = defaultOpacity ? 1 : weatherRadarLayerOpacity ? weatherRadarLayerOpacity
		: mapSettings && mapSettings["weather"] ? mapSettings["weather"].opacity
			: 1;

	const visible = mapSettings && mapSettings.weatherVisible ? mapSettings.weatherVisible
		: mapSettings && mapSettings["weather"] ? mapSettings["weather"].visible
			: false;

	const _startWeatherReload = (interval = 60) => {
		setInterval(() => {
			setReloadWeather(true);
			setReloadWeather(false);
		}, interval * 1000);
	};

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


	useEffect(() => {
		// Start timer for reloading current radar overlay
		if (weatherReload)
			_startWeatherReload(300);

		return () => {
			clearInterval(reloadInterval);
		};
	}, []);

	return (
		<>
			{weatherEnabled && !reloadWeather && visible && wxSource &&
				<>
					<Source
						id="ac2-currentRadarTiles"
						tileJsonSource={wxSource}
					/>
					<Layer
						type="raster"
						id="ac2-current-radar"
						sourceId="ac2-currentRadarTiles"
						paint={{
							"raster-opacity": opacity
						}}
						before="---ac2-weather-position-end"
					/>
				</>
			}
		</>
	);
};

WeatherRadar.propTypes = propTypes;
WeatherRadar.defaultProps = defaultProps;


export default WeatherRadar;
