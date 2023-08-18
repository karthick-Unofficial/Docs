import React, { Fragment } from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, SvgIcon, Tooltip, ListItemSecondaryAction } from "@mui/material";
import { Person, Error } from "@mui/icons-material";

import { mdiAccountPlus, mdiAccountMinus, mdiAccountLock, mdiAccountKey } from "@mdi/js";
import { getTranslation } from "orion-components/i18n";

const iconStyle = {
	width: "34px",
	height: "34px",
	margin: "12px"
};

const getIcon = (errorMessage, icon) => {
	if (errorMessage) {
		return <Error color={"white"} />;
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
	listItems,
	dir
}) => {
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
		},
		listItemText: {
			flex: "0 0 165px",
			cursor: "pointer",
			...(dir == "rtl" ? { textAlign: "right" } : {})
		},
		secondaryAction: {
			...(dir == "rtl" ? { left: "16px", right: "unset" } : {})
		}
	};

	return (
		<div style={{ width: "100%" }}>
			<List>
				{listItems && listItems.map((item, index) => {
					return (
						<Fragment key={`adUser-${index}`}>
							<ListItem key={item.id} style={styles.listItem}>
								<ListItemAvatar>
									<Avatar style={{ backgroundColor: "#1F1F21" }}>
										<Person color={"#FFF"} />
									</Avatar>
								</ListItemAvatar>
								<ListItemText style={styles.listItemText}>
									{item.name}
								</ListItemText>
								<ListItemSecondaryAction style={styles.secondaryAction}>
									{getIcon(item.errorMessage, item.icon)}
								</ListItemSecondaryAction>
							</ListItem>
							<Divider />
						</Fragment>
					);
				})}
			</List>
		</div>
	);
};

export default Oldlist;