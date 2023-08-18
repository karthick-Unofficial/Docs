// react
import React, { useState, memo, Fragment, useEffect } from "react";

// mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

//components
import LayerSourcesContainer from "./LayerSources/LayerSourcesContainer";
import { default as ContextMenu } from "./ContextMenu/ContextMenuContainer";

// utility
import _ from "lodash";

// mapstyles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// metrics
import Metric from "browser-metrics/lib/Metric";
const metric = new Metric("INITIAL_LOAD");

// Mapbox doesn't support relative urls for sprite paths, so we have to grab the correct hostname here and set manually
const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);


aresTileServer.sprite = setSpritePath(aresTileServer.sprite);

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const MapBaseMapboxGL = ({ setMapReference, updatePersistedState, zoom, center, WavCam, style, baseMaps }) => {
	const [map, SetMap] = useState(null);

	useEffect(() => {
		metric.start();
	}, []);


	const mapStyle = () => {
		if (baseMaps.length > 0) {
			const baseMapSelection = baseMaps.filter((element) => element.name === style)[0];
			let spritePath = baseMapSelection.style;
			spritePath.sprite = setSpritePath(spritePath.sprite);
			return spritePath;
		}
	};

	const setMap = (map) => {
		setMapReference(map);
		SetMap(map);
	};

	const setPosition = map => {
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		updatePersistedState("map-app", "mapSettings", {
			mapCenter: newCoords,
			mapZoom: map.getZoom()
		});
	};


	return (
		<Map
			/* Comment out accessToken and style below to use internal tile server */
			style={mapStyle()}
			center={center}
			maxZoom={18}
			minZoom={2} // was at 2
			zoom={[zoom]}
			/* Uncomment this line to use local settings for tile server */
			/* style={simple} */
			containerStyle={{ width: "100%", height: `calc(100vh - ${WavCam ? "288px" : "48px"})` }}
			onStyleLoad={map => {
				metric.end();
				console.log(`\nMap Loaded in : ${metric.duration} ms.\n`);

				setMap(map);
			}}
			className="mapChild"
			movingMethod="easeTo"
			onMoveEnd={map => setPosition(map)}
		>
			<ZoomControl />
			<RotationControl />
			{map && (
				<Fragment>
					<LayerSourcesContainer map={map} />
					<ContextMenu map={map} />
				</Fragment>
			)}
		</Map>
	);

};

const getStyle = (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style || prevProps.WavCam !== nextProps.WavCam) {
		return false;
	} else {
		return true;
	}
};

export default memo(MapBaseMapboxGL, getStyle);