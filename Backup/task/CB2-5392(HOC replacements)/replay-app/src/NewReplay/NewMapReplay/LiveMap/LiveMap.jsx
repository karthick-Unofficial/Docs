/* eslint react/prop-types: 0 */
// react
import React, { Fragment, memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
// mapbox
import ReactMapboxGl from "react-mapbox-gl";

//components
import LayerSources from "./LayerSources/LayerSources";

// mapstyles
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import {
	setMapReference,
	toggleMapVisible,
	setMapState
} from "./liveMapActions.js";

// utility
import _ from "lodash";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);


const handleSetReference = (map, dispatch) => {
	dispatch(setMapReference(map));
	dispatch(toggleMapVisible());
};


/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */

function LiveMapWrapper({ creatingReplay, updateMapCoordinates }) {
	const Zoom = useSelector(state => state.clientConfig.mapSettings.zoom);
	const Center = useSelector(state => state.clientConfig.mapSettings.center);
	const mapRef = useSelector(state => state.mapState.baseMap.mapRef);
	const baseMaps = useSelector(state => state.baseMaps);
	const persisted = useSelector(state => state.appState.persisted);
	const settings = useSelector(state => persisted ? mapSettingsSelector(state) : undefined);
	const map = mapRef;
	const zoom = !_.isEmpty(persisted) ? settings.mapZoom : Zoom;
	const center = !_.isEmpty(persisted) ? settings.mapCenter : Center;
	const style = !_.isEmpty(persisted) ? settings.mapStyle : "satellite";
	return <ReplayMap
		style={style}
		zoom={zoom}
		center={center}
		map={map}
		baseMaps={baseMaps}
		creatingReplay={creatingReplay}
		updateMapCoordinates={updateMapCoordinates}
	/>;
}


const ReplayMap = memo(({
	style,
	zoom,
	center,
	map,
	creatingReplay,
	updateMapCoordinates,
	baseMaps
}) => {

	const dispatch = useDispatch();

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

	const handleSetMapReference = (map) => {
		dispatch(setMapReference(map));
	};

	const handleToggleMapVisible = () => {
		dispatch(toggleMapVisible());
	};
	return (
		<Map
			style={getStyle()}
			center={center}
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			containerStyle={{
				width: "100%",
				height: "100%"
			}}
			movingMethod="flyTo"
			onMoveEnd={m => handleMove(m)}
			onStyleLoad={m => handleSetReference(m, dispatch)}
		>
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

export default LiveMapWrapper;
