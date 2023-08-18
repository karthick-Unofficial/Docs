import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
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
	const dispatch = useDispatch();
	const [ssrLayers, setSsrLayers] = useState([]);
	const [mapMoveSet, setMapMoveSet] = useState(false);
	const ssrLayerRefreshInterval = useRef(null);
	const moveTimeout = useRef(null);
	const mapMoveHandler = useRef(null);

	useEffect(() => {
		// - on initial load, start tiles via updateSsrRadarTiles
		dispatch(updateSsrRadarTiles(true));

		return () => {
			dispatch(updateSsrRadarTiles(false));
		};
	}, [updateSsrRadarTiles]);

	useEffect(() => {
		// - when the map moves, we need to debounce, then update the tiles via setupNewTiles
		mapMoveHandler.current = () => {
			// -- essentially a map move debounce timer for updating SSR radar tiles
			if (moveTimeout.current) {
				clearTimeout(moveTimeout.current);
			}
			moveTimeout.current = setTimeout(setupNewTiles, 1000);
		};

		if (!mapMoveSet) {
			map.on("move", mapMoveHandler.current);
		} else {
			setMapMoveSet(true);
		}

		return () => {
			map.off("move", mapMoveHandler.current);
		};
	}, [map, mapMoveSet]);

	useEffect(() => {
		// If the tiles change, handleSsrLayers
		if (!isEmpty(ssrRadarTiles)) {
			handleSsrLayers();
		}
	}, [ssrRadarTiles]);

	useEffect(() => {
		return () => {
			// Clean up the refresh interval when dismounting
			clearInterval(ssrLayerRefreshInterval.current);
			ssrLayerRefreshInterval.current = null;
		};
	}, []);

	useEffect(() => {
		// Opacity changed
		// Get all SSR radar layers
		const radarLayers = map.getStyle().layers.filter((layer) => {
			return layer["id"] && layer["id"].includes("ac2-ssr-radar-");
		});

		// Update opacity for all SSR radar layers
		radarLayers.forEach((layer) => {
			map.setPaintProperty(layer.id, "raster-opacity", ssrRadarLayerOpacity);
		});
	}, [ssrRadarLayerOpacity]);

	const setupNewTiles = () => {
		// stop refreshing SSR radar tile images
		if (ssrLayerRefreshInterval.current) {
			clearInterval(ssrLayerRefreshInterval.current);
			ssrLayerRefreshInterval.current = null;
		}

		dispatch(updateSsrRadarTiles(true));
	};

	const handleSsrLayers = () => {
		// -- stop interval while initializing/updating layers
		if (ssrLayerRefreshInterval.current) {
			clearInterval(ssrLayerRefreshInterval.current);
			ssrLayerRefreshInterval.current = null;
		}

		const newSsrLayers = Object.keys(ssrRadarTiles).map((tileId) => {
			const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
			const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;
			const source = {
				type: "image",
				url: proxyUrl,
				coordinates: [
					[lowerLeft.longitude, upperRight.latitude], // top left
					[upperRight.longitude, upperRight.latitude], // top right
					[upperRight.longitude, lowerLeft.latitude], // bottom right
					[lowerLeft.longitude, lowerLeft.latitude] // bottom left
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
		ssrLayerRefreshInterval.current = setInterval(updateTileImages, ssrRadarTileUpdateInterval || 5000);

		setSsrLayers(newSsrLayers);
	};

	const updateTileImages = () => {
		Object.keys(ssrRadarTiles).forEach((tileId) => {
			const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
			const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;

			// -- update tile source image by re-calling the image URL (SSR updates the image every 0.5 seconds)
			const tileSource = map.getSource(`ssr-radar-${tileId}`);
			tileSource.updateImage({
				url: proxyUrl,
				coordinates: [
					[lowerLeft.longitude, upperRight.latitude], // top left
					[upperRight.longitude, upperRight.latitude], // top right
					[upperRight.longitude, lowerLeft.latitude], // bottom right
					[lowerLeft.longitude, lowerLeft.latitude] // bottom left
				]
			});
		});
	};

	return <Fragment>{ssrLayers}</Fragment>;
};

SSRRadarLayers.propTypes = propTypes;

export default SSRRadarLayers;
