import React from "react";
import { Typography, Divider } from "@mui/material";
import AlertCard from "./AlertCard";

const propTypes = {
};

const defaultProps = {
};

const GateRunnerView = ({
    canExpand,
    expanded,
    selectedAlert,
    event,
    geometry,
    hotlist,
    handleCardExpand,
    handleSelectAlert,
    dir,
    open
}) => {

    const generateHotList = (
        <>
            <Typography style={{ color: "rgb(255, 255, 255, 0.7)", fontSize: 12, margin: "15px 0 10px 0" }}>Choose from LPR Alert Hot List</Typography>
            {
                hotlist && hotlist.map((lprAlert, index) => {
                    return <>
                        <AlertCard
                            lprAlert={lprAlert}
                            handleSelectAlert={handleSelectAlert}
                            event={event}
                            dir={dir}
                        />
                        {index !== hotlist.length - 1 ? <Divider style={{ borderColor: "#494D53" }} /> : null}
                    </>
                })
            }
        </>
    );

    return selectedAlert ? (
        <AlertCard
            selectedAlert={selectedAlert}
            canExpand={canExpand}
            expanded={expanded}
            event={event}
            dir={dir}
            geometry={geometry}
            timeline={selectedAlert.timeline}
            open={open}
        />
    ) : generateHotList
};

GateRunnerView.propTypes = propTypes;
GateRunnerView.defaultProps = defaultProps;

export default GateRunnerView;