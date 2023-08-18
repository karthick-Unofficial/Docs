import React, { useCallback, useEffect, useState, memo } from "react";

// Mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

// Components
import CamerasMapLayers from "./CamerasMapLayers/CamerasMapLayers";
// Map Styles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";

import { ContextMenu } from "orion-components/Map/ContextMenu";
import ErrorBoundary from "orion-components/ErrorBoundary";

// Mapbox doesn't support relative urls for sprite paths, so we have to grab the correct hostname here and set manually
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import * as camerasMapActions from "./camerasMapActions";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

const MapWrapper = () => {
	const clientConfig = useSelector(state => state.clientConfig);
	const appState = useSelector(state => state.appState);
	const baseMaps = useSelector(state => state.baseMaps);
	const { mapSettings } = clientConfig;
	const settings = useSelector(state => !isEmpty(appState.persisted) && mapSettingsSelector(state));
	const zoom = !isEmpty(appState.persisted) ? settings.mapZoom : mapSettings.zoom;
	const center = !isEmpty(appState.persisted) ? settings.mapCenter : mapSettings.center;
	const style = !isEmpty(appState.persisted) ? settings.mapStyle : "satellite";
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const mapRef = useSelector(state => state.mapState.baseMap.mapRef);

	return (
		<MapBaseMapboxGL
			{...camerasMapActions}
			zoom={zoom}
			center={center}
			WavCamOpen={WavCamOpen}
			baseMaps={baseMaps}
			style={style}
			mapRef={mapRef}
		/>
	);
};

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
	const {
		setMapReference,
		zoom,
		center,
		WavCamOpen,
		baseMaps,
		style,
		setMapPosition,
		mapRef } = props;
	const dispatch = useDispatch();

	useEffect(() => {
		if (getRTLTextPluginStatus() === "unavailable") {
			setRTLTextPlugin(
				"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
				null,
				true
			);
		}
	}, []);
	const [mapState, setMapState] = useState(null);


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
		dispatch(setMapReference(map));
		// Set up future style loads to reinsert layers
		// map.on("style.load", () => {
		// 	// enableLayers();
		// });
		setMapState(map);
	};

	const setPosition = map => {
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		dispatch(setMapPosition(newCoords, map.getZoom()));
	};

	function getToken() {
		return "pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA";
	}

	return (
		<Map
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
					<CamerasMapLayers map={mapState} />
					<ContextMenu map={mapState} />
				</ErrorBoundary>
			)}
		</Map>
	);
}, (prevProps, nextProps) => {
	if (prevProps.mapRef && prevProps.WavCamOpen === nextProps.WavCamOpen) {
		if (!isEqual(prevProps.style, nextProps.style)) {
			return false;
		}
		return true;
	} else {
		return false;
	}
});

export default MapWrapper;