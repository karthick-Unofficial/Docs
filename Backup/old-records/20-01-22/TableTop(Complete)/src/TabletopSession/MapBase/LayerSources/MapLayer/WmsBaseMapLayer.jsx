import { useEffect } from "react";
import PropTypes from "prop-types";

const propTypes = {
	wmsBaseMapPath: PropTypes.string,
	map: PropTypes.object.isRequired,
	layerAbove: PropTypes.string.isRequired
};

const WmsBaseMapLayer = ({ map, wmsBaseMapPath, layerAbove }) => {
	useEffect(() => {
		if (!wmsBaseMapPath) {
			return;
		}

		const addWmsBaseMap = () => {
			map.addSource("wms-basemap-source", 
				{
					"type": "raster",
					"tiles": [
						wmsBaseMapPath
					],
					"tileSize": 256
				});
			map.addLayer(
				{
					"id": "wms-basemap-layer",
					"type": "raster",
					"source": "wms-basemap-source",
					"paint": {}
				}, layerAbove
			);
		};
		if (map && !map.getSource("wms-basemap-source")) {
			addWmsBaseMap();
		}
	}, [ wmsBaseMapPath, map, layerAbove]);

	return null;
};

WmsBaseMapLayer.propTypes = propTypes;

export default WmsBaseMapLayer;