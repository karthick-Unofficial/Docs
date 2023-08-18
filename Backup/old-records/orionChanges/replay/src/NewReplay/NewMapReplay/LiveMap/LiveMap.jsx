/* eslint react/prop-types: 0 */
// react
import React, { Fragment, memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
// mapbox
import ReactMapboxGl from "react-mapbox-gl";

//components
import LayerSourcesContainer from "./LayerSources/LayerSourcesContainer";
import { ContextMenuContainer } from "orion-components/Map/ContextMenu";

// mapstyles
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


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

const handleSetReference = (map, setMapReference, toggleMapVisible) => {
	setMapReference(map);
	toggleMapVisible();
};

/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */
const ReplayMap = ({
	style,
	setMapState,
	zoom,
	center,
	setMapReference,
	toggleMapVisible,
	map,
	creatingReplay,
	updateMapCoordinates,
	baseMaps
}) => {

	useEffect(() => {
		if (map && map.dragRotate) {
			map.dragRotate.disable();
		}
	}, [map]);

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
			maxZoom={18}
			minZoom={2}
			zoom={[zoom]}
			containerStyle={{
				width: "100%",
				height: "100%"
			}}
			movingMethod="flyTo"
			onMoveEnd={m => handleMove(m)}
			onStyleLoad={m => handleSetReference(m, setMapReference, toggleMapVisible)}
		>
			{map &&
				<Fragment>
					<LayerSourcesContainer creatingReplay={creatingReplay} map={map} />
				</Fragment>
			}
		</Map>
	);
};

ReplayMap.propTypes = propTypes;
ReplayMap.defaultProps = defaultProps;

const onStyleChange = (prevProps, nextProps) => {
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
};

export default memo(ReplayMap, onStyleChange);
