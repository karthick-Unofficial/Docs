import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Typography, ListItem } from "@mui/material";
import { Translate } from "orion-components/i18n";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const useStyles = makeStyles({
    root: {
        "&:hover": {
            backgroundColor: "#464a50"
        }
    }
});

const AlertCard = ({
    lprAlert,
    selectedAlert,
    handleSelectAlert,
    dir
}) => {
    const classes = useStyles();

    const styles = {
        alertCardWrapper: {
            padding: "0px 6px",
            ...(dir === "rtl" && { direction: "rtl" }),
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
            ...(dir === "rtl" && { margin: "5px 25px 5px 0px" }),
            ...(dir === "ltr" && { margin: "5px 0 5px 25px" })
        },
        vehicleImgDiv: {
            height: "80px",
            display: "flex",
            justifyContent: "center"
        },
        selectedGateWrapper: {
            width: "45%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            ...(dir === "rtl" && { paddingRight: "15px", textAlign: "right" }),
            ...(dir === "ltr" && { paddingLeft: "15px" })
        }
    };

    return (selectedAlert ?
        <>
            <ListItem
                style={styles.alertCardWrapper}
            >
                <div style={styles.lprCard}>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"Liscence Plate"} style={styles.img} src={selectedAlert.plate_img} />
                    </div>
                    <Typography style={styles.gate}>{selectedAlert.plate_number}</Typography>
                </div>
                <div style={styles.selectedGateWrapper}>
                    <Typography style={{ fontSize: "12px", color: "#fff", lineHeight: "unset", paddingBottom: "10px" }}>{selectedAlert.gate}</Typography>
                    <Typography style={{ color: "rgb(255, 255, 255, 0.5)", fontSize: 9, lineHeight: "unset" }}>
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.alertCard.elapsedTime"} />
                    </Typography>
                    <Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>1m 7s</Typography>
                </div>
            </ListItem>
        </>
        :
        <>
            <ListItem
                button={true}
                onClick={() => handleSelectAlert(lprAlert.id)}
                style={styles.alertCardWrapper}
                classes={{ root: classes.root }}
            >
                <div style={styles.lprCard}>
                    <Typography style={styles.gate}>{lprAlert.gate}</Typography>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"Liscence Plate"} style={styles.img} src={lprAlert.plate_img} />
                    </div>
                    <Typography style={styles.gate}>{lprAlert.plate_number}</Typography>
                    <Typography style={styles.timeAgo}>{lprAlert.timeAgo}</Typography>
                </div>
                <div style={styles.vechicleImgWrapper}>
                    <div style={styles.vehicleImgDiv}>
                        <img alt={"Gate Runner Vehicle"} style={styles.img} src={lprAlert.plate_img} />
                    </div>
                </div>
            </ListItem>
        </>
    )
};

AlertCard.propTypes = propTypes;
AlertCard.defaultProps = defaultProps;

export default AlertCard;