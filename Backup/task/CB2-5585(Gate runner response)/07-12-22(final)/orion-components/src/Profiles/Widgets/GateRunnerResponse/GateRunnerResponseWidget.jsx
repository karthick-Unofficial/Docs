import React, { Fragment, useEffect, useState, useRef, memo } from "react";
import { eventService, activityService, unitService } from "client-app-core";
import { IconButton, SvgIcon } from "@mui/material";
import { mdiArrowExpand } from '@mdi/js';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import uniqBy from "lodash/uniqBy";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import size from "lodash/size";
import last from "lodash/last";
import { subscribeUnits } from "orion-components/GlobalData/Actions";

import ActivityCard from "./components/ActivityCard";
import ActivityHotList from "./components/ActivityHotList";
import Timeline from "./components/Timeline";

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

const collectionLocationType = { key: "interdictionPointCollection" };

const GateRunnerResponseWidget = (props) => {
    const {
        event,
        selectWidget,
        selected,
        order,
        enabled,
        widgetsExpandable,
        dir,
        detections,
        unsubscribeFromFeed,
        subscriberRef,
        activities
    } = props;
    const dispatch = useDispatch();

    const globalData = useSelector(state => state.globalData);

    const [selectedDetection, setSelectedDetection] = useState(null);
    const [activitiesState, setActivitiesState] = useState(activities || []);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [initialActivityDate, setInitialActivityDate] = useState(null);
    const [recentActivityId, setRecentActivityId] = useState(null);
    const [UnassignedFeeds, setUnassignedFeeds] = useState([]);
    const [unitSettings, setUnitSettings] = useState([]);
    const [cardCollections, setCardCollections] = useState([]);
    const [collectionDetails, setCollectionDetails] = useState([]);
    const [collection, setCollection] = useState([]);

    const selectedPlate = event.additionalProperties && event.additionalProperties.licensePlate;

    const handleExpand = () => {
        dispatch(selectWidget("Gate Runner Response"));
    };

    const setDetection = (plateNumber) => {
        detections.filter(detection => {
            if (detection.CarNumber === plateNumber) {
                setSelectedDetection(detection);
            }
        });
    };

    const handleSelectAlert = (id) => {
        setDetection(id);

        const update = {
            ...event,
            additionalProperties: {
                licensePlate: id
            }
        };
        eventService.updateEvent(event.id, update, (err, response) => {
            if (err) console.log(err);
        })
    };

    const getActivities = () => {
        const streamedActivities = activities ? activities : [];
        const sorted = activitiesState.sort((a, b) =>
            moment.utc(a.activityDate).diff(moment.utc(b.activityDate))
        );

        const date =
            sorted.length > 0 ? sorted[0].activityDate : (new Date()).toISOString();

        activityService.getActivitiesByEvent(
            event.id,
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

    const getCollections = () => {
        unitService.getAppSettingsByKey("units-app", collectionLocationType.key, (err, response) => {
            if (err) {
                console.log("ERROR:", err);
            }
            else {
                if (response.value) {

                    const { value } = response;
                    const memberData = [];
                    if (value.length > 0) {
                        value.forEach(element => {
                            const obj = {
                                members: element,
                            }
                            memberData.push(obj);
                        });
                    }
                    setCardCollections(memberData);
                }
            }
        });
    };

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

    useEffect(() => {
        const filtered = activitiesState.filter(activity => filterOptions.types.includes(activity.type));
        setFilteredActivities(filtered);

        const sortedActivities = size(filtered) && orderBy(filtered, ["activityDate"], ["asc"]);
        const firstActivity = sortedActivities[0];
        const recentActivity = last(sortedActivities);
        setInitialActivityDate(firstActivity && firstActivity.activityDate);
        setRecentActivityId(recentActivity && recentActivity.id);
    }, [activitiesState]);

    useEffect(() => {
        if (selectedPlate) {
            setDetection(selectedPlate);
        }
        dispatch(subscribeUnits());
        getCollections();

        unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", (err, response) => {
            if (err) {
                console.log("ERROR:", err);
            }
            else {
                setUnitSettings(response);
            }
        });
    }, []);

    useEffect(() => {
        if (size(unitSettings)) {
            const { value } = unitSettings;
            if (value.length > 0) {
                setUnassignedFeeds(value);
            }
        }
    }, [unitSettings]);

    useEffect(() => {
        if (cardCollections.length > 0) {
            const entityDetails = [];
            cardCollections.forEach((element) => {
                const memberId = element.members;
                entityDetails.push(globalData["collections"][memberId])
            });
            setCollectionDetails(entityDetails);
        }
    }, [cardCollections]);

    useEffect(() => {
        collectionDetails.forEach((element) => {
            setCollection([element]);
        })
    }, [collectionDetails]);

    const styles = {
        label: {
            textTransform: "none"
        },
        cameraButton: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "lighten($darkGray, 2 %)"
        },
        widgetOptionButton: {
            ...(dir === "rtl" && {
                marginRight: "auto"
            }),
            ...(dir === "ltr" && {
                marginLeft: "auto"
            })
        },
        widgetExpandButton: {
            width: "auto",
            ...(dir === "rtl" && {
                paddingLeft: 0
            }),
            ...(dir === "ltr" && {
                paddingRight: 0
            })
        }
    };


    return selected || !enabled ? (
        <Fragment />
    ) : (
        <div className={`widget-wrapper collapsed ${"index-" + order} `} style={{ padding: 15 }}>
            <div className="widget-header">
                <div className="cb-font-b2" style={{ fontSize: 14 }}>
                    <Translate value={"global.profiles.widgets.gateRunnerWidget.main.title"} />
                </div>
                <div className="widget-header-buttons">
                    {widgetsExpandable && (
                        <div className="widget-expand-button">
                            <IconButton
                                style={styles.widgetExpandButton}
                                onClick={handleExpand}
                            >
                                <SvgIcon style={{ color: "#fff" }}>
                                    <path d={mdiArrowExpand} />
                                </SvgIcon>
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
            {selectedDetection ? (
                <div style={{ maxHeight: 540, overflowY: "scroll" }}>
                    <ActivityCard
                        selectedDetection={selectedDetection}
                        activities={filteredActivities}
                        initialActivityDate={initialActivityDate}
                        dir={dir}
                    />
                    <Timeline
                        canExpand={true}
                        event={event}
                        dir={dir}
                        selectedDetection={selectedDetection}
                        activities={filteredActivities}
                        unsubscribeFromFeed={unsubscribeFromFeed}
                        subscriberRef={subscriberRef}
                        getActivities={getActivities}
                        filterOptions={filterOptions}
                        initialActivityDate={initialActivityDate}
                        recentActivityId={recentActivityId}
                        feedSettings={UnassignedFeeds}
                        collectionDetails={collectionDetails}
                        collection={collection}
                    />
                </div>
            ) : <ActivityHotList
                detections={detections}
                handleSelectAlert={handleSelectAlert}
                dir={dir} />}
        </div>
    );
};

GateRunnerResponseWidget.propTypes = propTypes;
GateRunnerResponseWidget.defaultProps = defaultProps;

export default memo(GateRunnerResponseWidget);