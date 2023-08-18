import React, { useEffect, useState, Fragment, memo } from "react";
// router
import { Link as RouterLink } from "react-router";
import { routes as r } from "../../routes";
// material-ui
import {
	Button,
	Checkbox,
	Container,
	FormControlLabel,
	Link,
	List,
	ListItem,
	Divider,
	ListItemText,
	ListItemSecondaryAction,
	IconButton
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

//components
import ArticleContainer from "../../shared/components/ArticleContainer";
import CreateNewOrgDialog from "./CreateNewOrgDialog";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

const styles = {
	leftText: {
		flex: "0 0 300px",
		alignItems: "center"
	},
	middleText: {
		flex: "1 1 328px",
		marginRight: 24
	},
	rightText: {
		paddingRight: 24,
		paddingLeft: 40,
		textAlign: "right"
	}
};
const EcosystemOrganizations = ({
	createNewOrg,
	createOrgError,
	userOrgId,
	orgs,
	openDialog,
	closeDialog,
	dialog,
	toggleOrgActive,
	toggleOrgDisabled,
	dir
}) => {
	const [hideDisabled, toggleHideDisabled] = useState(false);
	const filteredOrgs = orgs.filter(org => hideDisabled ? !org.disabled : true);
	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.manageEcosystem.formTitle")}
			dir={dir}
		>
			<Container style={{display: "flex", justifyContent: "space-between", margin: "24px 0px"}}>
				<Button onClick={() => openDialog("new-org-dialog")} variant="contained" color="primary"><Translate value="mainContent.manageEcosystem.addnewBtn"/></Button>
				<FormControlLabel
					control={
						<Checkbox
							checked={hideDisabled}
							onChange={() => toggleHideDisabled(!hideDisabled)}
							color="primary"
						/>
					}
					label={getTranslation("mainContent.manageEcosystem.hideDisabled")}
					style={dir == "rtl" ? {margin: 0} : {}}
				/>
			</Container>
			<Divider style={{position: "absolute", left: 24, right: 24}} />
			<List>
				{filteredOrgs.map((org, index) => {
					return (
						<Fragment key={index}>
							<ListItem style={dir == "rtl" ? styles.rightText : {paddingLeft: 24}}>
								<ListItemText
									style={styles.leftText}
									primary={org.name}
								/>
								<FormControlLabel
									control={
										<Checkbox
											disabled={org.orgId === userOrgId}
											checked={!org.disabled}
											onChange={() => !org.disabled ? toggleOrgDisabled(org.orgId) : toggleOrgActive(org.orgId)}
											color="primary"
										/>
									}
									label={getTranslation("mainContent.manageEcosystem.active")}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
									<IconButton component={RouterLink} to={`${r.MANAGE_ECOSYSTEM}/${org.orgId}`}>
										{dir == "rtl" ? <ChevronLeftIcon/> : <ChevronRightIcon />}
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							{index !== filteredOrgs.length - 1 ?
								<Divider style={{position: "absolute", left: 24, right: 24}} /> : null
							}
						</Fragment>
					);
				})}
			</List>
			<CreateNewOrgDialog 
				createNewOrg={createNewOrg} 
				createOrgError={createOrgError} 
				abortAction={() => closeDialog("new-org-dialog")}
				open={dialog === "new-org-dialog"}
				dir={dir}
			/>
		</ArticleContainer>
	);
};

export default memo(EcosystemOrganizations);