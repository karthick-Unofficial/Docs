import React, { memo, useState, useEffect } from "react";
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";
import VesselLayer from "./VesselLayer/VesselLayer";
import { VesselPolygons } from "orion-components/Map/Layers";
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useSelector } from "react-redux";


const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});


const BerthMap = () => {
	const setSpritePath = path => path.replace("location", location.hostname);

	const clientConfig = useSelector(state => state.clientConfig);
	const map = useSelector(state => state.map);
	const baseMaps = useSelector(state => state.baseMaps);

	const { mapSettings } = clientConfig;
	let satelliteMapStyle = {};

	if (baseMaps.length > 0) {
		satelliteMapStyle = baseMaps.find((element) => element.name === "satellite").style;
		satelliteMapStyle.sprite = "https://location/berth-schedule-app/static/icons/orion-sprites";
		satelliteMapStyle.sprite = setSpritePath(satelliteMapStyle.sprite);

	}

	const { vessels } = map;
	const [zoom, setZoom] = useState(mapSettings.zoom);
	const [bearing, setBearing] = useState(mapSettings.bearing);
	const [center, setCenter] = useState(mapSettings.center);

	useEffect(() => {
		if (getRTLTextPluginStatus() === "unavailable") {
			setRTLTextPlugin(
				"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
				null,
				true
			);
		}
	}, []);


	return (
		<Map
			style={satelliteMapStyle}
			center={center}
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			bearing={[bearing]}
			containerStyle={{
				width: "100%",
				height: 500
			}}
			movingMethod="easeTo"
			onZoomEnd={m => setZoom(m.getZoom())}
			onDragEnd={m => setCenter(m.getCenter())}
			onRotateEnd={m => setBearing(m.getBearing())}
		>
			<VesselPolygons vessels={vessels} />
			<VesselLayer />
			<ZoomControl />
		</Map>
	);
};



export default memo(BerthMap);
