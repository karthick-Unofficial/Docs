import React, { useState } from "react";
import { Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";

import AlertCard from "./AlertCard";
import Timeline from "./Timeline";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const GateRunner = ({
    canExpand,
    selectedAlert,
    event,
    geometry,
    hotlist,
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

    const generateHotList = (hotlist ?
        <>
            <Typography style={styles.timeline}>
                <Translate value={"global.profiles.widgets.gateRunnerWidget.gateRunner.chooseAlert"} />
            </Typography>
            {
                hotlist.map((lprAlert, index) => {
                    return <>
                        <AlertCard
                            lprAlert={lprAlert}
                            handleSelectAlert={handleSelectAlert}
                            dir={dir}
                        />
                        {index !== hotlist.length - 1 ? <Divider style={{ borderColor: "#494D53" }} /> : null}
                    </>
                })
            }
        </> : <></>
    );

    return selectedAlert ? (
        <>
            <AlertCard
                selectedAlert={selectedAlert}
                dir={dir}
            />
            {selectedAlert.timeline &&
                <>
                    <Typography style={styles.timeline}>
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.gateRunner.timeline"} />
                    </Typography>
                    {selectedAlert.timeline.map((data, index) => {
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
        </>
    ) : generateHotList
};

GateRunner.propTypes = propTypes;
GateRunner.defaultProps = defaultProps;

export default GateRunner;