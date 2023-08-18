import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";

const propTypes = {
	opacity: PropTypes.number,
	visible: PropTypes.bool
};

const defaultProps = {
	opacity: 1,
	visible: false
};

const { protocol } = window.location;

const source = {
	id: "nautical-charts-source",
	type: "raster",
	tiles: [
		protocol +
			"//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
	]
};

const NauticalCharts = ({ opacity, visible }) => {
	return visible ? (
		<Fragment>
			<Source id="nautical-charts-source" tileJsonSource={source} />
			<Layer
				type="raster"
				id="ac2-nautical"
				sourceId="nautical-charts-source"
				paint={{ "raster-opacity": opacity }}
				before="---ac2-nautical-charts-position-end"
			/>
		</Fragment>
	) : null;
};

NauticalCharts.propTypes = propTypes;
NauticalCharts.defaultProps = defaultProps;

export default NauticalCharts;
