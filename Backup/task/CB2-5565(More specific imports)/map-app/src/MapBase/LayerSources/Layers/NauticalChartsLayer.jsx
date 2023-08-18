import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";

const propTypes = {
	nauticalChartsVisible: PropTypes.bool,
	nauticalChartLayerOpacity: PropTypes.number
};

const NauticalChartsLayer = ({
	nauticalChartsVisible,
	nauticalChartLayerOpacity
}) => {
	const [nauticalSource, setNauticalSource] = useState(null);

	useEffect(() => {
		setNauticalSource({
			type: "raster",
			tiles: [
				window.location.protocol + 
                "//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
			],
			tileSize: 256
		});
	}, []);

	return (
		<Fragment>
			{
				nauticalChartsVisible && (
					<Fragment>
						<Source id="ac2-nauticalCharts" tileJsonSource={nauticalSource} />
						<Layer
							type="raster"
							id="ac2-nautical"
							sourceId="ac2-nauticalCharts"
							paint={{ "raster-opacity": nauticalChartLayerOpacity }}
							before="---ac2-nautical-charts-position-end"
						/>
					</Fragment>
				)
			}
		</Fragment>
	);
};

NauticalChartsLayer.propTypes = propTypes;

export default NauticalChartsLayer;