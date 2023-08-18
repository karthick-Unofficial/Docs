import React from "react";
import { Fragment } from "react";
import { Layer } from "react-mapbox-gl";

const OrderingLayers = () => {
	return (
		<Fragment>
			{/* Layers for enforcing layer ordering */}
			<Layer id="---ac2-alerts-position-end" type="symbol" />
			<Layer
				id="---ac2-clusters-position-end"
				before="---ac2-alerts-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-feed-entities-position-end"
				before="---ac2-clusters-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-distance-tool-position-end"
				before="---ac2-feed-entities-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-gis-points-position-end"
				before="---ac2-distance-tool-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-track-history-position-end"
				before="---ac2-gis-points-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-linestrings-position-end"
				before="---ac2-track-history-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-gis-linestrings-position-end"
				before="---ac2-linestrings-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-gis-multilinestrings-position-end"
				before="---ac2-gis-linestrings-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-weather-position-end"
				before="---ac2-gis-multilinestrings-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-floorplans-position-end"
				before="---ac2-weather-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-facilities-position-end"
				before="---ac2-floorplans-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-event-proximities-position-end"
				before="---ac2-facilities-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-polygons-position-end"
				before="---ac2-event-proximities-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-gis-polygons-position-end"
				before="---ac2-polygons-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-multipolygons-position-end"
				before="---ac2-gis-polygons-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-gis-multipolygons-position-end"
				before="---ac2-multipolygons-position-end"
				type="symbol"
			/>
			<Layer
				id="---ac2-nautical-charts-position-end"
				before="---ac2-gis-multipolygons-position-end"
				type="symbol"
			/>
		</Fragment>
	);
};

export default OrderingLayers;
