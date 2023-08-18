import React, { memo, useEffect, useState } from "react";

// Sidebar
import Dock from "./Dock";

// Notification Item
import NewNotificationItem from "./shared/components/NewNotificationItem";

// material-ui
import Drawer from "material-ui/Drawer";
import Badge from "material-ui/Badge";

// material icons
import InfoIcon from "material-ui/svg-icons/action/info";
import Alert from "material-ui/svg-icons/alert/error";

import Videocam from "material-ui/svg-icons/av/videocam";
import { Image, Phone } from "@material-ui/icons";
import { ClipboardPulse } from "mdi-material-ui";


// custom theme
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import customTheme from "./customTheme";
import { Dialog, NotificationsDialog } from "orion-components/CBComponents";

import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { integrationService } from "client-app-core";


const DockWrapper = (props) => {

	const {
		setTab,
		toggleOpen,
		getAppState,
		shouldStreamCameras,
		shouldStreamNotifications,
		startNotificationStream,
		getAllCameras,
		externalSystems,
		userId, confirmFirstUse,
		componentState,
		notifications,
		clearNotification,
		userHasCameras,
		userCameras,
		sessionEnded,
		logOut,
		firstUseAck,
		firstUseText,
		hasSysHealthError,
		toggleWavCam,
		timeFormatPreference,
		systemNotifications,
		acknowledgeSystemNotification,
		clearSystemNotifications,
		dir
	} = props;

	const mql = window.matchMedia("(max-width: 750px)");

	const [panelWidth, setPanelWidth] = useState(mql.matches ? "100%" : 420);
	const [zetronPhoneVisible, setZetronPhoneVisible] = useState(false);

	const handleTouchTap = (tab) => {
		setTab(tab);
		toggleOpen();
	};

	const handleAlertTouchTap = (tab) => {
		// document.getElementById("notification-tab-wrapper").scrollTop = 0;
		setTab(tab);
		toggleOpen();

		setTimeout(() => {
			const container = document.getElementById("notification-tab-wrapper");
			const target = document.getElementById("first-priority");
			scrollTo(container, target, 300);
		}, 1000);
	};

	const scrollTo = (element, destinationElement, duration) => {
		// This only works if scrolling from scrollTop 0 atm
		if (element && destinationElement && duration) {
			const destination = destinationElement.offsetTop - 80;
			const distance = destination - element.scrollTop;

			const easeOutQuad = t => {
				return t * (2 - t);
			};

			let time = 0;
			while (time < duration) {
				(function (time) {
					setTimeout(() => {
						const tValue = time / duration;
						const transformedT = easeOutQuad(tValue);
						element.scrollTop = distance * transformedT;
					}, time);
				})((time += 10));
			}
		}

	};

	useEffect(() => {
		getAppState();
		if (shouldStreamNotifications) {
			startNotificationStream();
		}
		if (shouldStreamCameras) {
			getAllCameras();
		}

		const serviceCallBack = (err, response) => {
			if (err) {
				if (!zetronPhoneVisible) {
					setZetronPhoneVisible(false);
				}
			} else {
				if (response.clientInstalled) {
					setZetronPhoneVisible(true);
				}
			}
		};

		if (externalSystems) {
			if (externalSystems && externalSystems.length > 0) {
				const flagTmp = externalSystems.includes("zetron");
				if (flagTmp) {
					integrationService.getExternalSystemLookup("zetron", "serviceAvailableToUser", serviceCallBack);
				}
			}
		}
		// Listen for changes in screen size and adjust width accordingly
		const mql = window.matchMedia("(max-width: 750px)");
		mql.addListener(e => {
			if (e.matches) {
				setPanelWidth("100%");
			} else {
				setPanelWidth(420);
			}
		});
	}, []);

	const trimSummary = summary => {
		if (summary.length > 80) {
			return summary.slice(0, 74) + "... (cont.)";
		} else {
			return summary;
		}
	};

	const handleConfirmFirstUse = () => {
		confirmFirstUse(userId);
	};

	const openNotifications = notifications.filter(item => !item.closed);

	const alerts = openNotifications.filter(item => {
		return item.isPriority;
	});

	const nonPriority = openNotifications.filter(item => {
		return !item.isPriority;
	});

	const userHasWavCameras = userCameras.some(cam =>
		cam.entityData.properties.features && cam.entityData.properties.features.includes("ribbon")
	);

	const containerStyle = {
		backgroundColor: "#2C2B2D"
	};

	const iconStyle = {
		height: "30px",
		width: "30px"
	};

	const badgeIconStyle = {
		height: "24px",
		width: "24px"
	};

	const dialogNotifications = systemNotifications
		.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
		.map(notification => {
			const { id, title, content } = notification;
			return {
				title,
				textContent: content,
				confirm: {
					label: getTranslation("global.dock.dockWrapper.acknowledge"),
					action: () => {
						acknowledgeSystemNotification(id);
					}
				}
			};
		});

	// Docked prop on drawer allows it to be closed via click-away
	return (
		<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
			<div className={dir && dir === "rtl" ? "alert-sidebar-trayRTL" : "alert-sidebar-tray"}>
				<Dialog
					open={sessionEnded}
					title={getTranslation("global.dock.dockWrapper.sessionExpired")}
					textContent={getTranslation("global.dock.dockWrapper.redirectLogin")}
					confirm={{ label: getTranslation("global.dock.dockWrapper.ok"), action: logOut }}
					dir={dir}
				/>
				<Dialog
					open={!firstUseAck}
					textContent={firstUseText}
					title={getTranslation("global.dock.dockWrapper.userAgreement")}
					confirm={{ label: getTranslation("global.dock.dockWrapper.accept"), action: handleConfirmFirstUse }}
					abort={{ label: getTranslation("global.dock.dockWrapper.decline"), action: logOut }}
					dir={dir}
				/>
				{!sessionEnded && firstUseAck &&	// -- don't show notifications if firstUseAck dialog or sessionEnded dialog open
					<NotificationsDialog
						notifications={dialogNotifications}
						clearSystemNotifications={clearSystemNotifications}
						dir={dir}
					/>
				}
				{zetronPhoneVisible &&
					<a
						className="link-wrapper"
						onClick={
							componentState.isOpen
								? () => setTab("Calling_Panel")
								: () => handleTouchTap("Calling_Panel")
						}
					>
						<Phone style={{ width: "24px", height: "24px", color: "#FFFFFF" }} />
					</a>
				}

				{(alerts.length > 0 || hasSysHealthError) && <div className="alert-bar-overlay" />}
				{alerts.length > 0 && (
					<a
						className="link-wrapper alert-wrapper"
						onClick={
							componentState.isOpen
								? () => setTab("Notifications")
								: () => handleAlertTouchTap("Notifications")
						}
					>
						<div
							className={
								"tray-icon alert-icon pulse bounce" +
								(alerts.length > 99 ? " high-count" : "")
							}
						>
							<div className="item-info">{alerts.length}</div>
						</div>
						<span><Translate value="global.dock.dockWrapper.alerts" /></span>
					</a>
				)}
				<a
					className="link-wrapper"
					onClick={
						componentState.isOpen
							? () => setTab("System_health")
							: () => handleTouchTap("System_health")
					}
				>
					{hasSysHealthError ? (
						<Badge
							badgeContent={<Alert color="#c64849" />}
							badgeStyle={{ width: 16, height: 16, top: 24, right: 10 }}
						>
							<ClipboardPulse style={{ width: "24px", height: "48px", color: "#FFF" }} />
						</Badge>
					) : (
						<ClipboardPulse style={{ width: "24px", height: "24px", color: "#FFF" }} />
					)}
				</a>
				<a
					className="link-wrapper"
					onClick={
						componentState.isOpen
							? () => setTab("Notifications")
							: () => handleTouchTap("Notifications")
					}
				>
					{nonPriority.length > 0 ? (
						<Badge
							badgeContent={<Alert color="#c64849" />}
							badgeStyle={{ width: 16, height: 16, top: 24, right: 10 }}
						>
							<InfoIcon className="info-icon" style={badgeIconStyle} />
						</Badge>
					) : (
						<InfoIcon className="info-icon" style={iconStyle} />
					)}
				</a>
				{userHasWavCameras && (
					<a
						className="link-wrapper"
						onClick={
							() => toggleWavCam()
						}
					>
						<Image style={{ color: "white", width: "24px", height: "24px" }} />
					</a>
				)}
				{userHasCameras && (
					<a
						className="link-wrapper"
						onClick={
							componentState.isOpen
								? () => setTab("Cameras")
								: () => handleTouchTap("Cameras")
						}
					>
						<Videocam style={{ width: "24px", height: "24px" }} />
					</a>
				)}
				<div className="new-alerts">
					{componentState.newAlerts.length > 0 && (
						<div key={componentState.newAlerts[0].id}>
							<NewNotificationItem
								notification={componentState.newAlerts[0]}
								key={componentState.newAlerts[0].id}
								isLonely={componentState.newAlerts.length === 1}
								clearNotification={clearNotification}
								timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
							/>
						</div>
					)}
				</div>
				<Drawer
					docked={true}
					open={componentState.isOpen}
					containerStyle={containerStyle}
					containerClassName="drawer-container"
					openSecondary={dir == "rtl" ? false : true}
					overlayStyle={{ backgroundColor: "rgba(0,0,0,0)" }}
					width={componentState.isOpen ? panelWidth : 420}
					onRequestChange={() => toggleOpen()}
				>
					<div
						onClick={() => toggleOpen()}
						className="ad-toggle-mobile"
					/>
					{componentState.isOpen && <Dock {...props} dir={dir} />}
				</Drawer>
			</div>
		</MuiThemeProvider>
	);
};

DockWrapper.defaultProps = {
	shouldStreamNotifications: true
};

//const shouldComponentUpdate = (prevProps, nextProps) => {
//	return (
//		isEqual(nextProps, prevProps)
//	);
//}

export default memo(DockWrapper);
