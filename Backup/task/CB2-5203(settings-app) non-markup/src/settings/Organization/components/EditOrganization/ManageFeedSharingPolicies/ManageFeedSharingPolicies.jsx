import React, { Fragment, memo } from "react";
// router
import { Link as RouterLink } from "react-router";
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
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// utility
import { getIntegrationIcon } from "../../../../utility/index.js";
import {getTranslation} from "orion-components/i18n/I18nContainer";

const styles = {
	listItemText: {
		flex: "0 0 170px"
	},
	listItemCheckBox: {
		flex: "0 0 170px"
	},
	listItem: {
		paddingLeft: 0,
		marginBottom: 12,
		marginTop: 24
	},
	listItemRTL: {
		paddingRight: 0,
		marginBottom: 12,
		marginTop: 24
	}
};
const ManageFeedSharingPolicies = ({
	integrations,
	orgId,
	dir
}) => {
	const shapes = integrations.filter(item => item.ownerOrg === orgId && item.entityType === "shapes");
	const shapeless = integrations.filter(item => item.ownerOrg === orgId && item.entityType !== "shapes");
	const sortedIntegrations = shapes.concat(shapeless);
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
				<List style={{marginTop: 20}}>
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
									style={dir == "rtl" ? styles.listItemRTL : styles.listItem}>
										<ListItemIcon>
											{icon ? icon : <Avatar
												style={{ width: 34, height: 34 }}
												color="white"
											>
												{int.name ? int.name[0] : ""}
											</Avatar>}
										</ListItemIcon>
										<ListItemText style={dir == "rtl" ? {textAlign: "right"} : {}}>
											{int.name}
										</ListItemText>
										<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16, color: "white"}: { color: "white" }}>
											{dir == "rtl" ? <ChevronLeftIcon/> : <ChevronRightIcon />}
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