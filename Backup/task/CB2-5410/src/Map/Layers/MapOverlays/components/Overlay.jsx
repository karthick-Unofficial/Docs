import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-mapbox-gl";
import { overlayLayerSelector } from "orion-components/Map/Selectors";
import PropTypes from "prop-types";

const propTypes = {
	overlay: PropTypes.object
};

const defaultProps = {
	overlay: {}
};

let reloadInterval;
const Overlay = ({ overlay }) => {
	const { sources, layers, layerType, defaultOpacity, minZoom, maxZoom, refreshRate } = overlay;
	const overlayConfig = useSelector((state) =>
		overlayLayerSelector(state)(layerType, defaultOpacity, minZoom, maxZoom)
	);

	const { opacity, enabled } = overlayConfig || {};
	const [reloadWeather, setReloadWeather] = useState(false);

	const _startWeatherReload = (interval = 60) => {
		reloadInterval = setInterval(() => {
			setReloadWeather(true);
			setReloadWeather(false);
		}, interval * 1000);
	};

	useEffect(() => {
		// Start timer for reloading current radar overlay
		if (refreshRate) _startWeatherReload(refreshRate);

		return () => {
			clearInterval(reloadInterval);
		};
	}, []);

	const reload = layerType === "weatherRadar" ? !reloadWeather : true;

	return enabled && reload ? (
		<>
			{sources.map((source) => (
				<Source key={source.id} {...source} />
			))}
			{layers.map((layer) => (
				<Layer
					key={layer.id}
					{...layer}
					paint={{
						"raster-opacity": opacity
					}}
				/>
			))}
		</>
	) : (
		<></>
	);
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
