import React, { Fragment } from "react";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import SocialPerson from "material-ui/svg-icons/social/person";
import AlertError from "material-ui/svg-icons/alert/error";
import { Divider, SvgIcon, Tooltip } from "@material-ui/core";
import { mdiAccountPlus, mdiAccountMinus, mdiAccountLock, mdiAccountKey } from "@mdi/js";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
    root: {
        width: "100%"
    },
    primary: {
        color: "white",
        fontFamily: "Roboto",
        lineHeight: "20px",
        fontSize: "16px"
    },
    listItem: {
        backgroundColor: "#41454A",
        margin: "4px 0",
        height: "60px"
    },
    avatar: {
        backgroundColor: "#1f1f21",
        color: "white"
    },
    errorIcon: {
        color: "white"
    }
};

const iconStyle = {
    width: "34px",
    height: "34px",
    display: "block",
    position: "absolute",
    top: "0px",
    right: "4px",
    margin: "12px"
};

const getIcon = (errorMessage, icon) => {
    if (errorMessage) {
        return <AlertError color={"white"} />;
    }
    else if (icon && icon === "add") {
        return <Tooltip title={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.toolTip.addTip")} aria-label="add">
            <SvgIcon style={iconStyle}>
                <path d={mdiAccountPlus} />
            </SvgIcon>
        </Tooltip>;
    }
    else if (icon && icon === "remove") {
        return <Tooltip title={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.toolTip.removeTip")} aria-label="add">
            <SvgIcon style={iconStyle}>
                <path d={mdiAccountMinus} />
            </SvgIcon>
        </Tooltip>;
    }
    else if (icon && icon === "disable") {
        return <Tooltip title={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.toolTip.disableTip")} aria-label="add">
            <SvgIcon style={iconStyle}>
                <path d={mdiAccountLock} />
            </SvgIcon>
        </Tooltip>;
    }
    else if (icon && icon === "enable") {
        return <Tooltip title={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.toolTip.enableTip")} aria-label="add">
            <SvgIcon style={iconStyle}>
                <path d={mdiAccountKey} />
            </SvgIcon>
        </Tooltip>;
    }
    else {
        return null;
    }
};

const Oldlist = ({
    listItems
}) => {
    return (
        <div style={{ width: "100%" }}>
            <List>
                {listItems && listItems.map((item, index) => {
                    return (
                        <Fragment key={`adUser-${index}`}>
                            <ListItem
                                key={item.id}
                                style={styles.listItem}
                                primaryText={item.name}
                                leftAvatar={<Avatar icon={<SocialPerson color={"#FFF"} />} backgroundColor={"#1f1f21"} color={"white"} />}
                                rightIcon={getIcon(item.errorMessage, item.icon)} />
                            <Divider />
                        </Fragment>
                    );
                })}
            </List>
        </div>
    );
};

export default Oldlist;