/* eslint react/prop-types: 0 */
import React, { PureComponent, Fragment, memo } from "react";
import { Source, Layer } from "react-mapbox-gl";
import * as mapUtilities from "../../mapUtilities";
import _ from "lodash";

class MapLayer extends PureComponent {
	renderLayer() {
		const { data, floorPlan, entityType, labelsVisible, markerSize, floorPlansOnMainMap, floorPlans} = this.props;
		let imageIcon = floorPlan ? entityType : ["get", "icon"];
		const entities = _.values(data);
		const filteredEntities = mapUtilities.filterEntities(entities, floorPlan);
		if (filteredEntities.length === 0) {
			return null;
		}
		const features = filteredEntities.map(entity => {
			entity.entityData.properties.entityType = entity.entityType;
			if (entity.entityData.geometry && entity.entityData.geometry.coordinates.length > 2) {
				entity.entityData.properties.altitude = entity.entityData.geometry.coordinates[2];
			}
			else {
				entity.entityData.properties["icon"] = `${entityType}`;
			}
			
			return entity.entityData;
		});

		const processForMainMapFloor = (entity, fplans) => {
			if (!entity.entityData.properties) {
				return;
			}

			let containmentData = null;
			if(entity.entityData.properties.facilityData) {
				containmentData = entity.entityData.properties.facilityData;
			}
			else {
				containmentData = mapUtilities.getGeometryFloorPlan(entity.entityData.geometry, fplans);
				if (containmentData.inFacility) {
					entity.entityData.properties["facilityData"] = containmentData;
				}
			}
			
			if (containmentData.inFacility) {
				const floorPlanOnMap = floorPlansOnMainMap[containmentData.facilityId];
				if (containmentData.floorPlanId === floorPlanOnMap) {
					entity.entityData.properties["icon"] = `${entityType}_onfloor`;
				}else {
					entity.entityData.properties["icon"] = entityType;
				}	
			}else {
				entity.entityData.properties["icon"] = entityType;
			}
			
		};

		const enrichDataForMainMapFloorPlans = () => {
			if (floorPlan || !floorPlans || !floorPlansOnMainMap || _.isEmpty(floorPlansOnMainMap)) {
				imageIcon = entityType;
				return;
			}
	
			const fplans = {};
			_.keys(floorPlansOnMainMap).forEach(facilityId => {
				if (floorPlans.hasOwnProperty(facilityId) && floorPlansOnMainMap[facilityId] && floorPlans[facilityId].length > 1) {
					fplans[facilityId] = floorPlans[facilityId];
				}
			});
			if (_.isEmpty(fplans)) {
				imageIcon = entityType;
				return;
			}
			
			_.values(filteredEntities).forEach(entity => {
				processForMainMapFloor(entity, fplans);
			});
		};

		enrichDataForMainMapFloorPlans();
		
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
					id={`source-${entityType}`} 
					geoJsonSource={source} 
				/>
				<Layer 
					id={`layer-${entityType}`}
					type="symbol" 
					layout={{
						"icon-image": imageIcon,
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
					sourceId={`source-${entityType}`} 
				>
				</Layer>
			</Fragment>
		);
	}

	render() {
		const { data, showLayer } = this.props;
		return data && showLayer ? (
			<Fragment>
				{this.renderLayer()}
			</Fragment>
		) : (
			<div />
		);
	}
}

export default memo(MapLayer, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
