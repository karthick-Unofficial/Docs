import React, { Component } from "react";

// Material UI
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import { EmailSendOutline } from "mdi-material-ui";

// components
import UserAvatar from "../UserAvatar";

// Utilities
import { transformRole as trans } from "./utility";
import { getTranslation } from "orion-components/i18n/I18nContainer";

export default class AppMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			supportURL: null
		};
	}

	componentDidMount() {
		const { org } = this.props;

		// -- load in org supportURL if available
		if (org && org.supportURL) {
			this.setState({
				supportURL: org.supportURL
			});
		}
	}

	openMailClient = () => {
		const { emailConfig } = this.props;

		// %0D%0A = line break
		const supportEmailBody = `
			${emailConfig.body}
			${"%0D%0A"}
			${"%0D%0A"}
			Additional Information
			${"%0D%0A"}
			Time: ${(new Date()).toString()}
			${"%0D%0A"}
			URL: ${window.location.href}
			${"%0D%0A"}
			${"%0D%0A"}
		`;

		window.location.href = `mailto:${emailConfig.address}?subject=${emailConfig.subject}&body=${supportEmailBody}`;
	}

	render() {
		const { user, logOut, dir } = this.props;
		const { applications } = user;
		const avatarStyles = {
			marginLeft: "16px"
		};
		const avatarStylesRTL = {
			marginRight: "16px"
		};

		// get user agent
		const ua = window.navigator.userAgent;

		// Check if using embedded browser
		const isMobile = ua.indexOf("CBMobile") > -1;

		const userApps = applications.filter(app => app.config.canView);
		const defaultApps = [
			{
				appId: "settings",
				name: getTranslation("global.appMenu.main.settings"),
				link: "/settings-app/my-account-settings"
			},
			{
				appId: "support",
				name: getTranslation("global.appMenu.main.support"),
				link: this.state.supportURL || "http://aressecuritycorp.com/contact/"
			}
		];

		// everyone has mobile home link
		if (isMobile) {
			userApps.push({
				appId: "mobileHome",
				name: getTranslation("global.appMenu.main.home"),
				link: "cbmobile://close-browser"
			});
		}

		const mapApp = userApps.find(app => app.appId === "map-app");
		if (mapApp) {
			userApps[userApps.indexOf(mapApp)].appId = "mapgl-app";
		}

		const filteredApps = [...userApps, ...defaultApps]
			.filter(app => !(window.location.href.indexOf(app.appId) > -1));

		// Remove logout on mobile
		const flatButtonStyles = isMobile
			? { marginLeft: "auto", visibility: "hidden" }
			: { marginLeft: "auto" };
		
		const flatButtonStylesRTL = isMobile
			? { marginRight: "auto", visibility: "hidden" }
			: { marginRight: "auto" };

		const title = user.ecoAdmin
			? getTranslation("global.appMenu.main.ecoAdmin")
			: user.admin
				? getTranslation("global.appMenu.main.orgAdmin")
				: trans(user.orgRole.title);

		return (
			<div className="app-menu-wrapper">
				<div className="user-info">
					<a href="/home" style={{ textDecoration: "none" }}>
						<UserAvatar user={user} size={40} style={dir && dir == "rtl" ? avatarStylesRTL : avatarStyles} />
					</a>
					<div className={dir == "rtl" ? "user-detailsRTL" : "user-details"}>
						<div>{user.name}</div>
						<span>{title}</span>
					</div>
					<FlatButton
						id="logout-button"
						label={getTranslation("global.appMenu.main.logOut")}
						style={dir && dir == "rtl" ? flatButtonStylesRTL : flatButtonStyles}
						labelStyle={{ paddingRight: 0, paddingLeft: 0 }}
						primary={true}
						onClick={logOut}
					/>
					<Divider />
				</div>

				<div className="app-list apps-menu">
					<ul>
						{filteredApps.sort((a, b) => {
							return a.name > b.name ? 1 : -1;
						}).map(app => {
							const { appId, link, name } = app;
							const appIconSrc = `/_fileDownload?bucketName=app-icons&fileName=app.${appId.replace(/-app/g, "")}.png`;
							return (
								<li key={appId}>
									<a
										className="app-link"
										target={appId === "support" ? "_blank" : ""}
										href={link || `/${appId}/`}
									>
										<div>
											<span className="app-icon" style={{ backgroundImage: `url(${appIconSrc})` }} />
										</div>
										<span className="label">{name}</span>
									</a>
								</li>
							);
						})}
					</ul>
				</div>
				<div style={{
					height: "44px",
					width: "100%",
					backgroundColor: "#41454a",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}>
					<EmailSendOutline style={{ width: "24px", height: "48px", color: "rgba(255,255,255,0.5)" }} />
					<FlatButton
						id="send-support-email"
						label={getTranslation("global.appMenu.main.emailSupport")}
						primary={true}
						labelStyle={{
							textTransform: "none"
						}}
						disableTouchRipple={true}
						onClick={this.openMailClient}
					/>
				</div>
			</div>
		);
	}
}
