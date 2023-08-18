import _ from "lodash";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Marker, Source, Layer } from "react-mapbox-gl";
import { filterEntities, getGeometryFloorPlan } from "../../mapUtilities";
import AgentIcon from "./AgentIcon";

const propTypes = {
	floorPlan: PropTypes.object,
	agents: PropTypes.object,
	agentGroups: PropTypes.object,
	teamsSettings: PropTypes.object,
	labelsVisible: PropTypes.bool,
	teamsMarkerSize: PropTypes.object.isRequired,
	floorPlans: PropTypes.object,
	floorPlansOnMainMap: PropTypes.object
};

const AgentMapLayer = ({ 
	floorPlan, 
	agents, 
	agentGroups, 
	teamsSettings, 
	labelsVisible, 
	teamsMarkerSize, 
	floorPlans, 
	floorPlansOnMainMap 
}) => {
	if (!agents) {
		return null;
	}

	const qualifyingAgents = filterEntities(agents, floorPlan);
	const filteredAgents = {};
	qualifyingAgents.forEach(qualifyingAgent => {
		if (qualifyingAgent.entityData.properties.enabled) {
			if (teamsSettings[qualifyingAgent.entityData.properties.team].enabled) {
				filteredAgents[qualifyingAgent.id] = qualifyingAgent;
			} 
		} else {
			if (teamsSettings[qualifyingAgent.entityData.properties.team].disabled) {
				filteredAgents[qualifyingAgent.id] = qualifyingAgent;
			}
		}
	});
	const agentsToRenderInGroup = {};
	const agentsProcessedInGroup = {};
	const agentsNotInGroup = {};
	const renderOnMainMapFloor = {};

	const processForMainMapFloor = (agent, fplans) => {
		if (!agent.entityData.properties.enabled) {
			return;
		}
		const containmentData = getGeometryFloorPlan(agent.entityData.geometry, fplans);
		if (containmentData.inFacility) {
			const floorPlanOnMap = floorPlansOnMainMap[containmentData.facilityId];
			if (containmentData.floorPlanId === floorPlanOnMap) {
				renderOnMainMapFloor[agent.id] = true;
			}
		}
	};

	const enrichDataForMainMapFloorPlans = () => {
		if (floorPlan || !floorPlans || !floorPlansOnMainMap || _.isEmpty(floorPlansOnMainMap)) {
			return;
		}

		const fplans = {};
		_.keys(floorPlansOnMainMap).forEach(facilityId => {
			if (floorPlans.hasOwnProperty(facilityId) && floorPlansOnMainMap[facilityId] && floorPlans[facilityId].length > 1) {
				fplans[facilityId] = floorPlans[facilityId];
			}
		});
		if (_.isEmpty(fplans)) {
			return;
		}
		_.values(agentsToRenderInGroup).forEach(agentToRenderData => {
			processForMainMapFloor(agentToRenderData.agent, fplans);
		});
		_.values(agentsNotInGroup).map(agent => {
			processForMainMapFloor(agent, fplans);
		});
	};

	const generateRenderData = () => {
		_.values(agentGroups).forEach(agentGroup => {
			// If the group agents are not in the list of filtered agents, ignore. We only need to check first group agent
			if (!filteredAgents[agentGroup.entityData.properties.agentIds[0]]) {
				return null;
			}
			// Mark all agents in group as processed
			agentGroup.entityData.properties.agentIds.forEach(agentId => agentsProcessedInGroup[agentId] = true);
			// Render first agent in group as group
			filteredAgents[agentGroup.entityData.properties.agentIds[0]].entityData.properties.displayName = 
				agentGroup.entityData.properties.name;
			agentsToRenderInGroup[agentGroup.entityData.properties.agentIds[0]] = {
				agent: filteredAgents[agentGroup.entityData.properties.agentIds[0]],
				groupSize: agentGroup.entityData.properties.agentIds.length
			};
		});

		_.values(filteredAgents).forEach(agent => {
			if (!agentsProcessedInGroup[agent.id]) {
				agent.entityData.properties.displayName = agent.entityData.properties.name;
				agentsNotInGroup[agent.id] = agent;
			}
		});
	};

	const renderTransparentLayer = () => {
		const allAgents = { ...agentsNotInGroup };
		_.values(agentsToRenderInGroup).forEach(agentData => {
			allAgents[agentData.agent.id] = agentData.agent;
		});
		const features = _.map(allAgents, agent => {
			agent.entityData.properties.entityType = agent.entityType;
			agent.entityData.properties.markerSize = teamsMarkerSize[agent.entityData.properties.team];
			if (agent.entityData.geometry && agent.entityData.geometry.coordinates.length > 2) {
				agent.entityData.properties.altitude = agent.entityData.geometry.coordinates[2];
			}
			return agent.entityData;
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
					id="source-agent" 
					geoJsonSource={source} 
				/>
				<Layer 
					id="layer-agent"
					type="symbol" 
					layout={{
						"icon-image": "agent",
						"icon-size": { 
							"type": "identity", 
							"property": "markerSize" 
						},
						"icon-allow-overlap": true,
						"text-field": `${labelsVisible ? "{displayName}" : ""}`,
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
					sourceId="source-agent"
				>
				</Layer>
			</Fragment>
		);
	};

	const renderMarker = (agent, group, groupName, groupSize) => {
		const markerSize = teamsMarkerSize[agent.entityData.properties.team] * 50;
		return (
			<Marker 
				key={agent.id}
				style={{pointerEvents: "none", width: `${markerSize}px`, height: `${markerSize}px`}}
				coordinates={agent.entityData.geometry.coordinates}
				anchor="center"
			>
				<AgentIcon 
					agent={agent} 
					group={group} 
					groupName={groupName} 
					groupSize={groupSize} 
					mapIcon={true}
					size={markerSize} 
					onMainMapFloor={renderOnMainMapFloor.hasOwnProperty(agent.id)}
				/>
			</Marker>
		);
	};

	const renderAgentGroups = () => {
		return _.values(agentsToRenderInGroup).map(agentToRenderData => {
			return renderMarker(agentToRenderData.agent, true, "", agentToRenderData.groupSize);
		});
	};

	const renderAgents = () => {
		return _.values(agentsNotInGroup).map(agent => {
			return renderMarker(agent, false, null, 1);
		});
	};

	generateRenderData();
	enrichDataForMainMapFloorPlans();

	return (
		<Fragment>
			{agentGroups && renderAgentGroups()}
			{renderAgents()}
			{renderTransparentLayer()}
		</Fragment>
	);
};

AgentMapLayer.propTypes = propTypes;
export default AgentMapLayer;
