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
                "//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
            ]
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