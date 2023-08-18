import React, { useState } from "react";
import { Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";

import ActivityCard from "./ActivityCard";
import Timeline from "./Timeline";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const GateRunner = ({
    canExpand,
    selectedDetection,
    event,
    geometry,
    detections,
    handleSelectAlert,
    dir
}) => {

    const [open, setOpen] = useState(null);

    const handleCardExpand = id => {
        setOpen(open === id ? null : id);
    };

    const styles = {
        timeline: {
            color: "rgb(255, 255, 255, 0.7)",
            fontSize: 12,
            margin: "15px 0 10px 0",
            ...(dir === "rtl" && { textAlign: "right" })
        }
    }

    const generateHotList = (detections ?
        <div style={{ maxHeight: 540, overflowY: "scroll" }}>
            <Typography style={styles.timeline}>
                <Translate value={"global.profiles.widgets.gateRunnerWidget.gateRunner.chooseAlert"} />
            </Typography>
            {
                detections.map((detection, index) => {
                    return <>
                        <ActivityCard
                            detection={detection}
                            handleSelectAlert={handleSelectAlert}
                            dir={dir}
                        />
                        {index !== detections.length - 1 ? <Divider style={{ borderColor: "#494D53" }} /> : null}
                    </>
                })
            }
        </div> : <></>
    );

    return selectedDetection ? (
        <div style={{ maxHeight: 540, overflowY: "scroll" }}>
            <ActivityCard
                selectedDetection={selectedDetection}
                dir={dir}
            />
            {selectedDetection.timeline &&
                <>
                    <Typography style={styles.timeline}>
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.gateRunner.timeline"} />
                    </Typography>
                    {selectedDetection.timeline.map((data, index) => {
                        return <Timeline
                            key={index}
                            canExpand={canExpand}
                            event={event}
                            dir={dir}
                            geometry={geometry}
                            handleCardExpand={handleCardExpand}
                            timeline={data}
                            open={open === data.id}
                        />
                    })
                    }
                </>
            }
        </div>
    ) : generateHotList
};

GateRunner.propTypes = propTypes;
GateRunner.defaultProps = defaultProps;

export default GateRunner;