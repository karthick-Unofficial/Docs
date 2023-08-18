import _ from "lodash";
import React, { useEffect, useState, useRef, Fragment, memo } from "react";
import PropTypes from "prop-types";
import { Popup } from "react-mapbox-gl";
import * as utilities from "../../../shared/utility/utilities";
import { getEntitiesForMapFeatures } from "../mapUtilities";
import WmsBaseMapLayerContainer from "./MapLayer/WmsBaseMapLayerContainer";
import FloorPlanLayer from "../../Widgets/Facilities/FloorPlanLayer";
import FovLayerContainer from "./MapLayer/FovLayerContainer";
import AgentMapLayerContainer from "./MapLayer/AgentMapLayerContainer";
import MapLayerContainer from "./MapLayer/MapLayerContainer";
import TraceLineLayerContainer from "./MapLayer/TraceLineLayerContainer";
import TracePointLayerContainer from "./MapLayer/TracePointLayerContainer";
import LocationHistoryLayerContainer from "./MapLayer/LocationHistoryLayerContainer";
import ModificationObjectiveMapLayerContainer from "./MapLayer/ModificationObjectiveMapLayerContainer";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object.isRequired,
	isMainMap: PropTypes.bool.isRequired,
	facility: PropTypes.object,
	floorPlan: PropTypes.object,
	simulationData: PropTypes.object,
	facilities: PropTypes.object,
	floorPlans: PropTypes.object,
	simTimePrecision: PropTypes.number,
	loadAgentProfile: PropTypes.func.isRequired,
	loadFacilityProfile: PropTypes.func.isRequired,
	getFloorPlans: PropTypes.func.isRequired
};

const LayerSources = ({
	map,
	isMainMap,
	facility,
	floorPlan,
	simulationData,
	facilities,
	floorPlans,
	simTimePrecision,
	loadAgentProfile,
	loadFacilityProfile,
	getFloorPlans
}) => {
	const [agentForPopup, setAgentForPopup] = useState(null);

	// We use the ref below to keep track of all facilities for which floor plans have been fetched,
	// so that we dont end up making multiple calls as the facilities data changes while a previous 
	// floor plans fetch is in progress.
	const facilitiesFetchedRef = useRef({});

	useEffect(() => {
		// Change cursor to pointer when over an entity
		map.on("mousemove", e => {
			const features = _.filter(
				map.queryRenderedFeatures(e.point),
				// Make sure layers aren't coming from Mapbox or are FOVs
				feature =>
					feature.layer.source !== "mapbox" &&
					feature.layer.source !== "composite"
			);

			map.getCanvas().style.cursor = features.length ? "pointer" : "";

			const entities = getEntitiesForMapFeatures(features);
			if (entities.count === 1 && entities.agents.length === 1 &&
				(entities.agents[0].properties.lastSeenTime !== undefined && entities.agents[0].properties.lastSeenTime !== null)) {
				setAgentForPopup(entities.agents[0]);
			} else {
				setAgentForPopup(null);
			}
		});

		// Handle entity click/touch interactions
		const handleFeatureClick = e => {
			let features = map
				.queryRenderedFeatures(e.point)
				.filter(feature => feature.source !== "composite");

			const entities = getEntitiesForMapFeatures(features);

			if (entities.agents.length > 0) {
				loadAgentProfile(entities.agents[0].properties.id);
			} else if (entities.facilities.length > 0) {
				loadFacilityProfile(entities.facilities[0].properties.id);
			}
		};

		map.on("click", e => handleFeatureClick(e));
		map.on("touchend", e => handleFeatureClick(e));
	}, []);

	useEffect(() => {
		if (isMainMap && facilities) {
			// We fetch all the floor plans for all the facilities
			_.keys(facilities).forEach(facilityId => {
				if (!facilitiesFetchedRef.current.hasOwnProperty(facilityId) &&
					(!floorPlans || !floorPlans.hasOwnProperty(facilityId))) {
					getFloorPlans(facilityId);
					facilitiesFetchedRef.current[facilityId] = true;
				}
			});
		}
	}, [isMainMap, facilities]);

	return map ? (
		<Fragment>
			<WmsBaseMapLayerContainer key="wmsBaseMap" map={map} layerAbove="country-label-sm" />
			{facility && floorPlan &&
				<FloorPlanLayer
					key="floorPlan"
					floorPlan={floorPlan}
					map={map}
					layerAbove="country-label-sm"
				/>
			}
			<FovLayerContainer key="fovs" map={map} facility={facility} floorPlan={floorPlan} />
			{simulationData &&
				<Fragment>
					<AgentMapLayerContainer
						key="agents"
						map={map}
						facility={facility}
						floorPlan={floorPlan}
					/>
					<MapLayerContainer
						key="objectives"
						name="objectives"
						map={map}
						floorPlan={floorPlan}
						entityType="objective"
						data={simulationData.objectives}
						floorPlans={floorPlans}
					/>
					<MapLayerContainer
						key="interdictionSites"
						name="interdictionSites"
						map={map}
						floorPlan={floorPlan}
						entityType="interdictionSite"
						data={simulationData.interdictionSites}
						floorPlans={floorPlans}
					/>
				</Fragment>
			}
			{!facility && !floorPlan &&
				<MapLayerContainer key="facilities" name="facilities" map={map} entityType="facility" data={facilities} />
			}
			<TraceLineLayerContainer key="traceLines" map={map} facility={facility} floorPlan={floorPlan} />
			<TracePointLayerContainer key="tracePoints" map={map} facility={facility} floorPlan={floorPlan} />
			<LocationHistoryLayerContainer key="locationHistory" map={map} facility={facility} floorPlan={floorPlan} />
			{agentForPopup &&
				<Popup className="mapPopup" coordinates={agentForPopup.geometry.coordinates}>
					<div className="b2-white">
						<Translate value="tableopSession.mapBase.layerSources.main.lastSeen" />{` ${utilities.truncate(agentForPopup.properties.lastSeenTime, simTimePrecision)}`}
					</div>
				</Popup>
			}
			<ModificationObjectiveMapLayerContainer key="objectives-Modifications" name="objectives-Modifications" map={map} />

		</Fragment>
	) : <div></div>;
};

LayerSources.propTypes = propTypes;

export default memo(LayerSources, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});