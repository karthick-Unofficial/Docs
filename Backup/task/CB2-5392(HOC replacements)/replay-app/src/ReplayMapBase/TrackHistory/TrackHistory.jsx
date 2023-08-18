import React, { Fragment, memo } from "react";
import { Source, Layer } from "react-mapbox-gl";
import TrackHistoryInfo from "./TrackHistoryInfo/TrackHistoryInfo";
import _ from "lodash";
import { useSelector } from "react-redux";
import {
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";


const trackHistoryLines = trackHistory => {
	const historyGeoJSON = _.map(_.keys(trackHistory), id => {
		return {
			geometry: {
				type: "LineString",
				coordinates: _.map(
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

	_.each(trackHistory, history =>
		_.each(history, entry => {
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
	/>
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
			{_.size(trackHistory) && (
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
						id="track-history-points"
						type="circle"
						sourceId="trackHistoryPointsSource"
						paint={{
							"circle-color": "white",
							"circle-radius": 3
						}}
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
						before="track-history-points"
					/>
					<TrackHistoryInfo map={map} trackHistoryContexts={Object.keys(trackHistory)} />
				</Fragment>
			)}
		</Fragment>
	) : null;
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});



export default TrackHistoryWrapper;