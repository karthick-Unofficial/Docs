import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl, RotationControl, Layer } from "react-mapbox-gl";
import NauticalChartsContainer from "./NauticalCharts/NauticalChartsContainer";
import RoadsAndLabelsContainer from "./RoadsAndLabels/RoadsAndLabelsContainer.js";
import WeatherRadarContainer from "./WeatherRadar/WeatherRadarContainer.js";
import MapControlsContainer from "./MapControls/MapControlsContainer.js";
import FacilitiesContainer from "./Facilities/FacilitiesContainer.js";
import CamerasContainer from "./Cameras/CamerasContainer";
import ActiveFloorPlanContainer from "./ActiveFloorPlan/ActiveFloorPlanContainer.js";
import { ContextMenuContainer } from "orion-components/Map/ContextMenu";
import AccessPointContainer from "./AccessPoint/AccessPointContainer";

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
	baseMaps: PropTypes.array.isRequired
};

const defaultProps = {
	style: "satellite"
};

/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */
const FacilityMap = ({
	style,
	setMapState,
	zoom,
	center,
	setMapReference,
	toggleMapVisible,
	baseMaps,
	nauticalChartsEnabled,
	weatherEnabled
}) => {
	const [mapRef, setMapRef] = useState(null);

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
		setMapReference(map);
		setMapRef(map);
		toggleMapVisible();
	};
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
			{!nauticalChartsEnabled ? null : <NauticalChartsContainer />}
			<RoadsAndLabelsContainer />
			{!weatherEnabled ? null : <WeatherRadarContainer />}
			<ActiveFloorPlanContainer />
			<FacilitiesContainer before="---ac2-facilities-position-end" />
			<CamerasContainer />
			<MapControlsContainer />
			{mapRef && (
				<ContextMenuContainer map={mapRef} />
			)}
			<AccessPointContainer />
		</Map>
	);
};

FacilityMap.propTypes = propTypes;
FacilityMap.defaultProps = defaultProps;

const onStyleChange = (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style) {
		return false;
	}
	if (prevProps.baseMaps !== nextProps.baseMaps) {
		return false;
	}
	return true;
};

export default memo(FacilityMap, onStyleChange);
