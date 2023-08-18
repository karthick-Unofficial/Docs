import React, { Fragment, memo } from "react";
import { Source, Layer } from "react-mapbox-gl";
import TrackHistoryInfo from "./TrackHistoryInfo/TrackHistoryInfo";
import { useSelector } from "react-redux";
import {
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import Map from "lodash/map";
import keys from "lodash/keys";
import each from "lodash/each";
import size from "lodash/size";
import isEqual from "lodash/isEqual";

const trackHistoryLines = trackHistory => {
	const historyGeoJSON = Map(keys(trackHistory), id => {
		return {
			geometry: {
				type: "LineString",
				coordinates: Map(
					trackHistory[id],
					entry => entry.entityData.geometry.coordinates
				)
			}
		};
	});

	return historyGeoJSON;
};

const trackHistoryPoints = trackHistory => {
	const trackHistoryPoints = [];

	each(trackHistory, history =>
		each(history, entry => {
			entry.entityData.properties["id"] = entry.id;
			entry.entityData.properties["acquisitionTime"] = entry.acquisitionTime;
			trackHistoryPoints.push(entry.entityData);
		})
	);

	return trackHistoryPoints;
};

const TrackHistoryWrapper = ({ map }) => {
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const trackHistory = {};
	const context = useSelector(state => state.contextualData);
	const allTransactions = useSelector(state => state.replay.allTransactions);
	Object.keys(context).forEach(contextKey => {
		//Every track has a buffer starting before the replay date, we don't want that data for track history
		let passedInitial = false;
		if (context[contextKey] && context[contextKey].trackHistory && (disabledFeeds ? !disabledFeeds.includes(context[contextKey].entity.feedId) : true)) {
			trackHistory[contextKey] = allTransactions.filter(entity => {
				if (!passedInitial) {
					passedInitial = true;
					return false;
				}
				return entity.id === contextKey;
			});
		}
	});
	return <TrackHistory
		map={map}
		trackHistory={trackHistory}
	/>;
};

const TrackHistory = memo(({ map, trackHistory }) => {

	const trackHistorySourceOptions = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: trackHistoryLines(trackHistory)
		}
	};

	const trackHistoryPointsSourceOptions = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: trackHistoryPoints(trackHistory)
		}
	};
	return map ? (
		<Fragment>
			{size(trackHistory) && (
				<Fragment>
					<Source
						id="trackHistorySource"
						geoJsonSource={trackHistorySourceOptions}
					/>
					<Source
						id="trackHistoryPointsSource"
						geoJsonSource={trackHistoryPointsSourceOptions}
					/>
					<Layer
						id="ac2-track-history-points"
						type="circle"
						sourceId="trackHistoryPointsSource"
						paint={{
							"circle-color": "white",
							"circle-radius": 3
						}}
						before="---ac2-track-history-position-end"
					/>
					<Layer
						id="track-history-lines"
						type="line"
						sourceId="trackHistorySource"
						layout={{
							"line-join": "round",
							"line-cap": "round"
						}}
						paint={{
							"line-color": "#35b7f3",
							"line-width": 1
						}}
						before="ac2-track-history-points"
					/>
					<TrackHistoryInfo map={map} trackHistoryContexts={Object.keys(trackHistory)} />
				</Fragment>
			)}
		</Fragment>
	) : null;
}, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});

TrackHistory.displayName = "TrackHistory";

export default TrackHistoryWrapper;