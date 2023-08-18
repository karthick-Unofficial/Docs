import React, { useEffect, useMemo, useRef } from "react";
import { Source, Layer } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapSettingsSelector, nauticalChartLayerOpacitySelector } from "orion-components/AppState/Selectors";
import PropTypes from "prop-types";

const propTypes = {
    map: PropTypes.object
};

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

const NauticalChartsLayer = ({ map, defaultOpacity }) => {
    const { nauticalChartsEnabled } = useSelector((state) => state.clientConfig && state.clientConfig.mapSettings);
    const mapSettings = useSelector((state) => mapSettingsSelector(state));
    const nauticalChartLayerOpacity = useSelector((state) => nauticalChartLayerOpacitySelector(state));

    const opacity = defaultOpacity ? 1
        : nauticalChartLayerOpacity ? nauticalChartLayerOpacity
            : mapSettings && mapSettings["nauticalCharts"] ? mapSettings["nauticalCharts"].opacity
                : 1;

    const visible = mapSettings && mapSettings.nauticalChartsVisible ? mapSettings.nauticalChartsVisible
        : mapSettings && mapSettings["nauticalCharts"] ? mapSettings["nauticalCharts"].visible
            : false;

    //we are using a ref variable reference to get recent prop values in map functions.
    const nauticalChartsVisibleRef = useRef(visible);

    useEffect(() => {
        nauticalChartsVisibleRef.current = visible;
    }, [visible]);

    const showNauticalCharts = useMemo(() => nauticalChartsEnabled && visible, [nauticalChartsEnabled, visible]);

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
        if (map) {
            map.on("zoom", () => {
                toggleNauticalVisibility();
            });
            toggleNauticalVisibility();
        }
    }, []);

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
                        paint={{ "raster-opacity": opacity }}
                        before="---ac2-nautical-charts-position-end"
                    />
                </>
            )}
        </>
    );
};


NauticalChartsLayer.propTypes = propTypes;
// NauticalChartsLayer.defaultProps = defaultProps;

export default NauticalChartsLayer;