import React, { memo, useCallback, useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import ReactMapboxGl, { ZoomControl, RotationControl } from "react-mapbox-gl";
import * as mapUtilities from "./mapUtilities";
import satellite from "./mapstyles/satellite.json";
import LayerSourcesContainer from "./LayerSources/LayerSourcesContainer";
import ContextMenuContainer from "./ContextMenu/ContextMenuContainer";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const propTypes = {
	style: PropTypes.string,
	zoom: PropTypes.number.isRequired,
	center: PropTypes.array.isRequired,
	setMapReference: PropTypes.func.isRequired,
	updatePersistedState: PropTypes.func.isRequired,
	toggleMapVisible: PropTypes.func.isRequired,
	isMainMap: PropTypes.bool,
	facility: PropTypes.object,
	floorPlan: PropTypes.object,
	rightOffset: PropTypes.number,
	mapOpened: PropTypes.func.isRequired,
	mapClosed: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	style: "satellite"
};

const MapBase = ({
	style,
	zoom,
	setMapReference,
	updatePersistedState,
	toggleMapVisible,
	center,
	isMainMap,
	facility,
	floorPlan,
	rightOffset,
	mapOpened,
	mapClosed,
	dir
}) => {
	const [ mapRef, setMapRef ] = useState(null);
	const setRerender = useState(0)[1];

	useEffect(() => {
		// We trigger a fetch of map icons if not already done so that the icon images are loaded 
		// by the time any layers need to be rendered.
		mapUtilities.getMapIcons();

		return () => {
			mapClosed(floorPlan ? floorPlan.id : null);
		};
	}, []);

	const getStyle = useCallback(() => {
		switch (style) {
			case "satellite":
				return satellite;
			default:
				return satellite;
		}
	}, [style]);
	
	const handleSetReference = map => {
		if (isMainMap) {
			setMapReference(map);
		}
		const iconImages = mapUtilities.getMapIcons();
		iconImages.forEach(iconImage => {
			if (!map.hasImage(iconImage[0])) {
				map.addImage(iconImage[0], iconImage[1]);
			}
		});
		setMapRef(map);
		mapOpened(map, facility ? facility.id : null, floorPlan ? floorPlan.id : null);
		toggleMapVisible();

		map.on("styleimagemissing", e => {
			console.log("Missing map image id: " + e.id);
			if (mapUtilities.iconConfig.hasOwnProperty(e.id)) {
				const mapIcons = mapUtilities.getMapIcons();
				const mapIcon = mapIcons.find(icon => icon[0] === e.id);
				if (mapIcon) {
					const img = mapIcon[1];
					if (img && !img.complete) {
						console.log("Image fetching not yet completed");
						const intervalHandle = setInterval(() => {
							if (img.complete) {
								clearInterval(intervalHandle);
								setRerender(Math.random());
							}
						}, 200);
					}
				}
			}
		});
	};

	const persistState = map => {
		if (isMainMap) {
			const newCoords = Object.values(map.getCenter());
	   		updatePersistedState("tabletop-app", "mapSettings", {
				mapCenter: newCoords,
				mapZoom: map.getZoom()
			});
		}
	};

	const containerStyle = isMainMap ? {
		width: "100%",
		height: "calc(100vh - 48px)"
	} : {
		width: "100%",
		height: "100%"
	};

	const controlsContainerStyle = {
		position: "relative",
		marginTop: isMainMap ? 60 : 0,
		marginRight: rightOffset || 0
	};
	const controlsContainerStyleRTL = {
		position: "relative",
		marginTop: isMainMap ? 60 : 0,
		marginLeft: rightOffset || 0
	};

	return (
		<Map
			style={getStyle()}
			center={center}
			maxZoom={22}
			minZoom={2}
			zoom={[zoom]}
			containerStyle={containerStyle}
			movingMethod="flyTo"
			onMoveEnd={m => persistState(m)}
			onStyleLoad={m => handleSetReference(m)}
		>
			<div style={dir == "rtl" ? controlsContainerStyleRTL : controlsContainerStyle}>
				<ZoomControl />
				<RotationControl />
			</div>
			{mapRef && (
				<Fragment>
					<LayerSourcesContainer map={mapRef} isMainMap={isMainMap} facility={facility} floorPlan={floorPlan} />
					<ContextMenuContainer map={mapRef} />
				</Fragment>
			)}
		</Map>
	);
};

MapBase.propTypes = propTypes;
MapBase.defaultProps = defaultProps;

const onStyleChange = (prevProps, nextProps) => {
	if (prevProps.style !== nextProps.style || prevProps.rightOffset !== nextProps.rightOffset) {
		return false;
	}
	return true;
};

export default memo(MapBase, onStyleChange);
