import React, { Fragment, memo, useEffect } from "react";
import PropTypes from "prop-types";
import TrackHistoryContainer from "../TrackHistory/TrackHistoryContainer";
import FacilitiesContainer from "../Facilities/FacilitiesContainer";
import EventsContainer from "../Events/EventsContainer";
import ReplayMapLayerContainer from "./ReplayMapLayer/ReplayMapLayerContainer";
import { BasicLayer, AlertLayer } from "orion-components/Map/Layers";
import _ from "lodash";
const propTypes = {
	activeFeeds: PropTypes.array,
	alerts: PropTypes.object,
	map: PropTypes.object,
	gisLayers: PropTypes.array,
	showAllFOVs: PropTypes.bool,
	facilityFeeds: PropTypes.array,
	showFOVs: PropTypes.func,
	labelsVisible: PropTypes.bool,
	eventsVisible: PropTypes.bool,
	loadGISProfile: PropTypes.func
};

const defaultProps = {
	alerts: {}
};

const handleLoadGIS = (featureId, featureName, layerId, loadGISProfile) => {
	loadGISProfile(
		featureId,
		featureName,
		layerId,
		"gis",
		"profile",
		"primary"
	);
};

const ReplayLayerSources = ({
	activeFeeds,
	alerts,
	map,
	gisLayers,
	showAllFOVs,
	facilityFeeds,
	showFOVs,
	labelsVisible,
	eventsVisible,
	loadGISProfile
}) => {
	useEffect(() => {
		if (showAllFOVs && _.includes(activeFeeds, "cameras")) {
			showFOVs();
		}
	}, [activeFeeds, showAllFOVs, showFOVs]);
	return map ? (
		<Fragment>
			<AlertLayer map={map} alerts={alerts} forReplay={true} />
			{_.map(gisLayers, layer => (
				<BasicLayer
					key={layer.name}
					map={map}
					layer={layer}
					handleClick={(featureId, featureName, layerId) => handleLoadGIS(featureId, featureName, layerId, loadGISProfile)}
					labelsVisible={labelsVisible}
				/>
			))}
			{map && _.map(activeFeeds, feedId => (
				<ReplayMapLayerContainer key={feedId} alerts={alerts} map={map} feedId={feedId} />
			))}
			{map && showAllFOVs && (
				<ReplayMapLayerContainer map={map} feedId={"fovs"} cluster={false} />
			)}
			{_.map(facilityFeeds, feedId => (
				<FacilitiesContainer key={feedId} feedId={feedId} map={map} />
			))}
			{eventsVisible && (
				<EventsContainer map={map} />
			)}
			{
				<TrackHistoryContainer map={map} />
			}
		</Fragment>
	) : <div></div>;
};

ReplayLayerSources.propTypes = propTypes;
ReplayLayerSources.defaultTypes = defaultProps;

export default memo(ReplayLayerSources, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});