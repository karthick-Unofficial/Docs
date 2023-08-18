import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";

const propTypes = {
	opacity: PropTypes.number,
	visible: PropTypes.bool,
	aerisKey: PropTypes.string.isRequired
};

const defaultProps = {
	opacity: 1,
	visible: false
};

const { protocol } = window.location;

const WeatherRadar = ({ opacity, visible, aerisKey }) => {
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

WeatherRadar.propTypes = propTypes;
WeatherRadar.defaultProps = defaultProps;

export default WeatherRadar;
