import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import uniqBy from "lodash/uniqBy";
import isEqual from "lodash/isEqual";
import size from "lodash/size";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { activityService } from "client-app-core";
import { startGateRunnerActivityStream } from "orion-components/ContextualData/Actions";
import { useDispatch } from "react-redux";
import { brcService } from "client-app-core";

import TimelineCard from "./TimelineCard";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const filterOptions = {
    types: ["camera-detection", "manual-location", "unit-status-change"],
    private: true
};

const Timeline = (props) => {
    const {
        canExpand,
        event,
        dir,
        selectedDetection,
        activities,
        unsubscribeFromFeed,
        subscriberRef
    } = props;
    const id = selectedDetection.CarNumber;

    const dispatch = useDispatch();

    const [open, setOpen] = useState(null);
    const [units, setUnits] = useState([]);
    const [activitiesState, setActivitiesState] = useState(activities || []);


    const handleCardExpand = id => {
        if (open === id) {
            setOpen(null);
        } else {
            setOpen(id);
            brcService.streamRecommendations(id, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    setUnits(res);
                }
            });
        }
    };

    console.log("#units", units);

    useEffect(() => {
        getActivities();
        dispatch(startGateRunnerActivityStream(id, "event", filterOptions, subscriberRef));

        return () => {
            if (unsubscribeFromFeed)
                dispatch(unsubscribeFromFeed(id, "activities", subscriberRef));
        };
    }, []);

    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        }, [value]);
        return ref.current;
    };

    const prevProps = usePrevious(props);

    useEffect(() => {
        if (prevProps) {
            if (!isEqual(activities, prevProps.activities)) {
                setActivitiesState(uniqBy([...activitiesState, ...activities], "id"));
            }
        }
    }, [activities]);

    const getActivities = () => {
        const streamedActivities = activities ? activities : [];
        const sorted = activitiesState.sort((a, b) =>
            moment.utc(a.published).diff(moment.utc(b.published))
        );
        const initial = (new Date()).toISOString();
        const date =
            sorted.length > 0 ? sorted[0].published : initial;

        activityService.getActivitiesByEvent(
            id,
            1000,
            date,
            filterOptions,
            (err, res) => {
                if (err) console.log(err);
                if (res) {
                    if (res.length > 0) {
                        setActivitiesState(uniqBy(
                            [...activitiesState, ...streamedActivities, ...res],
                            "id"
                        ));
                    }
                }
            }
        )
    };

    let filteredActivities = activitiesState;

    const styles = {
        timeline: {
            color: "rgb(255, 255, 255, 0.7)",
            fontSize: 12,
            margin: "15px 0 10px 0",
            ...(dir === "rtl" && { textAlign: "right" })
        }
    };

    return (
        <div style={styles.timelineWrapper}>
            {
                size(filteredActivities) ?
                    <>
                        <Typography style={styles.timeline}>
                            <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.title"} />
                        </Typography>
                        {Object.values(filteredActivities)
                            .sort((a, b) => {
                                return moment.utc(b.published) - moment.utc(a.published);
                            })
                            .map((activity, index) => {
                                return <TimelineCard
                                    key={index}
                                    captured={filteredActivities.length - index}
                                    canExpand={canExpand}
                                    event={event}
                                    dir={dir}
                                    geometry={activity.geometry}
                                    handleCardExpand={handleCardExpand}
                                    timeline={activity}
                                    open={open === activity.id}
                                    selectedDetection={selectedDetection}
                                />
                            })
                        }
                    </> : <></>
            }
        </div>
    )
};

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;