import { Fragment } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";

const protocol = window.api ? "http:" : window.location.protocol;

const source = {
	id: "nautical-charts-source",
	type: "raster",
	tiles: [
		protocol +
		"//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
	],
	tileSize: 256
};

const NauticalCharts = () => {
	const mapSettings = useSelector(state => state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings["nauticalCharts"] : null);

	return mapSettings && mapSettings.visible ? (
		<Fragment>
			<Source id="nautical-charts-source" tileJsonSource={source} />
			<Layer
				id="nautical-charts"
				sourceId="nautical-charts-source"
				type="raster"
				paint={{ "raster-opacity": (mapSettings && !isUndefined(mapSettings.opacity)) ? mapSettings.opacity : 1 }}
				before="---ac2-nautical-charts-position-end"
			/>
		</Fragment>
	) : null;
};

export default NauticalCharts;
