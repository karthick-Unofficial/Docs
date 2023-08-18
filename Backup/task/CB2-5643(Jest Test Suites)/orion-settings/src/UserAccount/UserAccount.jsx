import React, { useEffect, Fragment, memo } from "react";
// router
import { useNavigate, useParams } from "react-router-dom";
import { routes as r } from "../routes.js";
// material-ui
import { Container, useMediaQuery } from "@mui/material";
// Components
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import SideNavigation from "../shared/components/SideNavigation/SideNavigation";
import { UserApps, UserIntegrations } from "./components";
import { Translate } from "orion-components/i18n";
import EditPageTemplate from "../shared/components/EditPageTemplate";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "./userAccountActions";
import { getDir } from "orion-components/i18n/Config/selector";

const UserAccount = () => {
	const dispatch = useDispatch();
	const params = useParams();

	const {
		fetchUserProfile,
		updateGlobalUserAppSettings,
		setLocaleWithFallback
	} = actionCreators;

	// -- don't do anything until globalData is populated
	const users = useSelector(state => Object.keys(state.globalData.users).length === 0);

	// Read url parameters to  determine if this is the viewing user's profile or not, and
	// retrieve correct id from state
	const username = useSelector(state => !users ? (params && params.id || state.session.user.profile.id) : undefined);
	const user = useSelector(state =>
		!users ? (username ? state.globalData.users[username] :
			(state.appState.viewing.selectedEntity.type === "user" ? state.globalData.users[state.appState.viewing.selectedEntity.id] : null)) : undefined);
	const isMyUser = useSelector(state => !users ? (username === state.session.user.profile.id) : undefined);
	const isAdmin = useSelector(state => state.session.user.profile.admin);
	const isMyOrg = useSelector(state => user && state.session.user.profile.orgId === user.orgId);
	const org = useSelector(state => !users ? (user ? state.globalData.orgs[user.orgId] : null) : undefined);

	// Only users in the same organization can view each other
	const canViewThisUser = !users ? isMyUser || (isAdmin && isMyOrg) : undefined;
	const canEditThisUser = !users ? isMyUser || (isAdmin && isMyOrg && user && !user.admin) : undefined;
	// ------------------------------------------------------
	const globalState = useSelector(state => !users ? state.appState.global : undefined);
	const locale = useSelector(state => state.i18n.locale);
	// const WavCamOpen = useSelector(state => !users && state.appState.dock.dockData.WavCam);   Not used anymore
	const dir = useSelector(state => getDir(state));

	const navigate = useNavigate();

	useEffect(() => {
		if (username) {
			if (canViewThisUser === false || !user) {
				navigate(r.MY_ACCOUNT, { replace: true });
			} else if (username && fetchUserProfile) {
				dispatch(fetchUserProfile(username));
			}
		}
	}, [username, fetchUserProfile, canViewThisUser]);
	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	if (!user) return null;

	const styles = {
		accountContent: {
			...(dir == "rtl" ? { marginRight: minWidth1024Query ? 280 : 0 } : { marginLeft: minWidth1024Query ? 280 : 0 })
		}
	};

	const userAccountContainer = () => {
		return (
			<div>
				{/* Navigation */}
				{isMyUser && <SideNavigation location={1} />}
				{/* Main User Account Content */}
				<div style={styles.accountContent}>
					<div style={{
						marginLeft: "auto",
						marginRight: "auto",
						maxWidth: isMyUser ? minWidth1024Query ? 1120 : 840 : minWidth1024Query ? 1040 : 750,
						paddingLeft: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8,
						paddingRight: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8
					}}>
						<div style={{
							maxWidth: 840
						}}>
							{/* My Settings Header */}
							<header style={{ textAlign: "center" }}>
								<h2>
									{/* {isMyUser ? "My" : "User"} Account Settings */}
									<Translate value={isMyUser ? "sideBar.option1.variant1" : "sideBar.option1.variant2"} />
								</h2>
								<div className="b1-dark-gray">
									<Translate value="mainContent.accountSettings.titleText" />
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
								{user && (
									<Fragment>
										{/* User Profile */}
										<Profile user={user} org={org} isMyUser={isMyUser} canEditThisUser={canEditThisUser} dir={dir} />
										{/* User Settings */}
										{isMyUser && <Settings globalState={globalState} updateGlobalUserAppSettings={updateGlobalUserAppSettings} setLocaleWithFallback={setLocaleWithFallback} dir={dir} lngLocale={locale} />}
										{/* User Apps */}
										{/* <UserApps isMyUser={isMyUser} /> */}
										{/* User Integrations */}
										{/* <UserIntegrations isMyUser={isMyUser} /> */}
									</Fragment>
								)}
							</Container>
						</div>
					</div>
				</div>
			</div >);
	};
	return (
		!isMyUser ? <EditPageTemplate
			title={<Translate value="mainContent.manageOrganization.orgSettings.manageUsers.title" />}
			dir={dir}
		>
			{userAccountContainer()}
		</EditPageTemplate> :
			<div>
				{userAccountContainer()}
			</div>
	);
};

export default memo(UserAccount);