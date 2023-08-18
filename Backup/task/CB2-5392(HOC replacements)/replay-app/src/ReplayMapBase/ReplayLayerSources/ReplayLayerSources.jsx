import React, { Fragment, memo, useEffect } from "react";
import TrackHistory from "../TrackHistory/TrackHistory";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import * as facilitiesActions from "../Facilities/facilitiesActions";
import Events from "../Events/Events";
import ReplayMapLayer from "../../NewReplay/NewMapReplay/LiveMap/LayerSources/MapLayer/MapLayer";
import { BasicLayer, AlertLayer } from "orion-components/Map/Layers";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
	userFeedsSelector,
	gisLayerSelector
} from "orion-components/GlobalData/Selectors"; // Remove once all entites selector added

import {
	mapSettingsSelector,
	replayMapObject,
	persistedState,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import {
	mapFiltersSelector
} from "orion-components/ContextPanel/Selectors";
import { getInitialPlayBarData } from "../../shared/utility/utilities"
import {
	loadGISProfile,
	showFOVs
} from "./replayLayerSourcesActions.js";


const handleLoadGIS = (featureId, featureName, layerId, dispatch) => {
	dispatch(loadGISProfile(
		featureId,
		featureName,
		layerId,
		"gis",
		"profile",
		"primary"
	));
};

const ReplayLayerSourcesWrapper = () => {
	const playBarValue = useSelector(state => state.playBar);
	const settings = useSelector(state => mapSettingsSelector(state));
	const mapFilters = useSelector(state => mapFiltersSelector(state));
	const filters = _.map(mapFilters, entity =>
		_.get(entity, "properties.id")
	);
	const showAllFOVs = useSelector(state => persistedState(state).showAllFOVs);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const userFeeds = useSelector(state => userFeedsSelector(state));

	// Pass down as object
	const activeFeeds = _.map(
		_.filter(
			_.map(userFeeds),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType !== "facility"
				);
			}
		), "feedId");

	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeeds),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType === "facility"
				);
			}
		), "feedId");
	const gisLayers = useSelector(state => window.api ? [] : gisLayerSelector(state));
	const alert = useSelector(state => state.replay.alerts);
	const allAlerts = getInitialPlayBarData(playBarValue, alert);
	const alerts = {};
	for (const key in allAlerts) {
		if (!allAlerts[key].closed) {
			alerts[key] = allAlerts[key];
		}
	}
	const map = useSelector(state => replayMapObject(state));
	const labelsVisible = settings.entityLabelsVisible;
	const eventsVisible = !disabledFeeds.includes("Event");
	const aerisKey = useSelector(state => window.api ? "" : state.clientConfig.mapSettings.AERIS_API_KEY);
	return <ReplayLayerSources
		activeFeeds={activeFeeds}
		alerts={alerts}
		map={map}
		gisLayers={gisLayers}
		showAllFOVs={showAllFOVs}
		facilityFeeds={facilityFeeds}
		labelsVisible={labelsVisible}
		eventsVisible={eventsVisible}
	/>

}

const ReplayLayerSources = memo(({
	activeFeeds,
	alerts,
	map,
	gisLayers,
	showAllFOVs,
	facilityFeeds,
	labelsVisible,
	eventsVisible,
}) => {

	const dispatch = useDispatch();

	useEffect(() => {
		if (showAllFOVs && _.includes(activeFeeds, "cameras")) {
			dispatch(showFOVs());
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
					handleClick={(featureId, featureName, layerId) => handleLoadGIS(featureId, featureName, layerId, dispatch)}
					labelsVisible={labelsVisible}
				/>
			))}
			{map && _.map(activeFeeds, feedId => (
				<ReplayMapLayer key={feedId} alerts={alerts} map={map} feedId={feedId} />
			))}
			{map && showAllFOVs && (
				<ReplayMapLayer map={map} feedId={"fovs"} cluster={false} />
			)}
			{_.map(facilityFeeds, feedId => (
				<FacilitiesLayer key={feedId} feedId={feedId} map={map} {...facilitiesActions} labelsVisible={true} />
			))}
			{eventsVisible && (
				<Events map={map} />
			)}
			{
				<TrackHistory map={map} />
			}
		</Fragment>
	) : <div></div>;
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});


export default ReplayLayerSourcesWrapper;