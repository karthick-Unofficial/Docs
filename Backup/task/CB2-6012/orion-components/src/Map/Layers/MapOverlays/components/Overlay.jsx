import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-mapbox-gl";
import { overlayLayerSelector } from "orion-components/Map/Selectors";
import PropTypes from "prop-types";
import { mapObject, replayMapObject } from "orion-components/AppState/Selectors";

const propTypes = {
	overlay: PropTypes.object
};

const defaultProps = {
	overlay: {}
};

let reloadInterval;
const Overlay = ({ overlay }) => {
	const { sources, layers, layerType, allowOpacity, minZoom, maxZoom, refreshRate } = overlay;
	const overlayConfig = useSelector((state) =>
		overlayLayerSelector(state)(layerType, allowOpacity, minZoom, maxZoom)
	);
	const map = useSelector((state) => mapObject(state) || replayMapObject(state));

	const { opacity, enabled } = overlayConfig || {};
	const [reloadLayer, setReloadLayer] = useState(false);

	const getBefore = (layer) => {
		const before = map.getStyle().layers.find((obj) => obj["source"] === layer.before);
		return before && before.id !== undefined ? before.id : "";
	};

	const _startLayerReload = (interval = 60) => {
		reloadInterval = setInterval(() => {
			setReloadLayer(true);
			setReloadLayer(false);
		}, interval * 1000);
	};

	useEffect(() => {
		// Start timer for reloading current radar overlay
		if (refreshRate) _startLayerReload(refreshRate);

		return () => {
			clearInterval(reloadInterval);
		};
	}, []);

	const layerProps = allowOpacity ? { paint: { "raster-opacity": opacity } } : {};

	return enabled && !reloadLayer ? (
		<>
			{sources.map((source) => (
				<Source key={source.id} {...source} />
			))}
			{layers.map((layer) => {
				return (
					<Layer
						key={layer.id}
						{...layer}
						{...layerProps}
						before={getBefore(layer)}
					/>
				);
			})}
		</>
	) : (
		<></>
	);
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
