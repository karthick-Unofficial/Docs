import React from "react";
import PropTypes from "prop-types";
import { Marker } from "react-mapbox-gl";
import { filterEntities } from "../../mapUtilities";

const propTypes = {
	floorPlan: PropTypes.object,
	fovAgents: PropTypes.array,
	simulationData: PropTypes.object,
	agents: PropTypes.object
};

const FovLayer = ( { floorPlan, fovAgents, agents } ) => {
	if (!fovAgents || fovAgents.length === 0) {
		return null;
	}

	const polarToCartesian = ( centerX, centerY, radius, angleInDegrees ) => {
		const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	};

	const getPathData = ( fov ) => {
		const startAngle = (fov/2)*-1;
		const endAngle = fov/2;
		const start = polarToCartesian(120, 120, 120, endAngle);
		const end = polarToCartesian(120, 120, 120, startAngle);
		const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

		return `M ${start.x} ${start.y} A 120 120 0 ${largeArcFlag} 0 ${end.x} ${end.y} L 120 120 Z`;
	};

	const agentObjects = {};
	fovAgents.forEach(agentId => {
		if (agents.hasOwnProperty(agentId) && agents[agentId].entityData.geometry && agents[agentId].entityData.properties.fov > 0) {
			agentObjects[agentId] = agents[agentId];
		}
	});
	const qualifyingAgents = filterEntities(agentObjects, floorPlan);
	
	return qualifyingAgents.map(agent => {
		const heading = agent.entityData.properties.heading === undefined ? 0 : agent.entityData.properties.heading;
		const fov = agent.entityData.properties.fov;
		return (
			<Marker 
				key={agent.id}
				style={{pointerEvents: "none", width: 240, height: 240}}
				coordinates={agent.entityData.geometry.coordinates}
				anchor="center"
			>
				{fov > 0 && fov < 360 && 
					<svg viewBox="0 0 240 240" width="240" height="240">
						<defs>
							<linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
								<stop offset="0" stopColor="#fff" stopOpacity="0"/>
								<stop offset="1" stopColor="#fff" stopOpacity="0.824"/>
								<stop offset="1" stopColor="#fff"/>
							</linearGradient>
						</defs>
						<path 
							fill="url(#linear-gradient)" 
							stroke="none" 
							d={getPathData(fov)} 
							transform={`rotate(${heading},120,120)`}
						/>
					</svg>
				}
				{fov === 360 &&
					<svg viewBox="0 0 240 240" width="240" height="240">
						<defs>
							<radialGradient id="radial-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
								<stop offset="0" stopColor="#fff" stopOpacity="0.824"/>
								<stop offset="1" stopColor="#fff" stopOpacity="0.4"/>
							</radialGradient>
						</defs>
						<circle cx="120" cy="120" r="120" fill="url(#radial-gradient)" stroke="none" />
					</svg>
				}
			</Marker>
		);
	});
};

FovLayer.propTypes = propTypes;
export default FovLayer;
