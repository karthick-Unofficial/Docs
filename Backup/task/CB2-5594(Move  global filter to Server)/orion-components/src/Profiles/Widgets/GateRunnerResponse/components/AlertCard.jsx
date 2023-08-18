import React from "react";
import { Typography } from "@mui/material";
import Timeline from "./Timeline";

const propTypes = {

};

const defaultProps = {

};

const AlertCard = ({ data, selectedAlert, canExpand, expanded, handleSelectAlert, event, dir, handleCardExpand, geometry, dyessData }) => {

    const styles = {
        alertCardWrapper: {
            display: "flex",
            ...(selectedAlert ? { padding: 0, marginBottom: 20 } : { padding: "15px" })
        },
        lprCard: {
            textAlign: "center",
            ...(selectedAlert ? { width: "55%", background: "#1f1f21", padding: "5px 15px" } : { width: "45%" })
        },
        gate: {
            ...(selectedAlert ? { fontSize: 15 } : { fontSize: 12 }),
            color: "#fff",
            lineHeight: "unset"
        },
        lprImageWrapper: {
            margin: "5px 0",
            border: "1px solid #fff",
            ...(selectedAlert ? { height: "45px", } : { height: "40px" })
        },
        img: {
            height: "100%",
            width: "100%"
        },
        timeAgo: {
            fontSize: 11,
            color: "rgb(255, 255, 255, 0.7)",
            lineHeight: "unset"
        },
        vechicleImgWrapper: {
            minHeight: "100%",
            width: "55%",
            margin: "5px 0 5px 25px"
        },
        vehicleImgDiv: {
            height: "50px",
            minHeight: "100%",
            width: "100%"
        },
        selectedGateWrapper: {
            width: "45%",
            paddingLeft: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }
    }

    return (selectedAlert ?
        <>
            <div className="alertCard_wrapper" style={styles.alertCardWrapper}>
                <div style={styles.lprCard}>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"liscence_plate"} style={styles.img} src={selectedAlert.plate_img} />
                    </div>
                    <Typography style={styles.gate}>{selectedAlert.plate_number}</Typography>
                </div>
                <div style={styles.selectedGateWrapper}>
                    <Typography style={{ fontSize: "12px", color: "#fff", lineHeight: "unset", paddingBottom: "10px;" }}>{selectedAlert.gate}</Typography>
                    <Typography style={{ color: "rgb(255, 255, 255, 0.5)", fontSize: 9, lineHeight: "unset" }}>Elapsed Time</Typography>
                    <Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>1m 7s</Typography>
                </div>
            </div>
            <Timeline
                canExpand={canExpand}
                expanded={expanded}
                event={event}
                dir={dir}
                geometry={geometry}
                handleCardExpand={handleCardExpand}
                units={dyessData[0].units}
            />
        </>
        :
        <>
            <div className="alertCard_wrapper" style={styles.alertCardWrapper} onClick={() => handleSelectAlert()}>
                <div className="lpr_details" style={styles.lprCard}>
                    <Typography style={styles.gate}>{data.gate}</Typography>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"liscence_plate"} style={styles.img} src={data.plate_img} />
                    </div>
                    <Typography style={styles.gate}>{data.plate_number}</Typography>
                    <Typography style={styles.timeAgo}>{data.timeAgo}</Typography>
                </div>
                <div style={styles.vechicleImgWrapper}>
                    <div style={styles.vehicleImgDiv}>
                        <img alt={"vehicle_img"} style={styles.img} src={data.plate_img} />
                    </div>
                </div>
            </div>
        </>
    )
};

AlertCard.propTypes = propTypes;
AlertCard.defaultProps = defaultProps;

export default AlertCard;