import _ from "lodash";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import { filterFeatures } from "../../mapUtilities";
import TraceInfo from "./TraceInfo";

const propTypes = {
	map: PropTypes.object.isRequired,
	features: PropTypes.array,
	floorPlan: PropTypes.object,
	traceSettings: PropTypes.object
};

const TraceLineLayer = ({ map, features, floorPlan, traceSettings }) => {
	if (!features || features.length === 0) {
		return null;
	}
	
	const renderLayer = () => {
		const visibleFeatures = features.filter(feature => 
			traceSettings[feature.properties.team][feature.properties.classification]);
		const filteredFeatures = filterFeatures(visibleFeatures, floorPlan);
		const splitFeatures = _.groupBy(filteredFeatures, "properties.classification");

		return _.keys(splitFeatures).map(splitFeatureClass => {
			const lineDash = splitFeatures[splitFeatureClass][0].properties.lineDash;
			const source = {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: splitFeatures[splitFeatureClass]
				}
			};

			const paint = {
				"line-color": {
					"type": "identity",
					"property": "lineColor"
				},
				"line-width": 2
			};

			if (lineDash) {
				paint["line-dasharray"] = [ lineDash[0] < lineDash[1] ? lineDash[0]/2 : lineDash[0], lineDash[1] ];
			}

			return (
				<Fragment key={`tracelines-${splitFeatureClass}`}>
					<Source 
						id={`source-tracelines-${splitFeatureClass}`}
						geoJsonSource={source} 
					/>
					<Layer 
						id={`layer-tracelines-${splitFeatureClass}`}
						type="line" 
						paint={paint}
						before={null}
						sourceId={`source-tracelines-${splitFeatureClass}`} 
					>
					</Layer>
					<TraceInfo map={map} layerId={`layer-tracelines-${splitFeatureClass}`} type="line" />
				</Fragment>
			);
		});
	};

	return (
		<Fragment>
			{renderLayer()}
		</Fragment>
	);
};

TraceLineLayer.propTypes = propTypes;
export default TraceLineLayer;