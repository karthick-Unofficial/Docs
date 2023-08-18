const overlays = [
    {
        "sources": [{
            "id": "ac2-nauticalCharts",
            "tileJsonSource": {
                "type": "raster",
                "tiles": [
                    "https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
                ],
                "tileSize": 256
            }
        }],
        "layers": [{
            "id": "ac2-nautical",
            "type": "raster",
            "sourceId": "ac2-nauticalCharts",
            "before": "---ac2-nautical-charts-position-end"
        }],
        "layerType": "nauticalCharts",
        "minZoom": 3,
        "maxZoom": 5
    },
    {
        "sources": [{
            "id": "ac2-currentRadarTiles",
            "tileJsonSource": {
                "type": "raster",
                "tiles": [
                    "https://maps1.aerisapi.com/cq4vb4g7DW4d3H6pbWGSG_Hc2AQ3xUuCjOoqJMahZuCeZfbKtoJFLbqPkt4M8n/radar/{z}/{x}/{y}/current.png",
                    "https://maps2.aerisapi.com/cq4vb4g7DW4d3H6pbWGSG_Hc2AQ3xUuCjOoqJMahZuCeZfbKtoJFLbqPkt4M8n/radar/{z}/{x}/{y}/current.png",
                    "https://maps3.aerisapi.com/cq4vb4g7DW4d3H6pbWGSG_Hc2AQ3xUuCjOoqJMahZuCeZfbKtoJFLbqPkt4M8n/radar/{z}/{x}/{y}/current.png",
                    "https://maps4.aerisapi.com/cq4vb4g7DW4d3H6pbWGSG_Hc2AQ3xUuCjOoqJMahZuCeZfbKtoJFLbqPkt4M8n/radar/{z}/{x}/{y}/current.png"
                ]
            }
        }],
        "layers": [{
            "id": "ac2-current-radar",
            "type": "raster",
            "sourceId": "ac2-currentRadarTiles",
            "before": "---ac2-weather-position-end",
        }],
        "layerType": "weatherRadar"
    }
];

export default overlays;