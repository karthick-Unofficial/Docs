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
import PropTypes from "prop-types";
import { Cancel } from "@mui/icons-material";
import size from "lodash/size";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import { mdiShieldAlert } from '@mdi/js';

import { CameraDetection, TargetObserved } from "../Icons";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};

const TimelineCard = ({
    canExpand,
    handleCardExpand,
    event,
    dir,
    geometry,
    timeline,
    open,
    captured,
    initialActivityDate,
    attachments,
    units,
    handleNotify
}) => {
    const [carImage, setCarImage] = useState(null);

    const { id, feedId } = event;
    const backgroundColor = open ? "#464a50" : "#333639";
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
            ...(dir === "rtl" && { textAlign: "right" })
        },
        indicator: {
            width: "24px",
            height: "24px",
            border: "2px solid #fff",
            background: "#e85858",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 10px",
            fontSize: 14
        },
        img: {
            width: "100%",
            height: "100%"
        },
        collapse: {
            paddingBottom: 15
        },
        divider: {
            borderColor: "rgb(70, 74, 80, 0.7",
            ...(dir === "rtl" && { margin: "0 50px 0 15px" }),
            ...(dir === "ltr" && { margin: "0 15px 0 50px" })
        },
        unitCard: {
            padding: "0px 10px",
            minHeight: 40,
            ...(dir === "rtl" && { direction: "rtl" })
        },
        unitListItemText: {
            ...(dir === "rtl" && { padding: "0 5px 0 0", textAlign: "right" }),
            ...(dir === "ltr" && { padding: "0 0 0 5px" })
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
            height: "50px"
        }
    };

    const generateUnitList = (
        size(units) && units.map((unit, index) => {
            return <>
                <ListItem
                    style={styles.unitCard}
                >
                    <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                    <ListItemText
                        style={styles.unitListItemText}
                        primary={
                            <>
                                <Typography style={{ fontSize: 12, lineHeight: 1.3 }}>{unit.name}</Typography>
                                <Typography style={{ fontSize: 10, lineHeight: 1 }}>{unit.name}</Typography>
                            </>
                        }
                        primaryTypographyProps={{
                            noWrap: true,
                            variant: "body1"
                        }}

                    />
                    <Button
                        color="primary"
                        style={{ textTransform: "none", fontSize: 10, minWidth: "unset", padding: "6px 5px" }}
                        onClick={() => handleNotify([unit.recommendationId])}
                    >
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.notify"} />
                    </Button>
                </ListItem>
                {index !== units.length - 1 ? <Divider style={styles.divider} /> : null}
            </>
        })
    );
    moment.locale("en");

    const startDateTime = moment(initialActivityDate).format('YYYY/MM/DD hh:mm:ss');
    const activityDateTime = moment(timeline.activityDate).format('YYYY/MM/DD hh:mm:ss');
    const timediff = moment(activityDateTime, 'YYYY/MM/DD hh:mm:ss').diff(moment(startDateTime, 'YYYY/MM/DD hh:mm:ss'));
    const minutesPassed = moment.utc(timediff).format('m');
    const secondsPassed = moment.utc(timediff).format('s');

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

    return (
        <>
            <Card style={styles.card}>
                <ListItem
                    button={canExpand}
                    onClick={() => handleCardExpand(timeline.id)}
                    style={styles.cardExpand}
                >
                    <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                    <div style={styles.indicator}>{captured}</div>
                    <div style={styles.detectionIcon}>
                        {getDetectionIcon()}
                    </div>
                    <ListItemText
                        style={styles.listItemText}
                        primary={Number(minutesPassed) > 0 ? `+ ${minutesPassed}m ${secondsPassed}s` : `+ ${secondsPassed}s`}
                        primaryTypographyProps={{
                            noWrap: true,
                            variant: "body1"
                        }}
                    />
                    {open && (
                        <IconButton>
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
                                        <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.targetObserved"} />
                                    </div> :
                                    timeline.type === "unit-status-change" ?
                                        <div style={styles.detectionStatus}>
                                            [Unit] status changed to [Status]
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
                                        style={{ textTransform: "none", fontSize: 12, minWidth: "unset", padding: "6px 15px" }}
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


TimelineCard.propTypes = propTypes;
TimelineCard.defaultProps = defaultProps;

export default TimelineCard;