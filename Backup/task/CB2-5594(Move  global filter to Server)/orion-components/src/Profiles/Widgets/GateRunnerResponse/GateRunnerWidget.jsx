import React, { Fragment, useState } from "react";
import { IconButton, SvgIcon } from "@mui/material";
import { mdiArrowExpand } from '@mdi/js';
import { useDispatch } from "react-redux";
import GateRunnerView from "./components/GateRunnerView";

const propTypes = {
};

const defaultProps = {
};

const GateRunnerWidget = ({
    event,
    selectWidget,
    geometry,
    selected,
    order,
    enabled,
    widgetsExpandable,
    dir
}) => {
    const [open, setOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const dispatch = useDispatch();

    const handleExpand = () => {
        dispatch(selectWidget("GateRunnerResponse"));
    };

    const handleCardExpand = () => {
        setOpen(!open);
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

    const handleSelectAlert = () => {
        setSelectedAlert(dyessData.lprAlerts[0]);
    };

    return selected || !enabled ? (
        <Fragment />
    ) : (
        <div className={`widget-wrapper collapsed ${"index-" + order} `} style={{ padding: 20 }}>
            <div className="widget-header">
                <div className="cb-font-b2" style={{ fontSize: 15 }}>
                    Gate Runner Response
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
            <GateRunnerView
                canExpand={true}
                expanded={open}
                selectedAlert={selectedAlert}
                event={event}
                geometry={geometry}
                dyessData={dyessData.lprAlerts}
                handleCardExpand={handleCardExpand}
                handleSelectAlert={handleSelectAlert}
                dir={dir}
            />
        </div>
    );
};

GateRunnerWidget.propTypes = propTypes;
GateRunnerWidget.defaultProps = defaultProps;

export default GateRunnerWidget;