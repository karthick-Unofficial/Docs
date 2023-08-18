import React, { useEffect, useState } from "react";

// Material UI
import { Button, Divider } from "@mui/material";
import { EmailSendOutline } from "mdi-material-ui";

// components
import UserAvatar from "../UserAvatar";

// Utilities
import { transformRole as trans } from "./utility";
import { getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { manualLogout } from "../Session/User/actions";

const propTypes = {
	user: PropTypes.object,
	org: PropTypes.object,
	emailConfig: PropTypes.object,
	dir: PropTypes.string,
	dispatch: PropTypes.func
};

const AppMenu = ({ user, org, emailConfig, dir, dispatch }) => {
	const [supportURL, setSupportURL] = useState(null);

	useEffect(() => {
		if (org && org.supportURL) {
			setSupportURL(org.supportURL);
		}
	}, []);

	const openMailClient = () => {
		// %0D%0A = line break
		const supportEmailBody = `
			${emailConfig.body}
			${"%0D%0A"}
			${"%0D%0A"}
			Additional Information
			${"%0D%0A"}
			Time: ${new Date().toString()}
			${"%0D%0A"}
			URL: ${window.location.href}
			${"%0D%0A"}
			${"%0D%0A"}
		`;

		window.location.href = `mailto:${emailConfig.address}?subject=${emailConfig.subject}&body=${supportEmailBody}`;
	};

	const { applications } = user;

	// get user agent
	const ua = window.navigator.userAgent;

	// Check if using embedded browser
	const isMobile = ua.indexOf("CBMobile") > -1;

	const styles = {
		avatarStyles: {
			...(dir === "ltr" && { marginLeft: "16px" }),
			...(dir === "rtl" && { marginRight: "16px" })
		},
		ButtonStyles: {
			// Remove logout on mobile
			...(isMobile && { visibility: "hidden" }),
			...(!isMobile && { paddingLeft: "0px", paddingRight: "0px" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" })
		}
	};

	const userApps = applications.filter((app) => app.config.canView);
	const defaultApps = [
		{
			appId: "settings",
			name: getTranslation("global.appMenu.main.settings"),
			link: "/settings-app/my-account-settings"
		},
		{
			appId: "support",
			name: getTranslation("global.appMenu.main.support"),
			link: supportURL || "http://aressecuritycorp.com/contact/"
		}
	];

	// everyone has mobile home link
	if (isMobile) {
		userApps.push({
			appId: "mobileHome",
			name: getTranslation("global.appMenu.main.home"),
			link: "cbmobile://close-browser" // cSpell:ignore cbmobile
		});
	}

	const filteredApps = [...userApps, ...defaultApps].filter((app) => !(window.location.href.indexOf(app.appId) > -1));

	const title = user.ecoAdmin
		? getTranslation("global.appMenu.main.ecoAdmin")
		: user.admin
		? getTranslation("global.appMenu.main.orgAdmin")
		: trans(user.orgRole.title);

	return (
		<div className="app-menu-wrapper">
			<div className="user-info">
				<a href="/home" style={{ textDecoration: "none" }}>
					<UserAvatar user={user} size={40} style={styles.avatarStyles} />
				</a>
				<div className={dir === "rtl" ? "user-detailsRTL" : "user-details"}>
					<div>{user.name}</div>
					<span>{title}</span>
				</div>
				<Button
					id="logout-button"
					style={styles.ButtonStyles}
					variant="text"
					color="primary"
					onClick={() => dispatch(manualLogout())}
				>
					{getTranslation("global.appMenu.main.logOut")}
				</Button>
				<Divider />
			</div>

			<div className="app-list apps-menu">
				<ul>
					{filteredApps
						.sort((a, b) => {
							return a.name > b.name ? 1 : -1;
						})
						.filter((app) => app.hasClient === undefined || app.hasClient)
						.map((app) => {
							const { appId, link, name } = app;
							const appIconSrc = `/_fileDownload?bucketName=app-icons&fileName=app.${appId.replace(
								/-app/g,
								""
							)}.png`;
							return (
								<li key={appId}>
									<a
										className="app-link"
										target={appId === "support" ? "_blank" : ""}
										href={link || `/${appId}/`}
										rel="noreferrer"
									>
										<div>
											<span
												className="app-icon"
												style={{
													backgroundImage: `url(${appIconSrc})`
												}}
											/>
										</div>
										<span className="label">{name}</span>
									</a>
								</li>
							);
						})}
				</ul>
			</div>
			<div
				style={{
					height: "44px",
					width: "100%",
					backgroundColor: "#41454a",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<EmailSendOutline
					style={{
						width: "24px",
						height: "48px",
						color: "rgba(255,255,255,0.5)"
					}}
				/>
				<Button
					id="send-support-email"
					color="primary"
					variant="text"
					sx={{
						textTransform: "none"
					}}
					disableTouchRipple={true}
					onClick={openMailClient}
				>
					{getTranslation("global.appMenu.main.emailSupport")}
				</Button>
			</div>
		</div>
	);
};

AppMenu.propTypes = propTypes;

export default AppMenu;
