import React, { memo } from "react";
import PropTypes from "prop-types";
import { Layer, Feature } from "react-mapbox-gl";
import { useSelector } from "react-redux";

const propTypes = {
	vessels: PropTypes.object.isRequired
};

const VesselLayer = () => {
	const vessels = useSelector(state => state.map).vessels;

	return (
		<Layer
			id="vessels"
			layout={{
				"icon-image": "{iconType}_{disposition}",
				"text-field": "{name}",
				"icon-rotate": [
					"case",
					[
						"any",
						["all", ["has", "course"], ["has", "heading"]],
						["has", "heading"]
					],
					["get", "heading"],
					[
						"any",
						[
							"all",
							["has", "course"],
							["has", "hdg"],
							["!=", ["get", "hdg"], 511]
						],
						["all", ["has", "hdg"], ["!=", ["get", "hdg"], 511]]
					],
					["get", "hdg"],
					[
						"any",
						[
							"all",
							["has", "course"],
							["has", "hdg"],
							["==", ["get", "hdg"], 511]
						],
						["has", "course"]
					],
					["get", "course"],
					0
				],
				"icon-rotation-alignment": "map",
				"icon-allow-overlap": true,
				"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
				"text-size": 12,
				"text-offset": [0, -2],
				"text-optional": true,
				"text-allow-overlap": false
			}}
			paint={{
				"text-color": "#000000",
				"text-halo-color": "rgba(255, 255, 255, 1)",
				"text-halo-width": 2
			}}
		>
			{Object.values(vessels).map(vessel => {
				const { id, entityData } = vessel;
				const { geometry, properties } = entityData;
				return (
					<Feature
						key={id}
						coordinates={geometry.coordinates}
						properties={properties}
					/>
				);
			})}
		</Layer>
	);
};

VesselLayer.propTypes = propTypes;

export default memo(VesselLayer);
