import React, { memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl, RotationControl } from "react-mapbox-gl";
import NauticalChartsContainer from "./NauticalCharts/NauticalChartsContainer";
import RoadsAndLabelsContainer from "./RoadsAndLabels/RoadsAndLabelsContainer.js";
import ReplayLayerSourcesContainer from "./ReplayLayerSources/ReplayLayerSourcesContainer";
import { ContextMenuContainer } from "orion-components/Map/ContextMenu";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path => {
	if (window.api) {
		const spriteFilePrefix = `file://${window.api.filePath()}`;
		window.api.log("error", "SpriteFilePrefix: " + spriteFilePrefix);
		const newPath = (path.replace("please-replace-me-with-the-correct-hostname", spriteFilePrefix)).replace("https://", "");
		window.api.log("error", "SpriteFilePath: " + newPath);
		return newPath;
	}
	else {
		return path.replace(
			"please-replace-me-with-the-correct-hostname",
			location.hostname
		);
	}
};


const propTypes = {
	style: PropTypes.string,
	zoom: PropTypes.number.isRequired,
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
const ReplayMap = ({
	style,
	zoom,
	setMapReference,
	toggleMapVisible,
	center,
	baseMaps,
	nauticalChartsEnabled
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

	const handleSetReference = map => {
		setMapReference(map);
		setMapRef(map);
		toggleMapVisible();

		// -- set initial zoom level
		if (!window.api) { map.zoomTo(zoom); }
	};
	return (
		<Map
			style={getStyle()}
			center={center}
			maxZoom={18}
			minZoom={2}
			containerStyle={{
				width: "100vw",
				height: "100%"
			}}
			movingMethod="flyTo"
			onStyleLoad={m => handleSetReference(m)}
		>
			{!nauticalChartsEnabled ? null : <NauticalChartsContainer />}
			<RoadsAndLabelsContainer />
			<ReplayLayerSourcesContainer />
			{mapRef && (
				<ContextMenuContainer map={mapRef} />
			)}
		</Map>
	);
};

ReplayMap.propTypes = propTypes;
ReplayMap.defaultProps = defaultProps;

const onStyleChange = (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style) {
		return false;
	}
	if (prevProps.baseMaps !== nextProps.baseMaps) {
		return false;
	}
	return true;
};

export default memo(ReplayMap, onStyleChange);
