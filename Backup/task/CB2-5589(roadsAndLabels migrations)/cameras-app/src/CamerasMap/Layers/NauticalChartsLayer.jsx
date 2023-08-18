import React, { useMemo } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import {
	mapSettingsSelector,
	nauticalChartLayerOpacitySelector
} from "orion-components/AppState/Selectors";

// cSpell:disable
const nauticalSource = {
	type: "raster",
	tiles: [
		window.location.protocol +
			"//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
	],
	tileSize: 256
};
// cSpell:enable

const NauticalChartsLayer = () => {
	const { nauticalChartsEnabled } = useSelector(
		(state) => state.clientConfig && state.clientConfig.mapSettings
	);
	const nauticalChartLayerOpacity = useSelector((state) =>
		nauticalChartLayerOpacitySelector(state)
	);
	let { nauticalChartsVisible } = useSelector((state) =>
		mapSettingsSelector(state)
	);

	nauticalChartsVisible = !!nauticalChartsVisible;

	const showNauticalCharts = useMemo(
		() => nauticalChartsEnabled && nauticalChartsVisible,
		[nauticalChartsEnabled, nauticalChartsVisible]
	);

	return (
		<>
			{showNauticalCharts && (
				<>
					<Source
						id="ac2-nauticalCharts"
						tileJsonSource={nauticalSource}
					/>
					<Layer
						type="raster"
						id="ac2-nautical"
						sourceId="ac2-nauticalCharts"
						paint={{ "raster-opacity": nauticalChartLayerOpacity }}
						before="---ac2-nautical-charts-position-end"
					/>
				</>
			)}
		</>
	);
};

export default NauticalChartsLayer;
