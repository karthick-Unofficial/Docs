import React from "react";
import {
    Card,
    CardActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Collapse,
    CardContent,
    Divider,
    IconButton,
    Button,
    Popover
    //Switch
} from "@mui/material";
import { TargetingIcon } from "orion-components/SharedComponents";
import PropTypes from "prop-types";
import Badge from "@mui/material/Badge";
import { ClipboardPulse } from "mdi-material-ui";
import { Alert } from "orion-components/CBComponents/Icons";

const propTypes = {

};

const defaultProps = {

};


const TimelineCard = ({ canExpand, expanded, handleCardExpand, event, dir, geometry }) => {

    const backgroundColor = expanded ? "#494D53" : "#333639";

    const styles = {
        marginAuto: {
            ...(dir === "ltr" && { marginLeft: "auto" }),
            ...(dir === "rtl" && { marginRight: "auto" })
        },
        card: {
            backgroundColor,
            borderRadius: 5,
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
            ...(dir === "rtl" && { textAlign: "right" })
        },
        listItemSecondaryAction: {
            ...(dir === "rtl" && { right: "unset", left: 16 })
        },
        textAlignRight: {
            ...(dir === "rtl" && { textAlign: "right" })
        },
        arrow: {
            color: "#FFF", fontSize: "medium",
            ...(dir === "rtl" && { marginLeft: 10 }),
            ...(dir === "ltr" && { marginRight: 10 })
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
        }
    };

    const { id, feedId } = event;

    return (
        <Card style={styles.card}>
            <ListItem
                button={canExpand}
                onClick={() => handleCardExpand(id)}
                style={styles.cardExpand}
            >
                <TargetingIcon geometry={geometry} id={id} feedId={feedId} />
                <div style={styles.indicator}>1</div>
                <ListItemText
                    style={styles.listItemText}
                    primary={"+1m 48s"}
                    primaryTypographyProps={{
                        noWrap: true,
                        variant: "body1"
                    }}

                />
            </ListItem>
            <Collapse unmountOnExit in={expanded}>
                <CardContent style={{ padding: 0 }}>
                    {<img alt={"vehicle_img"} style={styles.img} src={"https://localhost/_download?handle=14be24a0-5c09-11ed-ade7-f74776e919bf"} />}
                </CardContent>
                {/* {!readOnly && (
                    <CardActions style={{ backgroundColor, padding: "0px 4px" }}>
                        {hasCapability("control") && unlinkControls}
                        {hasCapability("auto-slew") && slewControls}
                    </CardActions>
                )
                } */}
            </Collapse>
        </Card >
    )
};


TimelineCard.propTypes = propTypes;
TimelineCard.defaultProps = defaultProps;

export default TimelineCard;