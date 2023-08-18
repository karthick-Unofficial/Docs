import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Typography, ListItem } from "@mui/material";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import { useSelector } from "react-redux";

import ElapsedTimer from "./ElapsedTimer";

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

const ActivityCard = ({
    detection,
    selectedDetection,
    handleSelectAlert,
    dir,
    initialActivityDate
}) => {
    const classes = useStyles();
    const locale = useSelector(state => state.i18n.locale);

    const styles = {
        activityCardWrapper: {
            padding: "0px 6px",
            ...(dir === "rtl" && { direction: "rtl" }),
            ...(selectedDetection ? { padding: 0, marginBottom: 20 } : { padding: "15px" })
        },
        lprCard: {
            textAlign: "center",
            ...(selectedDetection ? { width: "55%", background: "#1f1f21", padding: "5px 15px" } : { width: "45%" })
        },
        gate: {
            ...(selectedDetection ? { fontSize: 14 } : { fontSize: 12 }),
            color: "#fff",
            lineHeight: "unset",
            textTransform: "uppercase"
        },
        lprImageWrapper: {
            margin: "5px 0",
            border: "1px solid #fff",
            ...(selectedDetection ? { height: "45px", } : { height: "40px" })
        },
        img: {
            height: "100%",
            width: "100%"
        },
        timeAgo: {
            fontSize: 10,
            color: "#fff",
            lineHeight: "unset"
        },
        vechicleImgWrapper: {
            minHeight: "100%",
            width: "52%",
            ...(dir === "rtl" && { margin: "5px 25px 5px 0px" }),
            ...(dir === "ltr" && { margin: "5px 0 5px 25px" })
        },
        vehicleImgDiv: {
            height: "80px",
            display: "flex",
            justifyContent: "center"
        },
        selectedGateWrapper: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            ...(dir === "rtl" && { paddingRight: "15px", textAlign: "right" }),
            ...(dir === "ltr" && { paddingLeft: "15px" })
        }
    };

    moment.relativeTimeThreshold("ss", 0);

    return (selectedDetection ?
        <>
            <ListItem
                style={styles.activityCardWrapper}
            >
                <div style={styles.lprCard}>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"Liscence Plate"} style={styles.img} src={`data:image/jpeg;base64,${selectedDetection.plateImage}`} />
                    </div>
                    <Typography style={styles.gate}>{selectedDetection.CarNumber}</Typography>
                </div>
                <div style={styles.selectedGateWrapper}>
                    <Typography style={{ fontSize: "14px", color: "#fff", lineHeight: "unset", paddingBottom: "10px", textTransform: "uppercase" }}>{selectedDetection.CameraName}</Typography>
                    <Typography style={{ color: "#B4B8BC", fontSize: 10, lineHeight: "unset" }}>
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.activityCard.elapsedTime"} />
                    </Typography>
                    {initialActivityDate ? <ElapsedTimer initialActivityDate={initialActivityDate} /> : <Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>0m 00s</Typography>}
                </div>
            </ListItem>
        </>
        :
        <>
            <ListItem
                button={true}
                onClick={() => handleSelectAlert(detection.CarNumber)}
                style={styles.activityCardWrapper}
                classes={{ root: classes.root }}
            >
                <div style={styles.lprCard}>
                    <Typography style={styles.gate}>{detection.CameraName}</Typography>
                    <div style={styles.lprImageWrapper}>
                        <img alt={"Liscence Plate"} style={styles.img} src={`data:image/jpeg;base64,${detection.plateImage}`} />
                    </div>
                    <Typography style={styles.gate}>{detection.CarNumber}</Typography>
                    <Typography style={styles.timeAgo}>{moment(detection.CaptureDateTime).locale(locale).fromNow()}</Typography>
                </div>
                <div style={styles.vechicleImgWrapper}>
                    <div style={styles.vehicleImgDiv}>
                        <img alt={"Gate Runner Vehicle"} style={styles.img} src={`data:image/jpeg;base64,${detection.carImage}`} />
                    </div>
                </div>
            </ListItem>
        </>
    )
};

ActivityCard.propTypes = propTypes;
ActivityCard.defaultProps = defaultProps;

export default ActivityCard;