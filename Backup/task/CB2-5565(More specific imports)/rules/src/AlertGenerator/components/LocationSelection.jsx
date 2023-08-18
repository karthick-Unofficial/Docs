import React, { useState } from "react";
import PropTypes from "prop-types";

import ReactMapboxGl, { ZoomControl, RotationControl } from "react-mapbox-gl";
import satellite from "./satellite.json";
import BasicLayer from "orion-components/Map/Layers/BasicLayer";

import { TextField } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useStyles } from "../../shared/styles/overrides";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);

satellite.sprite = setSpritePath(satellite.sprite);

const propTypes = {
	handleChangeLatitude: PropTypes.func.isRequired,
	handleChangeLongitude: PropTypes.func.isRequired,
	handleMapClick: PropTypes.func.isRequired,
	latitude: PropTypes.number,
	longitude: PropTypes.number,
	dir: PropTypes.string
};
const defaultProps = {
	dir: "ltr"
};

const LocationSelection = ({
	handleChangeLatitude,
	handleChangeLongitude,
	handleMapClick,
	latitude,
	longitude,
	dir
}) => {
	const classes = useStyles();

	const [mapReference, setMapReference] = useState(null);
	const featureData = [
		{
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [
					longitude,
					latitude
				]
			},
			properties: {
				title: "Test Point",
				icon: "point"
			}
		}
	];

	const styles = {
		textField: {
			borderRadius: 5,
			width: "120px",
			background: "rgb(31, 31, 33)",
			...(dir === "rtl" && { margin: "10px 20px 0 0" }),
			...(dir === "ltr" && { margin: "10px 0 0 20px" })
		}
	};
	return (
		<div className="generic-attribute">
			<h4><Translate value="alertGenerator.locationSelection.location" /></h4>
			<div className="row-item fullwidth">
				<TextField
					onChange={handleChangeLatitude}
					value={latitude || ""}
					placeholder={getTranslation("alertGenerator.locationSelection.lat")}
					style={{
						borderRadius: 5,
						margin: "10px 0 0 0",
						width: "120px",
						background: "rgb(31, 31, 33)"
					}}
					inputProps={{
						style: { padding: "0 12px", height: 48, fontSize: 16 }
					}}
					variant="standard"
					InputProps={{ classes: { input: classes.input }, disableUnderline: true }}
				/>
				<TextField
					onChange={handleChangeLongitude}
					value={longitude || ""}
					placeholder={getTranslation("alertGenerator.locationSelection.lon")}
					style={styles.textField}
					inputProps={{
						style: { padding: "0 12px", height: 48, fontSize: 16 }
					}}
					variant="standard"
					InputProps={{ classes: { input: classes.input }, disableUnderline: true }}
				/>
			</div>
			<Map
				style={satellite}
				maxZoom={18}
				minZoom={2}
				containerStyle={{
					width: "100%",
					height: "200px",
					marginBottom: "10px"
				}}
				movingMethod="flyTo"
				onStyleLoad={m => setMapReference(m)}
				onClick={handleMapClick}
			>
				<ZoomControl />
				<RotationControl />
				{mapReference && parseFloat(latitude) && parseFloat(longitude) &&
					<BasicLayer
						labelsVisible={true}
						map={mapReference}
						layer={{
							type: "symbol",
							name: "Point",
							layerTypes: ["symbol"],
							paint: {
								symbol: {
									"text-color": "#000000",
									"text-halo-color": "rgba(255, 255, 255, 1)",
									"text-halo-width": 2
								}
							},
							layout: {
								symbol: {
									"icon-image": "embassy-15",
									"icon-size": 1,
									"icon-allow-overlap": true,
									"text-field": "",
									"text-offset": [2, 0],
									"icon-rotation-alignment": "map",
									"text-anchor": "left",
									"text-transform": "uppercase",
									"text-optional": true,
									"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
									"text-size": 12,
									"text-letter-spacing": 0
								}
							},
							data: {
								type: "FeatureCollection",
								features: featureData
							}
						}}
					/>}
			</Map>
		</div>
	);
};

LocationSelection.propTypes = propTypes;
LocationSelection.defaultProps = defaultProps;

export default LocationSelection;