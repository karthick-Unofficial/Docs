import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import Map from "lodash/map";
import keys from "lodash/keys";
import each from "lodash/each";
import size from "lodash/size";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { useSelector } from "react-redux";
import TrackHistoryInfo from "./components/TrackHistoryInfo";
import { disabledFeedsSelector } from "orion-components/AppState/Selectors";

const propTypes = {
    map: PropTypes.object
};

const TrackHistoryLayer = ({ map }) => {
    const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
    const trackHistory = useSelector((state) => trackHistorySelector(state, disabledFeeds));
    const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);


    const getTrackHistoryGeoJSON = () => {
        const historyGeoJSON = Map(keys(trackHistory), (id) => {
            return {
                geometry: {
                    type: "LineString",
                    coordinates: Map(
                        trackHistory[id],
                        (entry) => entry.entityData.geometry.coordinates
                    )
                }
            };
        });

        const source = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: historyGeoJSON
            }
        };
        return source;
    };

    const getTrackHistoryGeoJSONPoints = () => {
        const trackHistoryPoints = [];

        each(trackHistory, (history) =>
            each(history, (entry) => trackHistoryPoints.push(entry.entityData))
        );

        const source = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: trackHistoryPoints
            }
        };
        return source;
    };

    return (
        <Fragment>
            {size(trackHistory) > 0 && (
                <Fragment>
                    <Source
                        id="thLineSource"
                        geoJsonSource={getTrackHistoryGeoJSON()}
                    />

                    <Source
                        id="thPointSource"
                        geoJsonSource={getTrackHistoryGeoJSONPoints()}
                    />
                    <Layer
                        id="ac2-track-history-points"
                        type="circle"
                        sourceId="thPointSource"
                        paint={{
                            "circle-color": "white",
                            "circle-radius": 3
                        }}
                        before="---ac2-track-history-position-end"
                    />

                    <Layer
                        id="ac2-track-history-lines"
                        type="line"
                        sourceId="thLineSource"
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
                    {map && <TrackHistoryInfo
                        map={map}
                        trackHistoryContexts={Object.keys(trackHistory)}
                        timeFormatPreference={
                            timeFormatPreference
                                ? timeFormatPreference
                                : "12-hour"
                        }
                    />}
                </Fragment>
            )}
        </Fragment>
    );
};

TrackHistoryLayer.propTypes = propTypes;

export default TrackHistoryLayer;
