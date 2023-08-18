import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Source, Layer } from "react-mapbox-gl";

const propTypes = {
	updateSsrRadarTiles: PropTypes.func,
	ssrRadarTiles: PropTypes.object,
	ssrRadarLayerOpacity: PropTypes.number,
	ssrRadarTileUpdateInterval: PropTypes.number,
	map: PropTypes.object
};

const SSRRadarLayers = ({
	updateSsrRadarTiles,
	ssrRadarTiles,
	ssrRadarLayerOpacity,
	ssrRadarTileUpdateInterval,
	map
}) => {
	const [ssrLayerRefreshInterval, setSsrLayerRefreshInterval] = useState(null);
	const [ssrLayers, setSsrLayers] = useState([]);
	const [mapMoveSet, setMapMoveSet] = useState(false);

	useEffect(() => {
		// - on initial load, start tiles via updateSsrRadarTiles
		updateSsrRadarTiles(true, map);

		return () => {
			updateSsrRadarTiles(false, map);
		};
	}, [map, updateSsrRadarTiles]);

	useEffect(() => {
		// - when the map moves, we need to debounce, then update the tiles via updateTiles
		let moveTimeout = null;
		const mapMoveHandler = e => {
			// -- essentially a map move debounce timer for updating SSR radar tiles
			if (moveTimeout) {
				clearTimeout(moveTimeout);
			}
			moveTimeout = setTimeout(updateTiles, 1000);
		};

		if (mapMoveSet) {
			map.off("move", mapMoveHandler);
		}
		else {
			setMapMoveSet(true);
		}

		map.on("move", mapMoveHandler);

		return () => {
			map.off("move", mapMoveHandler);
		};
	}, [map, mapMoveSet]);

	useEffect(() => {
		// - if enabled, visible, or the tiles change, handleSsrLayers
		if (!_.isEmpty(ssrRadarTiles)) {
			handleSsrLayers();
		}

		return () => {
			clearInterval(ssrLayerRefreshInterval);
		};
	}, [ssrRadarTiles]);

	useEffect(() => {
		// -- Set SSR radar layer opacity
		setSsrRadarOpacity(ssrRadarLayerOpacity);
	}, [map, ssrRadarLayerOpacity]);

	const updateTiles = () => {
		// -- stop refreshing SSR radar tile images
		if (ssrLayerRefreshInterval) {
			clearInterval(ssrLayerRefreshInterval);
		}

		updateSsrRadarTiles(true, map);

		setSsrLayerRefreshInterval(null);
	};

	const setSsrRadarOpacity = opacity => {
		// -- Get all SSR radar layers
		const radarLayers = map.getStyle().layers.filter(layer => {
			return layer["id"] && layer["id"].includes("ac2-ssr-radar-");
		});

		// -- Update opacity for all SSR radar layers
		radarLayers.forEach(layer => {
			map.setPaintProperty(layer.id, "raster-opacity", opacity);
		});
	};

	const handleSsrLayers = () => {
		// -- stop interval while initializaing/updating layers
		if (ssrLayerRefreshInterval) {
			clearInterval(ssrLayerRefreshInterval);
		}

		const newSsrLayers = Object.keys(ssrRadarTiles).map(tileId => {
			const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
			const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;
			const source = {
				type: "image",
				url: proxyUrl,
				coordinates: [
					[lowerLeft.longitude, upperRight.latitude],		// top left
					[upperRight.longitude, upperRight.latitude],	// top right
					[upperRight.longitude, lowerLeft.latitude],		// bottom right
					[lowerLeft.longitude, lowerLeft.latitude]		// bottom left
				]
			};

			return (
				<Fragment key={tileId}>
					<Source id={`ssr-radar-${tileId}`} tileJsonSource={source} />
					<Layer
						type="raster"
						id={`ac2-ssr-radar-${tileId}`}
						sourceId={`ssr-radar-${tileId}`}
						paint={{ "raster-opacity": ssrRadarLayerOpacity }}
					/>
				</Fragment>
			);
		});

		// -- start interval to update tile source
		const newSsrLayerRefreshInterval = setInterval(updateTileImages, ssrRadarTileUpdateInterval || 5000);

		setSsrLayers(newSsrLayers);
		setSsrLayerRefreshInterval(newSsrLayerRefreshInterval);
	};

	const updateTileImages = () => {
		Object.keys(ssrRadarTiles).forEach(tileId => {
			const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
			const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;

			// -- update tile source image by re-calling the image URL (SSR updates the image every 0.5 seconds)
			const tileSource = map.getSource(`ssr-radar-${tileId}`);
			tileSource.updateImage({
				url: proxyUrl,
				coordinates: [
					[lowerLeft.longitude, upperRight.latitude],		// top left
					[upperRight.longitude, upperRight.latitude],	// top right
					[upperRight.longitude, lowerLeft.latitude],		// bottom right
					[lowerLeft.longitude, lowerLeft.latitude]		// bottom left
				]
			});
		});
	};

	return (
		<Fragment>
			{
				ssrLayers
			}
		</Fragment>
	);
};

SSRRadarLayers.propTypes = propTypes;

export default SSRRadarLayers;