import React, { Fragment, memo } from "react";
// router
import { Link as RouterLink } from "react-router-dom";
import { routes as r } from "../../../../routes";
// components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
// material ui
import {
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction
} from "@mui/material";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
// utility
import { getIntegrationIcon } from "../../../../utility/index.js";
import { getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const ManageFeedSharingPolicies = () => {
	const userOrgId = useSelector(state => state.session.user.profile.orgId);
	const org = useSelector(state => state.globalData.orgs[userOrgId]);
	const integrations = org ? org.integrations : [];
	const orgId = org ? org.orgId : "";
	const dir = useSelector(state => getDir(state));

	const shapes = integrations.filter(item => item.ownerOrg === orgId && item.entityType === "shapes");
	const shapeless = integrations.filter(item => item.ownerOrg === orgId && item.entityType !== "shapes");
	const sortedIntegrations = shapes.concat(shapeless);

	const styles = {
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemCheckBox: {
			flex: "0 0 170px"
		},
		listItem: {
			marginBottom: 12,
			marginTop: 24,
			...(dir === "rtl" ? { paddingRight: 0 } : { paddingLeft: 0 })
		},
		listItemSecondaryAction: {
			color: "white",
			...(dir == "rtl" && { right: "unset", left: 16 })
		}
	};

	return (
		<EditPageTemplate
			title={getTranslation("mainContent.manageOrganization.orgSettings.title")}
			subTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageFeedSharing.titleText")}
			dir={dir}
		>
			<ArticleContainer
				headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageFeedSharing.title")}
				headerDescription={getTranslation("mainContent.manageOrganization.orgSettings.manageFeedSharing.subText")}
				editing={true}
			>
				<Divider style={{ position: "absolute", left: 0, right: 0, top: 120 }} />
				<List style={{ marginTop: 20 }}>
					{sortedIntegrations
						.sort((a, b) => {
							if (a.name < b.name) return -1;
							if (a.name > b.name) return 1;
							return 0;
						})
						.map((int, index) => {
							const icon = getIntegrationIcon(int.feedIcon);
							return (
								<Fragment key={index}>
									<ListItem component={RouterLink} to={`${r.MANAGE_FEED_SHARING_POLICIES}/${int.feedId}`} button
										style={styles.listItem}>
										<ListItemIcon>
											{icon ? icon : <Avatar
												style={{ width: 34, height: 34 }}
												color="white"
											>
												{int.name ? int.name[0] : ""}
											</Avatar>}
										</ListItemIcon>
										<ListItemText style={styles.listItemText}>
											{int.name}
										</ListItemText>
										<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
											{dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
										</ListItemSecondaryAction>
									</ListItem>
									{
										index !== sortedIntegrations.length - 1 ?
											<Divider style={{ position: "absolute", left: 0, right: -40 }} /> : null
									}
								</Fragment>
							);
						})
					}
				</List>
			</ArticleContainer>
		</EditPageTemplate>
	);
};

export default memo(ManageFeedSharingPolicies);