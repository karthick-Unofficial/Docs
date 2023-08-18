import React, { useEffect, useMemo, useRef } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";

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

const NauticalChartsLayer = ({ map }) => {
	const { nauticalChartsEnabled } = useSelector((state) => state.clientConfig && state.clientConfig.mapSettings);
	let { nauticalChartsVisible } = useSelector((state) => mapSettingsSelector(state));

	//we are using a ref variable reference to get recent prop values in map functions.
	const nauticalChartsVisibleRef = useRef(nauticalChartsVisible);

	nauticalChartsVisible = !!nauticalChartsVisible;

	useEffect(() => {
		nauticalChartsVisibleRef.current = nauticalChartsVisible;
	}, [nauticalChartsVisible]);

	const showNauticalCharts = useMemo(
		() => nauticalChartsEnabled && nauticalChartsVisible,
		[nauticalChartsEnabled, nauticalChartsVisible]
	);

	const toggleNauticalVisibility = () => {
		if (!nauticalChartsEnabled) {
			//null
		} else {
			if (map.getZoom() < 7 && nauticalChartsVisibleRef.current) {
				map.setLayoutProperty("ac2-nautical", "visibility", "none");
			} else if (map.getZoom() >= 7 && nauticalChartsVisibleRef.current) {
				map.setLayoutProperty("ac2-nautical", "visibility", "visible");
			}
		}
	};

	useEffect(() => {
		// Hide nautical charts if zoomed out beyond useful level
		map.on("zoom", () => {
			toggleNauticalVisibility();
		});
		toggleNauticalVisibility();
	}, []);

	return (
		<>
			{showNauticalCharts && (
				<>
					<Source id="ac2-nauticalCharts" tileJsonSource={nauticalSource} />
					<Layer
						type="raster"
						id="ac2-nautical"
						sourceId="ac2-nauticalCharts"
						before="---ac2-nautical-charts-position-end"
					/>
				</>
			)}
		</>
	);
};

export default NauticalChartsLayer;
