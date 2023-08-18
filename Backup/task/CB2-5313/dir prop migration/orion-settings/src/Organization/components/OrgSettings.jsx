import React, { memo } from "react";
// router
import { Link as RouterLink } from "react-router-dom";
import { routes as r } from "../../routes";
// material-ui
import {
	List,
	ListItem,
	ListItemIcon,
	Divider,
	ListItemText,
	IconButton,
	SvgIcon
} from "@mui/material";
import { mdiHandshake } from "@mdi/js";

import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { AccountMultiple, AccountBoxMultiple, BadgeAccountHorizontal, ShareVariant } from "mdi-material-ui";
//components
import ArticleContainer from "../../shared/components/ArticleContainer";
import { getTranslation } from "orion-components/i18n";

const OrgSettings = ({ dir }) => {

	const styles = {
		leftText: {
			flex: "0 0 675px",
			alignItems: "center"
		},
		middleText: {
			flex: "1 1 328px",
			marginRight: 24
		},
		iconButton: {
			color: "white"
		},
		listItem: {
			textAlign: "unset",
			...(dir === "rtl" ? { paddingRight: 24 } : { paddingLeft: 24 }),
		}
	};

	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.title")}
			headerDescription={getTranslation("mainContent.manageOrganization.orgSettings.titleText")}
			dir={dir}
		>
			<List style={{
				marginTop: 25
			}}>
				<ListItem style={styles.listItem} component={RouterLink} to={r.ACTIVE_DIRECTORY} button key={"active-directory"}>
					<ListItemIcon style={styles.iconButton}>
						<AccountBoxMultiple style={{ width: 34, height: 34 }} />
					</ListItemIcon>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.title")}
						secondary={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.titleText")}
					/>
					<IconButton style={styles.iconButton} >
						{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</ListItem>
				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				<ListItem style={styles.listItem} component={RouterLink} to={r.MANAGE_USER_ROLES} button key={"user-roles"}>
					<ListItemIcon style={styles.iconButton}>
						<BadgeAccountHorizontal style={{ width: 34, height: 34 }} />
					</ListItemIcon>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.title")}
						secondary={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.titleText")}
					/>
					<IconButton style={styles.iconButton} >
						{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</ListItem>
				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				<ListItem style={styles.listItem} component={RouterLink} to={r.MANAGE_USERS} button key={"manage-users"}>
					<ListItemIcon style={styles.iconButton}>
						<AccountMultiple style={{ width: 34, height: 34 }} />
					</ListItemIcon>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.title")}
						secondary={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.titleText")}
					/>
					<IconButton style={styles.iconButton} >
						{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</ListItem>
				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				<ListItem style={styles.listItem} component={RouterLink} to={r.SHARING_CONNECTIONS} button key={"sharing-connections"}>
					<ListItemIcon style={styles.iconButton}>
						<SvgIcon style={{ width: 34, height: 34 }}>
							<path d={mdiHandshake} />
						</SvgIcon>
					</ListItemIcon>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.title")}
						secondary={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.titleText")}
					/>
					<IconButton style={styles.iconButton} >
						{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</ListItem>
				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				<ListItem style={styles.listItem} component={RouterLink} to={r.MANAGE_FEED_SHARING_POLICIES} button key={"manage-feed-sharing"}>
					<ListItemIcon style={styles.iconButton}>
						<ShareVariant style={{ width: 34, height: 34 }} />
					</ListItemIcon>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgSettings.manageFeedSharing.title")}
						secondary={getTranslation("mainContent.manageOrganization.orgSettings.manageFeedSharing.titleText")}
					/>
					<IconButton style={styles.iconButton} >
						{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</ListItem>
			</List>
		</ArticleContainer>
	);
};

export default memo(OrgSettings);