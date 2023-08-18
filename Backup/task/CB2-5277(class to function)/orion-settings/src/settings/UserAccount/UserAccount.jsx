import React, { useEffect, Fragment, memo } from "react";
// router
import { browserHistory } from "react-router";
import { routes as r } from "../routes.js";
// material-ui
import { Container, useMediaQuery } from "@material-ui/core";
// Components
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import SideNavigation from "../shared/components/SideNavigation/SideNavigationContainer";
import { UserApps, UserIntegrations } from "./components";
import { Translate } from "orion-components/i18n/I18nContainer";
import EditPageTemplate from "../shared/components/EditPageTemplate";

const UserAccount = ({
	canViewThisUser,
	canEditThisUser,
	fetchUserProfile,
	globalState,
	org,
	updateGlobalUserAppSettings,
	setLocaleWithFallback,
	user,
	username,
	isMyUser,
	dir
}) => {
	useEffect(() => {
		if (username) {
			if (canViewThisUser === false || !user) {
				browserHistory.replace(r.MY_ACCOUNT);
			} else if (username && fetchUserProfile) {
				fetchUserProfile(username);
			}
		}
	}, [username, fetchUserProfile, canViewThisUser]);
	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	if (!user) return null;

	const userAccountContainer = () => {
		return (
			<div>
				{/* Navigation */}
				{isMyUser && <SideNavigation location={1} />}
				{/* Main User Account Content */}
				<div style={dir == "rtl" ? {
					marginRight: minWidth1024Query ? 280 : 0
				} : {
					marginLeft: minWidth1024Query ? 280 : 0
				}}>
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
										{isMyUser && <Settings globalState={globalState} updateGlobalUserAppSettings={updateGlobalUserAppSettings} setLocaleWithFallback={setLocaleWithFallback} dir={dir} />}
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