import React, { useCallback, useRef, useState, memo } from "react";

// Mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

// Components
import CamerasMapLayersContainer from "./CamerasMapLayers/CamerasMapLayersContainer";
// Map Styles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";

import { ContextMenuContainer } from "orion-components/Map/ContextMenu";
import ErrorBoundary from "orion-components/ErrorBoundary";

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

const MapBaseMapboxGL = memo(props => {
	const { setMapReference, zoom, center, WavCamOpen, baseMaps, style, setMapPosition } = props;
	const [mapState, setMapState] = useState(null);

	const mapRef = useRef(null);

	const getStyle = useCallback(() => {
		if (baseMaps.length > 0) {
			const baseMapSelection = baseMaps.filter((element) => element.name === style)[0];
			const spritePath = baseMapSelection.style;
			spritePath.sprite = setSpritePath(spritePath.sprite);
			return spritePath;
		}

	}, [baseMaps, style]);

	const setMap = map => {
		// Only on first style load
		setMapReference(map);
		// Set up future style loads to reinsert layers
		// map.on("style.load", () => {
		// 	// enableLayers();
		// });
		setMapState(map);
	};

	const setPosition = map => {
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		setMapPosition(newCoords, map.getZoom());
	};

	function getToken() {
		return "pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA";
	}

	return (
		<Map
			ref={mapRef}
			/* Comment out accessToken and style below to use internal tile server */
			style={getStyle()}
			center={center}
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			/* Uncomment this line to use local settings for tile server */
			/* style={simple} */
			containerStyle={{ width: "100vw", height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
			onStyleLoad={map => setMap(map)}
			className="map-base"
			movingMethod="easeTo"
			onMoveEnd={map => setPosition(map)}
		>
			<ZoomControl />
			<RotationControl />
			{mapState && (
				<ErrorBoundary>
					<CamerasMapLayersContainer map={mapState} />
					<ContextMenuContainer map={mapState} />
				</ErrorBoundary>
			)}
		</Map>
	);
}, (prevProps, nextProps) => prevProps.WavCamOpen === nextProps.WavCamOpen);

export default MapBaseMapboxGL;