import React, { Fragment, useState } from "react";
import { IconButton, SvgIcon } from "@mui/material";
import { mdiArrowExpand } from '@mdi/js';
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";

import GateRunner from "./components/GateRunner";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const GateRunnerResponseWidget = ({
    event,
    selectWidget,
    geometry,
    selected,
    order,
    enabled,
    widgetsExpandable,
    dir,
    detections
}) => {
    const dispatch = useDispatch();

    const [selectedDetection, setSelectedDetection] = useState(null);

    const handleExpand = () => {
        dispatch(selectWidget("GateRunnerResponse"));
    };

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
        detections.filter(detection => {
            if (detection.CarNumber === id) {
                setSelectedDetection(detection);
            }
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
            <GateRunner
                canExpand={true}
                selectedDetection={selectedDetection}
                event={event}
                geometry={geometry}
                detections={detections}
                handleSelectAlert={handleSelectAlert}
                dir={dir}
            />
        </div>
    );
};

GateRunnerResponseWidget.propTypes = propTypes;
GateRunnerResponseWidget.defaultProps = defaultProps;

export default GateRunnerResponseWidget;