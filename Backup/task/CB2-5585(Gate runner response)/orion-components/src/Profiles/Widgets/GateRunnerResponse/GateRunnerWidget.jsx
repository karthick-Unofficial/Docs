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

const dyessData = {
    "lprAlerts": [
        {
            "id": "1",
            "gate": "ARNOLD GATE",
            "plate_number": "TEXAS HVT 1972",
            "timeAgo": "12 secs ago",
            "plate_img": "https://localhost/_download?handle=14be24a0-5c09-11ed-ade7-f74776e919bf",
            "timeline": [
                {
                    "id": "1",
                    "captured": "1",
                    "capturedTime": "+35s",
                    "units": [
                        {
                            "unit": "POLICE 1",
                            "gate": "Arnold Blvd/Traffic Circle"
                        },
                        {
                            "unit": "POLICE 2",
                            "gate": "Traffic Circle / Diversion Ditch Rd"
                        },
                        {
                            "unit": "POLICE 3",
                            "gate": "Remain mobile / Ready to Respond"
                        },
                        {
                            "unit": "KILO UNIT",
                            "gate": "Base Medical Clinic"
                        },
                        {
                            "unit": "SECURITY 1",
                            "gate": "Close Flight Line Gates"
                        }
                    ]
                },
                {
                    "id": "2",
                    "captured": "2",
                    "capturedTime": "+1m 3s",
                    "units": [
                        {
                            "unit": "SECURITY 2",
                            "gate": "Gate 22 (FD)"
                        },
                        {
                            "unit": "SECURITY 3",
                            "gate": "Gate 17 (DCC)"
                        }
                    ]
                },
                {
                    "id": "3",
                    "captured": "3",
                    "capturedTime": "+1m 48s",
                    "units": [
                        {
                            "unit": "SECURITY 8",
                            "gate": "Gate 100 (CD)"
                        },
                        {
                            "unit": "SECURITY 9",
                            "gate": "Gate 82 (BCC)"
                        }
                    ]
                }
            ],
        },
        {
            "id": "2",
            "gate": "ARNOLD GATE",
            "plate_number": "TEXAS GP6 26L",
            "timeAgo": "14 secs ago",
            "plate_img": "https://localhost/_download?handle=a80acee0-64cc-11ed-9e34-afcd40cb91cf"
        },
        {
            "id": "3",
            "gate": "DELAWARE GATE",
            "plate_number": "FLORIDA 515 KXV",
            "timeAgo": "15 secs ago",
            "plate_img": "https://localhost/_download?handle=d2f0dd20-64cc-11ed-9e34-afcd40cb91cf"
        }
    ]
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
    const dispatch = useDispatch();

    const [selectedAlert, setSelectedAlert] = useState(null);

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
        dyessData.lprAlerts.filter(alert => {
            if (alert.id === id) {
                setSelectedAlert(alert);
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
                selectedAlert={selectedAlert}
                event={event}
                geometry={geometry}
                hotlist={dyessData.lprAlerts}
                handleSelectAlert={handleSelectAlert}
                dir={dir}
            />
        </div>
    );
};

GateRunnerWidget.propTypes = propTypes;
GateRunnerWidget.defaultProps = defaultProps;

export default GateRunnerWidget;