import React from "react";
import {
    Card,
    CardActions,
    ListItem,
    ListItemText,
    Collapse,
    CardContent,
    Divider,
    IconButton,
    Button,
    Typography
} from "@mui/material";
import { TargetingIcon } from "orion-components/SharedComponents";
import PropTypes from "prop-types";
import { Cancel } from "@mui/icons-material";
import size from "lodash/size";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
    dir: PropTypes.string
};

const defaultProps = {
    dir: "ltr"
};


const Timeline = ({ canExpand, handleCardExpand, event, dir, geometry, timeline, open }) => {

    const { units } = timeline;
    const { id, feedId } = event;
    const backgroundColor = open ? "#464a50" : "#333639";

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
            margin: "0 10px"
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
        }
    };

    const generateUnitList = (
        units && units.map((data, index) => {
            return <>
                <ListItem
                    style={styles.unitCard}
                >
                    <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                    <ListItemText
                        style={styles.unitListItemText}
                        primary={
                            <>
                                <Typography style={{ fontSize: 12, lineHeight: 1.3 }}>{data.unit}</Typography>
                                <Typography style={{ fontSize: 10, lineHeight: 1 }}>{data.gate}</Typography>
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
                    >
                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.notify"} />
                    </Button>
                </ListItem>
                {index !== units.length - 1 ? <Divider style={styles.divider} /> : null}
            </>
        })
    );

    return (
        <>
            <Card style={styles.card}>
                <ListItem
                    button={canExpand}
                    onClick={() => handleCardExpand(timeline.id)}
                    style={styles.cardExpand}
                >
                    <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                    <div style={styles.indicator}>{timeline.captured}</div>
                    <ListItemText
                        style={styles.listItemText}
                        primary={timeline.capturedTime}
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
                        <div style={{ padding: "0 15px" }}>
                            <img alt={"Gate Runner Vehicle"} style={styles.img} src={"https://localhost/_download?handle=14be24a0-5c09-11ed-ade7-f74776e919bf"} />
                        </div>
                    </CardContent>
                    {units && size(units) ?
                        <>
                            <CardActions style={{ backgroundColor, padding: "0px" }}>
                                <div style={styles.marginAuto}>
                                    <Button
                                        color="primary"
                                        style={{ textTransform: "none", fontSize: 12, minWidth: "unset", padding: "6px 15px" }}
                                    >
                                        <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.notifyAll"} />
                                    </Button>

                                </div>
                            </CardActions>
                            {generateUnitList}
                        </>
                        :
                        <div style={styles.recommendations}>
                            <Typography style={{ color: "#fff", fontSize: 12 }}>
                                <Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.generatingRec"} />
                            </Typography>
                        </div>
                    }
                </Collapse >
            </Card >
        </>
    )
};


Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;