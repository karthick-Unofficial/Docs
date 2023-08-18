import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";
import satellite from "./satellite.json";
import { default as VesselLayer } from "./VesselLayer/VesselLayerContainer";
import { VesselPolygons } from "orion-components/Map/Layers";

const propTypes = {
	mapSettings: PropTypes.object.isRequired,
	map: PropTypes.object.isRequired
};

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path => path.replace("location", location.hostname);
satellite.sprite = setSpritePath(satellite.sprite);

const BerthMap = ({ mapSettings, map }) => {
	const { vessels } = map;
	const [zoom, setZoom] = useState(mapSettings.zoom);
	const [bearing, setBearing] = useState(mapSettings.bearing);
	const [center, setCenter] = useState(mapSettings.center);
	return (
		<Map
			style={satellite}
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

BerthMap.propTypes = propTypes;

export default memo(BerthMap);
