import React, { memo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl, RotationControl, Layer } from "react-mapbox-gl";
import NauticalCharts from "./NauticalCharts/NauticalCharts";
import RoadsAndLabels from "./RoadsAndLabels/RoadsAndLabels";
import WeatherRadar from "./WeatherRadar/WeatherRadar";
import MapControls from "./MapControls/MapControls";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import * as facilitiesLayerActions from "./Facilities/facilitiesActions";
import Cameras from "./Cameras/Cameras";
import ActiveFloorPlan from "./ActiveFloorPlan/ActiveFloorPlan";
import { ContextMenu } from "orion-components/Map/ContextMenu";
import { AccessPointLayer } from "orion-components/Map/Layers";
import * as accessPointLayerAction from "./AccessPoint/accessPointActions";
import { setRTLTextPlugin } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import {
	setMapReference,
	toggleMapVisible,
	setMapState
} from "./facilityMapActions";
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


const propTypes = {
	style: PropTypes.string,
	setMapState: PropTypes.func.isRequired,
	zoom: PropTypes.number.isRequired,
	center: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.shape({
			lng: PropTypes.number.isRequired,
			lat: PropTypes.number.isRequired
		})
	]).isRequired,
	setMapReference: PropTypes.func.isRequired,
	toggleMapVisible: PropTypes.func.isRequired,
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

function FacilityMapWrapper() {
	const clientConfig = useSelector(state => state.clientConfig);
	const baseMaps = useSelector(state => state.baseMaps);
	const Zoom = useSelector(state => state.clientConfig.mapSettings.zoom);
	const Center = useSelector(state => state.clientConfig.mapSettings.center);
	const { nauticalChartsEnabled, weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	const mapZoom = useSelector(state => state.appState.persisted.mapSettings && state.appState.persisted.mapSettings.mapZoom);
	const mapCenter = useSelector(state => state.appState.persisted.mapSettings && state.appState.persisted.mapSettings.mapCenter);
	const mapStyle = useSelector(state => state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings.mapStyle : "satellite");
	const zoom = mapZoom || Zoom;
	const center = mapCenter || Center
	const style = mapStyle;
	
	return <FacilityMap
		baseMaps={baseMaps}
		Center={Center}
		nauticalChartsEnabled={nauticalChartsEnabled}
		weatherEnabled={weatherEnabled}
		mapZoom={mapZoom}
		zoom={zoom}
		center={center}
		style={style}
	/>
}

const FacilityMap = memo((props) => {

	const { baseMaps, nauticalChartsEnabled, weatherEnabled, zoom, center, style } = props;
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
			dispatch(setMapState({ mapCenter, mapZoom }));
		},
		[setMapState]
	);
	const handleSetReference = map => {
		dispatch(setMapReference(map));
		setMapRef(map);
		dispatch(toggleMapVisible());
	};

	useEffect(() => {
		setRTLTextPlugin(
			"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
			null,
			true
		);
	}, []);

	return (
		<Map
			style={getStyle()}
			center={center}
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			containerStyle={{
				width: "100vw",
				height: "calc(100vh - 48px)"
			}}
			movingMethod="flyTo"
			onMoveEnd={m => handleMove(m)}
			onStyleLoad={m => handleSetReference(m)}
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
			<AccessPointLayer labelsVisible={true} {...accessPointLayerAction}/>
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

FacilityMap.propTypes = propTypes;
FacilityMap.defaultProps = defaultProps;

export default FacilityMapWrapper;

