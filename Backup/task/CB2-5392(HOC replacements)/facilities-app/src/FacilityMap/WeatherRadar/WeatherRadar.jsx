import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";


const { protocol } = window.location;

const WeatherRadar = () => {

	const { appState } = useSelector(state => state);
	const {clientConfig} = useSelector(state => state);
	const { mapSettings } = appState.persisted;
	const { AERIS_API_KEY } = clientConfig.mapSettings;
	const aerisKey = AERIS_API_KEY;
	let opacity;
	let visible
	if (mapSettings && mapSettings["weather"]) {
		opacity = mapSettings["weather"].opacity;
		visible = mapSettings["weather"].visible;
	}

	const source = {
		id: "weather-radar-source",
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
	return visible ? (
		<Fragment>
			<Source id="weather-radar-source" tileJsonSource={source} />
			<Layer
				type="raster"
				id="ac2-weather-radar"
				sourceId="weather-radar-source"
				paint={{ "raster-opacity": opacity }}
				before="---ac2-weather-position-end"
			/>
		</Fragment>
	) : null;
};


export default WeatherRadar;
