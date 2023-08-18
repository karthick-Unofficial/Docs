import React, { useEffect, memo } from "react";
// router
import { routes as r } from "../routes.js";
// material-ui
import { Container, useMediaQuery } from "@mui/material";
//Components
import SideNavigation from "../shared/components/SideNavigation/SideNavigation";
import EcosystemOrganizations from "./components/EcosystemOrganizations";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import * as actionCreators from "./manageEcosystemActions";
import { getDir } from "orion-components/i18n/Config/selector";

const ManageEcosystem = () => {
	const {
		createNewOrg,
		openDialog,
		closeDialog,
		toggleOrgActive,
		toggleOrgDisabled
	} = actionCreators;

	const orgs = useSelector(state => Object.values(state.globalData.orgs));
	const user = useSelector(state => state.session.user);
	const userOrgId = useSelector(state => state.session.user.profile.orgId);
	const sharingTokensEnabled = useSelector(state => state.appState.sharingTokens.enabled);
	const createOrgError = useSelector(state => state.appState.errors.createOrgError);
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));

	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");

	const styles = {
		accountContent: {
			...(dir === "rtl" ? { marginRight: minWidth1024Query ? 280 : 0 } : { marginLeft: minWidth1024Query ? 280 : 0 })
		}
	};
	return (
		<div>
			{/* Navigation */}
			<SideNavigation location={3} />
			{/* Main User Account Content */}
			<div style={styles.accountContent}>
				<div style={{
					marginLeft: "auto",
					marginRight: "auto",
					maxWidth: minWidth1024Query ? 1120 : 840,
					paddingLeft: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8,
					paddingRight: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8
				}}>
					<div style={{
						maxWidth: 840
					}}>
						{/* My Settings Header */}
						<header style={{ textAlign: "center" }}>
							<h2>
								<Translate value="mainContent.manageEcosystem.title" />
							</h2>
							<div className="b1-dark-gray">
								<Translate value="mainContent.manageEcosystem.titleText" />
							</div>
						</header>
						<Container component={"section"} style={{
							paddingLeft: 0,
							paddingRight: 0,
							paddingTop: mixedQuery ? 0 : minWidth600Query ? 8 : 16,
							paddingBottom: 20,
							...(mixedQuery ? {
								boxAlign: "stretch",
								alighnItems: "stretch",
								display: "flex",
								flexWrap: "wrap",
								marginLeft: -12,
								width: "calc(100% + 24px)"
							} : {})
						}}>
							<EcosystemOrganizations
								createNewOrg={createNewOrg}
								createOrgError={createOrgError}
								userOrgId={user.profile.orgId}
								orgs={orgs}
								toggleOrgActive={toggleOrgActive}
								toggleOrgDisabled={toggleOrgDisabled}
								dialog={dialog}
								closeDialog={closeDialog}
								openDialog={openDialog}
								dir={dir}
							/>
						</Container>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ManageEcosystem);