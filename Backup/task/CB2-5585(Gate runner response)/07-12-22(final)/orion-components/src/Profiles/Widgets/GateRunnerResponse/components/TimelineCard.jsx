import React, { useEffect, useState } from "react";
import {
    Card,
    CardActions,
    ListItem,
    ListItemText,
    Collapse,
    CardContent,
    IconButton,
    Button,
    Typography,
    SvgIcon,
    Divider
} from "@mui/material";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Cancel } from "@mui/icons-material";
import size from "lodash/size";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import { mdiShieldAlert } from '@mdi/js';

import { CameraDetection, TargetObserved } from "../Icons";
import UnitCard from "./UnitCard";

const TimelineCard = ({
    canExpand,
    handleCardExpand,
    handleCardCollapse,
    dir,
    geometry,
    timeline,
    open,
    captured,
    initialActivityDate,
    attachments,
    units,
    handleNotify,
    feedSettings
}) => {
    const [carImage, setCarImage] = useState(null);

    const backgroundColor = open ? "#464A50" : "#333639";
    const recommendationsIds = units && units.map((unit) => unit.recommendationId);

    useEffect(() => {
        if (attachments) {
            const filteredImage = attachments.filter((attachment) => attachment.filename.includes("car")).map((filteredAttachment) => filteredAttachment.handle);
            setCarImage(`/_download?handle=${filteredImage}`);
        }
    }, [attachments]);

    const styles = {
        marginAuto: {
            ...(dir === "ltr" && { marginLeft: "auto" }),
            ...(dir === "rtl" && { marginRight: "auto" })
        },
        card: {
            backgroundColor,
            borderRadius: 8,
            marginBottom: 12,
            boxShadow: "unset"

        },
        cardExpand: {
            padding: "0px 6px",
            minHeight: 48,
            ...(dir === "rtl" && { direction: "rtl" })
        },
        listItemText: {
            padding: 0,
            direction: "ltr",
            fontSize: 14,
            ...(dir === "rtl" && { textAlign: "right" })
        },
        indicator: {
            width: "25px",
            height: "25px",
            border: "1.5px solid #fff",
            background: "#D3615C",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 10px",
            fontSize: 16,
            color: "#fff"
        },
        img: {
            width: "280px",
            height: "160px"
        },
        collapse: {
            paddingBottom: 15
        },
        divider: {
            borderColor: "rgb(70, 74, 80, 0.7",
            ...(dir === "rtl" && { margin: "0 50px 0 15px" }),
            ...(dir === "ltr" && { margin: "0 15px 0 50px" })
        },
        recommendations: {
            border: "1px solid rgba(255, 255, 255, 0.3)",
            minHeight: "130px",
            borderRadius: "6px",
            margin: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        detectionIcon: {
            height: 24,
            ...(dir === "rtl" && { marginLeft: 25 }),
            ...(dir === "ltr" && { marginRight: 25 })
        },
        detectionStatus: {
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.7)",
            padding: 5,
            border: "1px solid",
            margin: 15,
            borderRadius: "5px",
            background: "rgb(51, 54, 57)",
            borderColor: "rgba(255, 255, 255, 0.5)",
            height: "60px"
        }
    };

    moment.locale("en");

    const startDateTime = moment(initialActivityDate).format('YYYY/MM/DD hh:mm:ss');
    const activityDateTime = moment(timeline.activityDate).format('YYYY/MM/DD hh:mm:ss');
    const timediff = moment(activityDateTime, 'YYYY/MM/DD hh:mm:ss').diff(moment(startDateTime, 'YYYY/MM/DD hh:mm:ss'));
    const minutesPassed = moment.utc(timediff).format('m');
    const secondsPassed = moment.utc(timediff).format('s');
    const hoursPassed = moment().diff(initialActivityDate, 'hours');

    const getDetectionIcon = () => {
        switch (timeline.type) {
            case "camera-detection":
                return <CameraDetection />;
            case "manual-location":
                return <TargetObserved />;
            case "unit-status-change":
                return (
                    <SvgIcon style={{ width: "24px", height: "24px", color: "#FFFFFF" }}>
                        <path d={mdiShieldAlert} />
                    </SvgIcon>
                );
            default:
                break;
        }
    };

    const generateUnitList = (
        size(units) && units.map((unit, index) => {
            return <>
                <UnitCard
                    unit={unit}
                    unitDataId={unit.id}
                    dir={dir}
                    feedSettings={feedSettings}
                    handleNotify={handleNotify}
                />
                {index !== units.length - 1 ? <Divider style={styles.divider} /> : null}
            </>
        })
    );

    return (
        <>
            <Card style={styles.card}>
                <ListItem
                    button={canExpand && !open}
                    onClick={() => !open && handleCardExpand(timeline.id)}
                    style={styles.cardExpand}
                >
                    <TargetingIcon geometry={geometry} />
                    <div style={styles.indicator}>{captured}</div>
                    <div style={styles.detectionIcon}>
                        {getDetectionIcon()}
                    </div>
                    <ListItemText
                        style={styles.listItemText}
                        primary={hoursPassed > 0 ? `+ ${hoursPassed}h ${minutesPassed}m ${secondsPassed}s` : Number(minutesPassed) > 0 ? `+ ${minutesPassed}m ${secondsPassed}s` : `+ ${secondsPassed}s`}
                        primaryTypographyProps={{
                            noWrap: true,
                            variant: "body1"
                        }}
                    />
                    {open && (
                        <IconButton onClick={() => handleCardCollapse()}>
                            <Cancel />
                        </IconButton>
                    )}
                </ListItem>
                <Collapse unmountOnExit in={open} style={styles.collapse}>
                    <CardContent style={{ padding: 0 }}>
                        {
                            timeline.type === "camera-detection" ?
                                <div div style={{ padding: "0 15px" }}>
                                    <img alt={"Gate Runner Vehicle"} style={styles.img} src={carImage} />
                                </div> :
                                timeline.type === "manual-location" ?
                                    <div style={styles.detectionStatus}>
                                        <TargetingIcon geometry={geometry} />
                                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.targetObserved"} />
                                    </div> :
                                    timeline.type === "unit-status-change" ?
                                        <div style={{ ...styles.detectionStatus, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {timeline.summary}
                                        </div> :
                                        <div></div>
                        }
                    </CardContent>
                    {units && size(units) ?
                        <>
                            <CardActions style={{ backgroundColor, padding: "0px" }}>
                                <div style={styles.marginAuto}>
                                    <Button
                                        color="primary"
                                        style={{ textTransform: "none", fontSize: 12, minWidth: "unset", padding: "6px 15px", color: "#4BAEE8" }}
                                        onClick={() => handleNotify(recommendationsIds)}
                                    >
                                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.notifyAll"} />
                                    </Button>

                                </div>
                            </CardActions>
                            {generateUnitList}
                        </>
                        :
                        <div style={styles.recommendations}>
                            <Typography style={{ color: "#fff", fontSize: 12 }}>
                                <Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.generatingRec"} />
                            </Typography>
                        </div>
                    }
                </Collapse >
            </Card >
        </>
    )
};

export default TimelineCard;