// react
import React, { useState, memo, Fragment, useEffect } from "react";

// mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

//components
import LayerSources from "./LayerSources/LayerSources";
import { default as ContextMenu } from "./ContextMenu/AppContextMenu";

// utility
import isEmpty from "lodash/isEmpty";

// mapstyles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// metrics
import Metric from "browser-metrics/lib/Metric";
const metric = new Metric("INITIAL_LOAD");
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "./mapBaseActions.js";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";

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

const MapWrapper = () => {
	const clientConfig = useSelector(state => state.clientConfig);
	const appState = useSelector(state => state.appState);
	const baseMaps = useSelector(state => state.baseMaps);
	const { mapSettings } = clientConfig;
	const settings = useSelector(state => mapSettingsSelector(state));
	const zoom = !isEmpty(appState.persisted) ? settings.mapZoom : mapSettings.zoom;
	const center = !isEmpty(appState.persisted) ? settings.mapCenter : mapSettings.center;
	const style = !isEmpty(appState.persisted) ? settings.mapStyle : "satellite";
	const WavCam = useSelector(state => state.appState.dock.dockData.WavCam);

	return (
		<MapBaseMapboxGL
			{...actionCreators}
			zoom={zoom}
			center={center}
			WavCam={WavCam}
			style={style}
			baseMaps={baseMaps}
		/>
	);
};

const MapBaseMapboxGL = memo(({ setMapReference, updatePersistedState, zoom, center, WavCam, style, baseMaps }) => {
	const dispatch = useDispatch();
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

	useEffect(() => {
		if (getRTLTextPluginStatus() === "unavailable") {
			setRTLTextPlugin(
				"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
				null,
				true
			);
		}
	}, []);

	const setMap = (map) => {
		dispatch(setMapReference(map));
		SetMap(map);
	};

	const setPosition = map => {
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		dispatch(updatePersistedState("map-app", "mapSettings", {
			mapCenter: newCoords,
			mapZoom: map.getZoom()
		}));
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
					<LayerSources map={map} />
					<ContextMenu map={map} />
				</Fragment>
			)}
		</Map>
	);

}, (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style || prevProps.WavCam !== nextProps.WavCam) {
		return false;
	} else {
		return true;
	}
});

export default MapWrapper;