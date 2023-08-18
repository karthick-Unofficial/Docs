import React, { useState, memo, useEffect, useRef, useCallback } from "react";

// Mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

// Components
import EventsMapLayers from "./EventsMapLayers/EventsMapLayers";

// Map Styles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";
import ActiveFloorPlans from "./ActiveFloorPlans/ActiveFloorPlans";
import { ContextMenu } from "orion-components/Map/ContextMenu";
import ErrorBoundary from "orion-components/ErrorBoundary";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import * as facilitiesActions from "./Facilities/facilitiesActions";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import {
	setMapReference,
	setMapPosition
} from "./eventsMapActions.js";

// Mapbox doesn't support relative urls for sprite paths, so we have to grab the correct hostname here and set manually
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty"

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

function EventsMapWrapper() {
	const clientConfig = useSelector(state => state.clientConfig);
	const appState = useSelector(state => state.appState);
	const baseMaps = useSelector(state => state.baseMaps);
	const mapSettings = clientConfig.mapSettings;
	const mapZoom = mapSettings.zoom;
	const mapCenter = mapSettings.center;
	const settings = useSelector(state => !isEmpty(appState.persisted) ? mapSettingsSelector(state) : null);
	const zoom = !isEmpty(appState.persisted) ? settings.mapZoom : mapZoom;
	const center = !isEmpty(appState.persisted) ? settings.mapCenter : mapCenter;
	const style = !isEmpty(appState.persisted) ? settings.mapStyle : "satellite";
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	return <MapBaseMapboxGL
		baseMaps={baseMaps}
		style={style}
		zoom={zoom}
		center={center}
		WavCamOpen={WavCamOpen}
	/>;
}

const MapBaseMapboxGL = memo((props) => {

	const dispatch = useDispatch();
	const { baseMaps, style, zoom, center, WavCamOpen } = props;

	useEffect(() => {
		if (getRTLTextPluginStatus() === "unavailable") {
			setRTLTextPlugin(
				"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
				null,
				true
			);
		}
	}, []);

	const [map, setMap] = useState(null);
	//const mapRef = useRef(null);


	const getStyle = useCallback(() => {
		if (baseMaps.length > 0) {
			const baseMapSelection = baseMaps.filter((element) => element.name === style)[0];
			const spritePath = baseMapSelection.style;
			spritePath.sprite = setSpritePath(spritePath.sprite);
			return spritePath;
		}

	}, [baseMaps, style]);

	const setUpMap = mapData => {

		// Only on first style load
		// New mapRef below
		dispatch(setMapReference(mapData));
		// Set up future style loads to reinsert layers
		// map.on("style.load", () => {
		// 	// this.props.enableLayers();
		// });
		setMap(mapData);


	};

	const setPosition = mapData => {
		// convert center object to array		
		const newCoords = Object.values(mapData.getCenter());
		dispatch(setMapPosition(newCoords, mapData.getZoom()));

	};

	function getToken() {
		return "pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA";
	}

	return (
		<Map
			//ref={mapRef}
			/* Comment out accessToken and style below to use internal tile server */
			style={getStyle()}
			center={center}
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			/* Uncomment this line to use local settings for tile server */
			/* style={simple} */
			containerStyle={{ width: "100vw", height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
			onStyleLoad={mapData => setUpMap(mapData)}
			className="map-base"
			movingMethod="easeTo"
			onMoveEnd={mapData => setPosition(mapData)}
		>
			<ZoomControl />
			<RotationControl />
			{map && (
				<ErrorBoundary>
					<EventsMapLayers map={map} />
					<FacilitiesLayer {...facilitiesActions} secondary={true} />
					<ActiveFloorPlans />
					<ContextMenu map={map} />
				</ErrorBoundary>
			)}
		</Map>
	);
}, (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style) {
		return false;
	}
	if (prevProps.baseMaps !== nextProps.baseMaps) {
		return false;
	}
	return true;
});

export default EventsMapWrapper;
