import React, { Fragment, useEffect, useState } from "react";
import { IconButton, SvgIcon } from "@mui/material";
import { mdiArrowExpand } from '@mdi/js';
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";
import { eventService } from "client-app-core";
import { useSelector } from "react-redux";
import { contextById } from "orion-components/ContextualData/Selectors";

import ActivityCard from "./components/ActivityCard";
import ActivityHotList from "./components/ActivityHotList";
import Timeline from "./components/Timeline";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const GateRunnerResponseWidget = ({
    event,
    selectWidget,
    selected,
    order,
    enabled,
    widgetsExpandable,
    dir,
    detections,
    unsubscribeFromFeed,
    subscriberRef
}) => {
    const dispatch = useDispatch();
    const [selectedDetection, setSelectedDetection] = useState(null);

    const context = useSelector(state => selectedDetection && contextById(selectedDetection.CarNumber)(state));
    const activities = context && context.activities;
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

    useEffect(() => {
        if (selectedPlate) {
            setDetection(selectedPlate);
        }
    }, []);

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

    return selected || !enabled ? (
        <Fragment />
    ) : (
        <div className={`widget-wrapper collapsed ${"index-" + order} `} style={{ padding: 20 }}>
            <div className="widget-header">
                <div className="cb-font-b2" style={{ fontSize: 15 }}>
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
                        dir={dir}
                    />
                    <Timeline
                        canExpand={true}
                        event={event}
                        dir={dir}
                        selectedDetection={selectedDetection}
                        activities={activities}
                        unsubscribeFromFeed={unsubscribeFromFeed}
                        subscriberRef={subscriberRef}
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

export default GateRunnerResponseWidget;