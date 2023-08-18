import React, { useEffect, memo } from "react";
// router
import { routes as r } from "../routes.js";
import { useNavigate, useParams } from "react-router-dom";
// material-ui
import { Container, useMediaQuery } from "@mui/material";
//Components
import SideNavigation from "../shared/components/SideNavigation/SideNavigation";
import { OrgProfile, OrgSettings } from "./components";
import { Translate } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./manageOrganizationActions";
import { getDir } from "orion-components/i18n/Config/selector";

const ManageOrganization = ({ location }) => {
	const dispatch = useDispatch();

	const { fetchOrg } = actionCreators;

	// Read url parameters to  determine if this is the viewing user's organization or not, and
	// retrieve correct id from state
	const params = useParams();

	const orgId = useSelector(state => params && params.orgId ? params.orgId : state.session.user.profile.orgId);
	const loggedInUserOrg = useSelector(state => state.session.user.profile.orgId);
	const isMyOrg = (orgId === loggedInUserOrg);
	const org = useSelector(state => state.appState.viewing.selectedEntity.type === "org" ? state.globalData.orgs[state.appState.viewing.selectedEntity.id] : null);
	const user = useSelector(state => state.session.user);
	const canViewThisOrg = org && !isMyOrg ? false : true;
	const dir = useSelector(state => getDir(state));
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	/* Below props aren't being used anymore.*/

	// const users = useSelector(state => Object.keys(state.globalData.users));
	// const orgMembers = useSelector(state => org && users.map((key) => state.globalData.users[key]).filter((user) => user.orgId === org.orgId));

	// // Only eco-admin can create new organization
	// const canCreateNewOrganization = useSelector(state => org && state.session.user.profile.ecoAdmin);

	// // Only eco-admin can configure org admins
	// const isEcoAdmin = useSelector(state => org && state.session.user.profile.ecoAdmin);
	// // Only eco-admin can create new organization
	// const canConfigureOrgUsers = useSelector(state => state.session.user.profile.admin);
	// const isSubmitting = useSelector(state => state.appState.loading["orgDetails"]);
	// const isLoading = useSelector(state => state.appState.loading["orgProfile"]);
	// const confirmDialogIsOpen = useSelector(state => state.appState.dialog.openDialog === "confirmDialog");
	// const orgs = useSelector(state => state.globalData.orgs);
	// const dialog = useSelector(state => state.appState.dialog.openDialog);
	// const sharingTokensEnabled = useSelector(state => state.appState.sharingTokens.enabled);
	// const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const navigate = useNavigate();

	useEffect(() => {
		if (canViewThisOrg === false) {
			navigate(r.MANAGE_ORGANIZATION, { replace: true });
		} else if (orgId && fetchOrg) {
			dispatch(fetchOrg(orgId));
		}
	}, [orgId, canViewThisOrg, fetchOrg]);
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
			<SideNavigation location={2} />
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
								<Translate value="mainContent.manageOrganization.title" />
							</h2>
							<div className="b1-dark-gray">
								<Translate value="mainContent.manageOrganization.titleText" />
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
							<OrgProfile org={org} isAdmin={user.profile.admin} isMyOrg={isMyOrg} dir={dir} />
							<OrgSettings dir={dir} />
						</Container>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ManageOrganization);