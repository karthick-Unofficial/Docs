import { Typography, Divider } from "@mui/material";
import React, { Fragment } from "react";
import AlertCard from "./AlertCard";

const propTypes = {
};

const defaultProps = {
};

const AlertHotList = ({ selected, enabled, alerts, selectedAlert, canExpand, expanded }) => {

    return selectedAlert ? (
        <AlertCard selectedAlert={selectedAlert} />
    ) : (
        <>
            <Typography style={{ color: "rgb(255, 255, 255, 0.7)", fontSize: 12, margin: "15px 0 10px 0" }}>Choose from LPR Alert Hot List</Typography>
            {
                alerts && alerts.map((data, index) => {
                    return <>
                        <AlertCard data={data} />
                        {index !== alerts.length - 1 ? <Divider style={{ borderColor: "#494D53" }} /> : null}
                    </>
                })
            }
        </>
    );
};

AlertHotList.propTypes = propTypes;
AlertHotList.defaultProps = defaultProps;

export default AlertHotList;