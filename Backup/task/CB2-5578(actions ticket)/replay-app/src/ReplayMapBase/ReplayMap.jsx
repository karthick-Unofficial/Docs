import React, { memo, useCallback, useEffect, useState } from "react";
import ReactMapboxGl, { ZoomControl, RotationControl } from "react-mapbox-gl";
import NauticalCharts from "./NauticalCharts/NauticalCharts";
import RoadsAndLabels from "./RoadsAndLabels/RoadsAndLabels";
import ReplayLayerSources from "./ReplayLayerSources/ReplayLayerSources";
import { ContextMenu } from "orion-components/Map/ContextMenu";
import { setRTLTextPlugin, getRTLTextPluginStatus } from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import size from "lodash/size";
import * as actionCreators from "./replayMapActions";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path => {
	if (window.api) {
		const spriteFilePrefix = `file://${window.api.filePath()}`;
		const newPath = (path.replace("please-replace-me-with-the-correct-hostname", spriteFilePrefix)).replace("https://", "");
		return newPath;
	}
	else {
		return path.replace(
			"please-replace-me-with-the-correct-hostname",
			location.hostname
		);
	}
};

/**
 * TODO: This component could be added to orion-components as a BaseMap component (including the container, actions, zoom and rotation controls)
 * TODO: Wrap any child layers with theoretical BaseMap component
 */

const ReplayMapWrapper = (props) => {
	const appState = useSelector(state => state.appState);
	const clientConfig = useSelector(state => state.clientConfig);
	const baseMaps = useSelector(state => state.baseMaps);
	const persisted = appState.persisted;
	const Zoom = !window.api ? clientConfig.mapSettings.zoom : 0;
	let center = [0, 0];
	const nauticalChartsEnabled = size(clientConfig) && clientConfig.mapSettings.nauticalChartsEnabled;
	if (props.location && props.location.query) {
		// parse the coordinates
		const splitCoords = props.location.query.coordinates.split(",");
		const coordinates = [
			[parseFloat(splitCoords[0]), parseFloat(splitCoords[1])],
			[parseFloat(splitCoords[2]), parseFloat(splitCoords[3])]
		];
		center = [(coordinates[0][0] + coordinates[1][0]) / 2, (coordinates[0][1] + coordinates[1][1]) / 2];
	}
	const zoom = persisted.mapSettings ? persisted.mapSettings.mapZoom : Zoom;
	const style = (persisted.mapSettings && persisted.mapSettings.mapStyle) ? persisted.mapSettings.mapStyle : "satellite";

	return <ReplayMap
		style={style}
		zoom={zoom}
		center={center}
		baseMaps={baseMaps}
		nauticalChartsEnabled={nauticalChartsEnabled}
		{...actionCreators}
	/>;
};

const ReplayMap = memo(({
	style,
	zoom,
	setMapReference,
	toggleMapVisible,
	center,
	baseMaps,
	nauticalChartsEnabled
}) => {
	const dispatch = useDispatch();

	const [mapRef, setMapRef] = useState(null);

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
		setMapRef(map);
		dispatch(toggleMapVisible());

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
			<ZoomControl />
			<RotationControl />
			
			{!nauticalChartsEnabled ? null : <NauticalCharts />}
			<RoadsAndLabels />
			<ReplayLayerSources />
			{mapRef && (
				<ContextMenu map={mapRef} />
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

ReplayMap.displayName = "ReplayMap";

export default ReplayMapWrapper;
