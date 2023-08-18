import React, { useEffect, useState, Fragment, memo } from "react";
// router
import { Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

//components
import ArticleContainer from "../../shared/components/ArticleContainer";
import CreateNewOrgDialog from "./CreateNewOrgDialog";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

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
	const dispatch = useDispatch();

	const [hideDisabled, toggleHideDisabled] = useState(false);
	const filteredOrgs = orgs.filter(org => hideDisabled ? !org.disabled : true);

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
			...(dir === "rtl" ? {
				paddingRight: 24,
				paddingLeft: 40,
				textAlign: "right"
			} : { paddingLeft: 24 })
		},
		formControlLabel: {
			...(dir === "rtl" && { margin: 0 })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" ? { right: "unset", left: 16 } : {})
		}
	};

	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.manageEcosystem.formTitle")}
			dir={dir}
		>
			<Container style={{ display: "flex", justifyContent: "space-between", margin: "24px 0px" }}>
				<Button onClick={() => dispatch(openDialog("new-org-dialog"))}
					style={{ color: "#FFF", marginLeft: "20px", marginRight: "20px" }}
					variant="contained">
					<Translate value="mainContent.manageEcosystem.addnewBtn" />
				</Button>
				<FormControlLabel
					control={
						<Checkbox
							checked={hideDisabled}
							onChange={() => toggleHideDisabled(!hideDisabled)}
							color="primary"
						/>
					}
					label={getTranslation("mainContent.manageEcosystem.hideDisabled")}
					style={styles.formControlLabel}
				/>
			</Container>
			<Divider style={{ position: "absolute", left: 24, right: 24 }} />
			<List>
				{filteredOrgs.map((org, index) => {
					return (
						<Fragment key={index}>
							<ListItem style={styles.rightText}>
								<ListItemText
									style={styles.leftText}
									primary={org.name}
								/>
								<FormControlLabel
									control={
										<Checkbox
											disabled={org.orgId === userOrgId}
											checked={!org.disabled}
											onChange={() => !org.disabled ? dispatch(toggleOrgDisabled(org.orgId)) : dispatch(toggleOrgActive(org.orgId))}
											color="primary"
										/>
									}
									label={getTranslation("mainContent.manageEcosystem.active")}
								/>
								<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
									<IconButton component={RouterLink} to={`${r.MANAGE_ECOSYSTEM}/${org.orgId}`}>
										{dir === "rtl" ? <ChevronLeft /> : <ChevronRight />}
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							{index !== filteredOrgs.length - 1 ?
								<Divider style={{ position: "absolute", left: 24, right: 24 }} /> : null
							}
						</Fragment>
					);
				})}
			</List>
			<CreateNewOrgDialog
				createNewOrg={createNewOrg}
				createOrgError={createOrgError}
				abortAction={() => dispatch(closeDialog("new-org-dialog"))}
				open={dialog === "new-org-dialog"}
				dir={dir}
			/>
		</ArticleContainer>
	);
};

export default memo(EcosystemOrganizations);