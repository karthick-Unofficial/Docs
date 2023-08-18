import React, { Fragment, memo, useEffect } from "react";
import TrackHistory from "../TrackHistory/TrackHistory";
import { FacilitiesLayer, BasicLayer, AlertLayer } from "orion-components/Map/Layers";
import * as facilitiesActions from "../Facilities/facilitiesActions";
import Events from "../Events/Events";
import ReplayMapLayer from "../../NewReplay/NewMapReplay/LiveMap/LayerSources/MapLayer/MapLayer";
import { Layer } from "react-mapbox-gl";
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
import { getInitialPlayBarData } from "../../shared/utility/utilities";
import * as actionCreators from "./replayLayerSourcesActions.js";
import Map from "lodash/map";
import filter from "lodash/filter";
import includes from "lodash/includes";
import isEqual from "lodash/isEqual";

const handleLoadGIS = (featureId, featureName, layerId, loadGISProfile, dispatch) => {
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
	const playBarValue = useSelector(state => state.playBar.playBarValue);
	const settings = useSelector(state => mapSettingsSelector(state));
	const showAllFOVs = useSelector(state => persistedState(state).showAllFOVs);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const userFeeds = useSelector(state => userFeedsSelector(state));

	// Pass down as object
	const activeFeeds = Map(
		filter(
			Map(userFeeds),
			feed => {
				return (
					feed &&
					!includes(disabledFeeds, feed.feedId) &&
					feed.entityType !== "facility"
				);
			}
		), "feedId");

	const facilityFeeds = Map(
		filter(
			Map(userFeeds),
			feed => {
				return (
					feed &&
					!includes(disabledFeeds, feed.feedId) &&
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

	return <ReplayLayerSources
		activeFeeds={activeFeeds}
		alerts={alerts}
		map={map}
		gisLayers={gisLayers}
		showAllFOVs={showAllFOVs}
		facilityFeeds={facilityFeeds}
		labelsVisible={labelsVisible}
		eventsVisible={eventsVisible}
		{...actionCreators}
	/>;
};

const ReplayLayerSources = memo(({
	activeFeeds,
	alerts,
	map,
	gisLayers,
	showAllFOVs,
	facilityFeeds,
	showFOVs,
	labelsVisible,
	eventsVisible,
	loadGISProfile,
	loadProfileOffline
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (showAllFOVs && includes(activeFeeds, "cameras")) {
			dispatch(showFOVs());
		}
	}, [activeFeeds, showAllFOVs, showFOVs]);
	return map ? (
		<Fragment>
			{Map(gisLayers, layer => (
				<BasicLayer
					key={layer.name}
					map={map}
					layer={layer}
					handleClick={(featureId, featureName, layerId) => handleLoadGIS(featureId, featureName, layerId, loadGISProfile, dispatch)}
					labelsVisible={labelsVisible}
				/>
			))}
			{map && Map(activeFeeds, feedId => (
				<ReplayMapLayer
					key={feedId}
					alerts={alerts}
					map={map}
					feedId={feedId}
					replayMap={true}
					loadProfileOffline={loadProfileOffline}
					getInitialPlayBarData={getInitialPlayBarData}
				/>
			))}
			{map && showAllFOVs && (
				<ReplayMapLayer
					map={map}
					feedId={"fovs"}
					cluster={false}
					replayMap={true}
					loadProfileOffline={loadProfileOffline}
					getInitialPlayBarData={getInitialPlayBarData}
				/>
			)}
			{Map(facilityFeeds, feedId => (
				<FacilitiesLayer
					{...facilitiesActions}
					key={feedId}
					feedId={feedId}
					map={map}
					labelsVisible={true}
					replayMap={true}
					getInitialPlayBarData={getInitialPlayBarData}
				/>
			))}
			{eventsVisible && (
				<Events map={map} />
			)}
			{
				<TrackHistory map={map} />
			}
			<Layer id="---ac2-nautical-charts-position-end" type="symbol" />
			<AlertLayer map={map} alerts={alerts} forReplay={true} />
		</Fragment>
	) : <div></div>;
}, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});

ReplayLayerSources.displayName = "ReplayLayerSources";

export default ReplayLayerSourcesWrapper;