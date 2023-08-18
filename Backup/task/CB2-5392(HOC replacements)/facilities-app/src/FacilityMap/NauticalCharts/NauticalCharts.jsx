import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";

const { protocol } = window.location;

const source = {
	id: "nautical-charts-source",
	type: "raster",
	tiles: [
		window.location.protocol +
		"//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
	],
	tileSize: 256
};

const NauticalCharts = () => {

	const { mapSettings } = useSelector(state => state.appState.persisted);
	let opacity;
	let visible;
	if (mapSettings && mapSettings["nauticalCharts"]) {
		opacity = mapSettings["nauticalCharts"].opacity;
		visible = mapSettings["nauticalCharts"].visible;
	}
	else{
		opacity = 1;
		visible = false;
	}

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

export default NauticalCharts;
