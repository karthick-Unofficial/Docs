/* eslint react/prop-types: 0 */
// react
import React, { Fragment, memo, useCallback, useEffect } from "react";
// mapbox
import ReactMapboxGl from "react-mapbox-gl";

//components
import LayerSources from "./LayerSources/LayerSources";

// mapstyles
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import * as actionCreators from "./liveMapActions.js";

// utility
import isEmpty from "lodash/isEmpty";
import OrderingLayers from "orion-components/OrderingLayers/OrderingLayers"

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);

/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */
function LiveMapWrapper({ creatingReplay, updateMapCoordinates }) {
	const mapSettings = useSelector(state => state.clientConfig.mapSettings);
	const Zoom = mapSettings.zoom;
	const Center = mapSettings.center;
	const mapRef = useSelector(state => state.mapState.baseMap.mapRef);
	const baseMaps = useSelector(state => state.baseMaps);
	const persisted = useSelector(state => state.appState.persisted);
	const settings = useSelector(state => persisted ? mapSettingsSelector(state) : undefined);
	const zoom = !isEmpty(persisted) ? settings.mapZoom : Zoom;
	const center = !isEmpty(persisted) ? settings.mapCenter : Center;
	const maxZoom = mapSettings.maxZoom || 18;
	const minZoom = mapSettings.minZoom || 2;
	const style = !isEmpty(persisted) ? settings.mapStyle : "satellite";

	return <ReplayMap
		style={style}
		zoom={zoom}
		center={center}
		minZoom={minZoom}
		maxZoom={maxZoom}
		map={mapRef}
		baseMaps={baseMaps}
		creatingReplay={creatingReplay}
		updateMapCoordinates={updateMapCoordinates}
	/>;
}

const ReplayMap = memo(({
	style,
	zoom,
	center,
	minZoom,
	maxZoom,
	map,
	creatingReplay,
	updateMapCoordinates,
	baseMaps
}) => {
	const dispatch = useDispatch();

	const {
		setMapReference,
		toggleMapVisible,
		setMapState
	} = actionCreators;

	useEffect(() => {
		if (map && map.dragRotate) {
			map.dragRotate.disable();
		}
	}, [map]);

	useEffect(() => {
		if (getRTLTextPluginStatus() === "unavailable") {
			setRTLTextPlugin(
				"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
				null,
				true
			);
		}
	}, []);

	const getStyle = useCallback(() => {
		if (baseMaps.length > 0) {
			const baseMapSelection = baseMaps.filter((element) => element.name === style)[0];
			const spritePath = baseMapSelection.style;
			spritePath.sprite = setSpritePath(spritePath.sprite);
			return spritePath;
		}
	}, [baseMaps, style]);

	const handleSetReference = map => {
		dispatch(setMapReference(map));
		dispatch(toggleMapVisible());
	};

	const setMinMaxZoom = (map) => {
		map.transform.minZoom = minZoom;
		map.transform.maxZoom = maxZoom;
	};

	const handleMove = useCallback(
		map => {
			const mapCenter = Object.values(map.getCenter());
			const mapZoom = map.getZoom();
			dispatch(setMapState({ mapCenter, mapZoom }));
			if (creatingReplay) {
				const mapBounds = map.getBounds();
				const northWest = mapBounds.getNorthWest();
				const southEast = mapBounds.getSouthEast();
				const coordinates = [
					[northWest.lng, northWest.lat],
					[southEast.lng, southEast.lat]
				];
				updateMapCoordinates(coordinates);
			}
		},
		[setMapState, creatingReplay, updateMapCoordinates]
	);

	return (
		<Map
			style={getStyle()}
			center={center}
			zoom={[zoom]}
			containerStyle={{
				width: "100%",
				height: "100%"
			}}
			movingMethod="flyTo"
			onMoveEnd={m => handleMove(m)}
			onStyleLoad={map => {
				handleSetReference(map);
				setMinMaxZoom(map);
			}}
		>
			<OrderingLayers />
			{map &&
				<Fragment>
					<LayerSources creatingReplay={creatingReplay} map={map} />
				</Fragment>
			}
		</Map>
	);
}, (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style) {
		return false;
	}
	if (prevProps.map !== nextProps.map) {
		return false;
	}
	if (prevProps.baseMaps !== nextProps.baseMaps) {
		return false;
	}
	return true;
});

ReplayMap.displayName = "LiveMap";

export default LiveMapWrapper;