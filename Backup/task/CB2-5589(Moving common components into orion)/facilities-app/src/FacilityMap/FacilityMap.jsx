import React, { memo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl, RotationControl, Layer } from "react-mapbox-gl";
import NauticalCharts from "./NauticalCharts/NauticalCharts";
import RoadsAndLabels from "./RoadsAndLabels/RoadsAndLabels";
import WeatherRadar from "./WeatherRadar/WeatherRadar";
import MapControls from "./MapControls/MapControls";
import { FacilitiesLayer, AccessPointLayer } from "orion-components/Map/Layers";
import * as facilitiesLayerActions from "./Facilities/facilitiesActions";
import Cameras from "./Cameras/Cameras";
import ActiveFloorPlan from "./ActiveFloorPlan/ActiveFloorPlan";
import { ContextMenu } from "orion-components/Map/ContextMenu";
import * as accessPointLayerAction from "./AccessPoint/accessPointActions";
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import {
	setMapReference,
	toggleMapVisible,
	setMapState
} from "./facilityMapActions";
import size from "lodash/size";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);

const propTypes = {
	style: PropTypes.string,
	zoom: PropTypes.number.isRequired,
	center: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.shape({
			lng: PropTypes.number.isRequired,
			lat: PropTypes.number.isRequired
		})
	]).isRequired,
	baseMaps: PropTypes.array.isRequired,
	nauticalChartsEnabled: PropTypes.bool,
	weatherEnabled: PropTypes.bool
};

const defaultProps = {
	style: "satellite"
};

/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */

const FacilityMapWrapper = () => {
	const appState = useSelector(state => state.appState);
	const { persisted } = appState;
	const clientConfig = useSelector(state => state.clientConfig);
	const baseMaps = useSelector(state => state.baseMaps);
	const mapZoom = persisted.mapSettings && persisted.mapSettings.mapZoom;
	const mapCenter = persisted.mapSettings && persisted.mapSettings.mapCenter;
	const style = persisted.mapSettings ? persisted.mapSettings.mapStyle : "satellite";
	const zoom = persisted.mapSettings && mapZoom ? mapZoom : clientConfig.mapSettings.zoom;
	const center = persisted.mapSettings && mapCenter ? mapCenter : clientConfig.mapSettings.center;
	const maxZoom = clientConfig.mapSettings.maxZoom || 18;
	const minZoom = clientConfig.mapSettings.minZoom || 2;
	const { nauticalChartsEnabled, weatherEnabled } = size(clientConfig) && clientConfig.mapSettings;

	return <FacilityMap
		baseMaps={baseMaps}
		nauticalChartsEnabled={nauticalChartsEnabled}
		weatherEnabled={weatherEnabled}
		zoom={zoom}
		center={center}
		minZoom={minZoom}
		maxZoom={maxZoom}
		style={style}
	/>;
};

const FacilityMap = memo((props) => {
	const { baseMaps, nauticalChartsEnabled, weatherEnabled, zoom, center, minZoom, maxZoom, style } = props;
	const [mapRef, setMapRef] = useState(null);
	const dispatch = useDispatch();

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
			setMapState({ mapCenter, mapZoom });
		},
		[setMapState]
	);

	const handleSetReference = map => {
		dispatch(setMapReference(map));
		setMapRef(map);
		dispatch(toggleMapVisible());
	};

	const setMinMaxZoom = (map) => {
		map.transform.minZoom = minZoom;
		map.transform.maxZoom = maxZoom;
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

	return (
		<Map
			style={getStyle()}
			center={center}
			zoom={[zoom]}
			containerStyle={{
				width: "100vw",
				height: "calc(100vh - 48px)"
			}}
			movingMethod="flyTo"
			onMoveEnd={m => handleMove(m)}
			onStyleLoad={map => {
				handleSetReference(map);
				setMinMaxZoom(map);
			}}
		>
			{/* Layers for enforcing layer ordering */}
			<Layer id="---ac2-alerts-position-end" type="symbol" />
			<Layer id="---ac2-feed-entities-position-end" before="---ac2-alerts-position-end" type="symbol" />
			<Layer id="---ac2-weather-position-end" before="---ac2-feed-entities-position-end" type="symbol" />
			<Layer id="---ac2-floorplans-position-end" before="---ac2-weather-position-end" type="symbol" />
			<Layer id="---ac2-facilities-position-end" before="---ac2-floorplans-position-end" type="symbol" />
			<Layer id="---ac2-nautical-charts-position-end" before="---ac2-facilities-position-end" type="symbol" />

			<ZoomControl />
			<RotationControl />
			{!nauticalChartsEnabled ? null : <NauticalCharts />}
			<RoadsAndLabels />
			{!weatherEnabled ? null : <WeatherRadar />}
			<ActiveFloorPlan />
			<FacilitiesLayer before="---ac2-facilities-position-end" {...facilitiesLayerActions} />
			<Cameras />
			<MapControls />
			{mapRef && (
				<ContextMenu map={mapRef} />
			)}
			<AccessPointLayer labelsVisible={true} {...accessPointLayerAction} />
		</Map>
	);
}, (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style) {
		return false;
	}
	if (prevProps.baseMaps !== nextProps.baseMaps) {
		return false;
	}
	if (prevProps.center !== nextProps.center) {
		return false;
	}
	return true;
});

FacilityMap.propTypes = propTypes;
FacilityMap.defaultProps = defaultProps;
FacilityMap.displayName = "FacilityMap";

export default FacilityMapWrapper;