import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import * as mapUtilities from "../../mapUtilities";
import TraceInfo from "./TraceInfo";

const propTypes = {
	map: PropTypes.object.isRequired,
	features: PropTypes.array,
	floorPlan: PropTypes.object,
	traceSettings: PropTypes.object,
	markerSize: PropTypes.number.isRequired
};

const TracePointLayer = ({ map, features, floorPlan, traceSettings, markerSize }) => {
	if (!features || features.length === 0) {
		return null;
	}

	const visibleFeatures = features.filter(feature => 
		traceSettings[feature.properties.team][feature.properties.classification]);
	const filteredFeatures = mapUtilities.filterFeatures(visibleFeatures, floorPlan);
	if (filteredFeatures.length === 0) {
		return null;
	}

	const renderLayer = () => {
		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: filteredFeatures
			}
		};

		return (
			<Fragment>
				<Source 
					id="source-tracepoints" 
					geoJsonSource={source} 
				/>
				<Layer 
					id="layer-tracepoints"
					type="symbol" 
					layout={{
						"icon-image": "{team_class}",
						"icon-size": markerSize,
						"icon-allow-overlap": true
					}}
					paint={{
					}}
					before={null}
					sourceId="source-tracepoints" 
				>
				</Layer>
				<TraceInfo map={map} layerId="layer-tracepoints" type="point" />
			</Fragment>
		);
	};

	return (
		<Fragment>
			{renderLayer()}
		</Fragment>
	);
};

TracePointLayer.propTypes = propTypes;
export default TracePointLayer;