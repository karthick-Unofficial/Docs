import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import size from "lodash/size";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { startGateRunnerActivityStream, startAttachmentStream } from "orion-components/ContextualData/Actions";
import { useDispatch, useSelector } from "react-redux";
import { brcService, eventService } from "client-app-core";
import { mapObject } from "orion-components/AppState/Selectors";
import { contextById } from "orion-components/ContextualData/Selectors";
import { getAllUnits } from "orion-components/GlobalData/Units/selectors";
import { subscribeUnitMembers } from "orion-components/GlobalData/Actions";
// import { getUnassignedMembers } from "orion-components/GlobalData/Selectors";

import TimelineCard from "./TimelineCard";
import { TargetObserved } from "../Icons";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const Timeline = (props) => {
    const {
        canExpand,
        event,
        dir,
        selectedDetection,
        activities,
        unsubscribeFromFeed,
        subscriberRef,
        getActivities,
        filterOptions,
        initialActivityDate,
        recentActivityId
        // feedSettings
    } = props;
    const id = event.id;

    const dispatch = useDispatch();

    const [open, setOpen] = useState(null);
    const [recommendedUnit, setRecommendedUnit] = useState([]);
    const [mapSelectionMode, setMapSelectionMode] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    const activityId = open;
    let attachments = [];

    const map = useSelector(state => mapObject(state));
    const context = useSelector(state => contextById(activityId)(state));
    const units = useSelector(state => getAllUnits(state));
    // const getUnassignedMembersData = getUnassignedMembers();
    // const unAssignedMembers = useSelector(state => getUnassignedMembersData(state, feedSettings));

    if (context) {
        attachments = context.attachments;
    }

    const handleCardExpand = id => {
        if (open === id) {
            setOpen(null);
            // handleUnsubscribe();
        } else {
            setOpen(id);
            dispatch(startAttachmentStream(id, "profile"));
            streamRecommendations(id);
        }
    };

    const toggleMapSelection = () => {
        setMapSelectionMode(!mapSelectionMode);
    };

    const streamRecommendations = (activityId) => {
        brcService.streamRecommendations(activityId, (err, response) => {
            if (err) console.log(err);
            if (response) {
                switch (response.type) {
                    case "initial":
                    case "add":
                        setRecommendations([...recommendations, response.new_val]);
                        break;
                    default:
                        break;
                }
            }
        });
    };

    // const handleUnsubscribe = () => {
    //     if (context && activityId) {
    //         const { subscriptions } = context;
    //         Object.keys(subscriptions).forEach(subscription =>
    //             dispatch(unsubscribeFromFeed(activityId, subscription, "dock"))
    //         );
    //     }
    // };

    const handleNotify = (recommendationIds) => {
        brcService.notifyRecommendations(recommendationIds, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log("???", res);
            }
        })
    };

    useEffect(() => {
        getActivities();
        dispatch(startGateRunnerActivityStream(id, "event", filterOptions, subscriberRef));
        dispatch(subscribeUnitMembers());

        return () => {
            if (unsubscribeFromFeed)
                dispatch(unsubscribeFromFeed(id, "activities", subscriberRef));
        };
    }, []);

    useEffect(() => {
        if (map && mapSelectionMode) {
            map.once("click", e => {
                const coords = [e.lngLat.lng, e.lngLat.lat];
                eventService.generateLocationActivity(id, coords, null, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                })
                setMapSelectionMode(false);
            });
        }
    }, [mapSelectionMode]);

    useEffect(() => {
        if (recentActivityId) {
            handleCardExpand(recentActivityId);
        }
    }, [recentActivityId]);

    useEffect(() => {
        recommendations.map((recommendation) => {
            const unitId = recommendation.unitId;
            const unit = units[unitId];
            unit["recommendationId"] = recommendation.id;
            setRecommendedUnit([...recommendedUnit, unit]);
        })
    }, [recommendations]);

    useEffect(() => {
        setRecommendations([]);
        setRecommendedUnit([]);
    }, [open]);


    const styles = {
        timeline: {
            color: "rgb(255, 255, 255, 0.7)",
            fontSize: 12,
            margin: "15px 0 10px 0",
            width: "50%",
            ...(dir === "rtl" && { textAlign: "right" })
        },
        targetWrapper: {
            display: "flex",
            direction: dir
        },
        targetObserved: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "50%",
            ...(!mapSelectionMode && { color: "rgb(255, 255, 255, 0.7)" })
        },
        typography: {
            color: "inherit",
            fontSize: 12,
            ...(dir === "rtl" && { marginRight: 10 }),
            ...(dir === "ltr" && { marginLeft: 10 })
        }
    };

    return (
        <div style={styles.timelineWrapper}>
            {size(activities) ?
                <>
                    <div style={styles.targetWrapper}>
                        <Typography style={styles.timeline}>
                            <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.title"} />
                        </Typography>
                        <a className="cb-font-link" style={styles.targetObserved} onClick={() => toggleMapSelection()}>
                            <TargetObserved />
                            <Typography style={styles.typography}>
                                <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.targetObserved"} />
                            </Typography>
                        </a>
                    </div>
                    {Object.values(activities)
                        .sort((a, b) => {
                            return moment.utc(b.activityDate) - moment.utc(a.activityDate);
                        })
                        .map((activity, index) => {
                            return <TimelineCard
                                key={index}
                                captured={activities.length - index}
                                canExpand={canExpand}
                                event={event}
                                dir={dir}
                                geometry={activity.geometry}
                                handleCardExpand={handleCardExpand}
                                timeline={activity}
                                open={open === activity.id}
                                initialActivityDate={initialActivityDate}
                                attachments={attachments}
                                units={recommendedUnit}
                                handleNotify={handleNotify}
                            />
                        })
                    }
                </>
                :
                <></>
            }
        </div >
    )
};

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;