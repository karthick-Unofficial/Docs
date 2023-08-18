/* eslint react/prop-types: 0 */
import React, { PureComponent, Fragment, memo } from "react";
import { Source, Layer } from "react-mapbox-gl";
//import * as mapUtilities from "../../mapUtilities";
import _ from "lodash";

class ModificationObjectiveMapLayer extends PureComponent {
	
	getObjectives(mods){

		const objectivesMod = _.values(mods).filter( (modification) => {
			return (modification.type ==="ADD" && modification.objectType === "OBJECTIVE");
		});

		return _.values(objectivesMod).map( (modification) => {
			
			return {
				name:  modification.object.name,
				coordinates: {x: modification.object.x, y: modification.object.y, z: modification.object.z}
			};
		});
	}

	renderLayer() {
		const { modifications, labelsVisible, markerSize } = this.props;
		const filteredEntities = this.getObjectives(modifications);

		if (filteredEntities.length === 0) {
			return null;
		}
		const features = filteredEntities.map(entity => {
			return {
				properties : {
					name : entity.name,
					entityType: "objective"
				},
				geometry : {
					type : "Point",
					coordinates : [entity.coordinates.x, entity.coordinates.y]
				}
			};
		});

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: features
			}
		};

		return (
			<Fragment>
				<Source 
					id={"source-modification"} 
					geoJsonSource={source} 
				/>
				<Layer 
					id={"layer-modification"}
					type="symbol" 
					layout={{
						"icon-image": "objective_modification",
						"icon-size": markerSize,
						"icon-allow-overlap": true,
						"text-field": `${labelsVisible ? "{name}" : ""}`,
						"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
						"text-size": 12,
						"text-letter-spacing": 0,
						"text-offset": [2, 0],
						"icon-rotation-alignment": "map",
						"text-anchor": "left",
						"text-transform": "uppercase",
						"text-optional": true,
						"text-allow-overlap": false
					}}
					paint={{
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					}}
					before={null}
					sourceId={"source-modification"} 
				>
				</Layer>
			</Fragment>
		);
	}

	render() {
		const { modifications, showLayer } = this.props;
		return modifications && showLayer ? (
			<Fragment>
				{this.renderLayer()}
			</Fragment>
		) : (
			<div />
		);
	}
}

export default memo(ModificationObjectiveMapLayer, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
