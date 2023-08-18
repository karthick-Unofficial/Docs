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
		(window.api ? "https:" : protocol) +
			"//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
	]
};

const NauticalCharts = ({ opacity, visible }) => {
	return visible ? (
		<Fragment>
			<Source id="nautical-charts-source" tileJsonSource={source} />
			<Layer
				id="nautical-charts"
				sourceId="nautical-charts-source"
				type="raster"
				paint={{ "raster-opacity": opacity }}
			/>
		</Fragment>
	) : null;
};

NauticalCharts.propTypes = propTypes;
NauticalCharts.defaultProps = defaultProps;

export default NauticalCharts;
