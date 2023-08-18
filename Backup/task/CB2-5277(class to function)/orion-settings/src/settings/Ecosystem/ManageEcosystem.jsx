import React, { useEffect, memo } from "react";
// router
import { routes as r } from "../routes.js";
import { browserHistory } from "react-router";
// material-ui
import { Container, useMediaQuery } from "@material-ui/core";
//Components
import SideNavigation from "../shared/components/SideNavigation/SideNavigationContainer";
import EcosystemOrganizations from "./components/EcosystemOrganizations";
import {Translate} from "orion-components/i18n/I18nContainer";

const ManageEcosystem = ({
	createNewOrg,
	createOrgError,
	openDialog,
	closeDialog,
	dialog,
	orgs,
	toggleOrgActive,
	toggleOrgDisabled,
	user,
	WavCamOpen,
	dir
}) => {
	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	return (
		<div>
			{/* Navigation */}
			<SideNavigation location={3} />
			{/* Main User Account Content */}
			<div style={dir == "rtl" ? {
				marginRight: minWidth1024Query ? 280 : 0
			} : {
				marginLeft: minWidth1024Query ? 280 : 0
			}}>
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
								<Translate value="mainContent.manageEcosystem.title"/>
							</h2>
							<div className="b1-dark-gray">
								<Translate value="mainContent.manageEcosystem.titleText"/>
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