import React, { memo, useEffect, useMemo, useState } from "react";

// Sidebar
import Dock from "./Dock";

// Notification Item
import NewNotificationItem from "./shared/components/NewNotificationItem";

import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import SvgIcon from "@mui/material/SvgIcon";

// material icons
import InfoIcon from "@mui/icons-material/Info";
import { Error, Videocam, Image, Phone } from "@mui/icons-material";

import { ClipboardPulse } from "mdi-material-ui";
import { Alert } from "orion-components/CBComponents/Icons";

// custom theme
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles";
import customTheme from "./customTheme";
import { Dialog, NotificationsDialog } from "orion-components/CBComponents";

import { Translate, getTranslation } from "orion-components/i18n";
import { integrationService } from "client-app-core";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { startNotificationStream } from "./Notifications/actions";
import { getAllCameras } from "./Cameras/actions";
import { userCamerasSelector } from "./Cameras/selectors";
import { acknowledgeSystemNotification, clearSystemNotifications } from "../Services/SystemNotificationService/actions";
import { userIntegrationsOfEntityTypeSelector } from "orion-components/Session/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import * as actionCreators from "./actions";
import { mdiCheckboxMultipleMarked, mdiShieldCheck } from "@mdi/js";
import { unitService } from "client-app-core";
import find from "lodash/find";

const DockWrapper = (props) => {
	const dispatch = useDispatch();

	const { shouldStreamCameras, shouldStreamNotifications } = props;

	const { setTab, toggleOpen, getAppState, confirmFirstUse, clearNotification, logOut, toggleWavCam } =
		actionCreators;

	const dockData = useSelector((state) => state.appState.dock.dockData); //TODO: dockData.newAlerts
	const Notifications = useSelector((state) => state.globalData.notifications);

	let allNotifications = [];
	if (Notifications) {
		const activeNotifications = Notifications.activeItems.map((id) => Notifications.activeItemsById[id]);
		const archiveNotifications = Notifications.archiveItems.map((id) => Notifications.archiveItemsById[id]);

		allNotifications = activeNotifications.concat(archiveNotifications);
	}

	const cameraIntegrations = useSelector(
		(state) => userIntegrationsOfEntityTypeSelector("camera")(state),
		shallowEqual
	);
	const userCameras = useSelector((state) => userCamerasSelector(state));
	const appId = useSelector((state) => state.appId);
	const user = useSelector((state) => state.session.user);
	const { profile, firstUseText, sessionEnded, loggedOutManually } = user;
	const { firstUseAck, id } = profile;
	const hasSysHealthError = useSelector((state) => state.systemHealth.hasHealthError);
	const externalSystems = useSelector(
		(state) => (state.session && state.session.organization && state.session.organization.externalSystems) || []
	);
	const notifications = allNotifications;
	const componentState = dockData;
	const userHasCameras = cameraIntegrations && cameraIntegrations.length > 0;
	const userId = id;
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);
	const systemNotifications = useSelector((state) => state.systemNotifications);
	const dir = useSelector((state) => getDir(state));
	const { applications } = profile;
	const unitsApp = find(applications, { appId: "units-app" });
	const statusBoardApp = find(applications, { appId: "status-board-app" });

	const mql = window.matchMedia("(max-width: 750px)");

	const [panelWidth, setPanelWidth] = useState(mql.matches ? "100%" : "420px");
	const [zetronPhoneVisible, setZetronPhoneVisible] = useState(false);
	const [unitSettings, setUnitSettings] = useState([]);

	const handleTouchTap = (tab) => {
		dispatch(setTab(tab));
		dispatch(toggleOpen());
	};

	const handleAlertTouchTap = (tab) => {
		// document.getElementById("notification-tab-wrapper").scrollTop = 0;
		dispatch(setTab(tab));
		dispatch(toggleOpen());

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

			const easeOutQuad = (t) => {
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
		dispatch(getAppState());
		if (shouldStreamNotifications) {
			dispatch(startNotificationStream());
		}
		if (shouldStreamCameras) {
			dispatch(getAllCameras());
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
		mql.addListener((e) => {
			if (e.matches) {
				setPanelWidth("100%");
			} else {
				setPanelWidth(420);
			}
		});

		if (getUnitPanel(appId)) {
			unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", (err, response) => {
				if (err) {
					console.log("ERROR:", err);
				} else {
					setUnitSettings(response.value);
				}
			});
		}
	}, []);

	const getUnitPanel = (appName) => {
		switch (appName) {
			case "map-app":
				return true;

			default:
				return false;
		}
	};

	const handleConfirmFirstUse = () => {
		dispatch(confirmFirstUse(userId));
	};

	const openNotifications = useMemo(() => notifications.filter((item) => !item.closed), [notifications]);

	const alerts = useMemo(
		() =>
			openNotifications.filter((item) => {
				return item.isPriority;
			}),
		[openNotifications]
	);

	const nonPriority = useMemo(
		() =>
			openNotifications.filter((item) => {
				return !item.isPriority;
			}),
		[openNotifications]
	);

	const userHasWavCameras = useMemo(
		() =>
			userCameras.some(
				(cam) => cam.entityData.properties.features && cam.entityData.properties.features.includes("ribbon")
			),
		[userCameras]
	);

	const iconStyle = {
		height: "30px",
		width: "30px",
		color: "#FFF"
	};

	const badgeIconStyle = {
		height: "24px",
		width: "24px",
		color: "#FFF"
	};

	const dialogNotifications = systemNotifications
		.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
		.map((notification) => {
			const { id, title, content } = notification;
			return {
				title,
				textContent: content,
				confirm: {
					label: getTranslation("global.dock.dockWrapper.acknowledge"),
					action: () => {
						dispatch(acknowledgeSystemNotification(id));
					}
				}
			};
		});

	// Docked prop on drawer allows it to be closed via click-away
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={createTheme(customTheme)}>
				<div className={dir && dir === "rtl" ? "alert-sidebar-trayRTL" : "alert-sidebar-tray"}>
					<Dialog
						open={sessionEnded && !loggedOutManually}
						title={getTranslation("global.dock.dockWrapper.sessionExpired")}
						textContent={getTranslation("global.dock.dockWrapper.redirectLogin")}
						confirm={{
							label: getTranslation("global.dock.dockWrapper.ok"),
							action: () => dispatch(logOut())
						}}
						dir={dir}
						dialogContentStyles={{
							color: "#fff"
						}}
					/>
					<Dialog
						open={!firstUseAck}
						textContent={firstUseText}
						title={getTranslation("global.dock.dockWrapper.userAgreement")}
						confirm={{
							label: getTranslation("global.dock.dockWrapper.accept"),
							action: handleConfirmFirstUse
						}}
						abort={{
							label: getTranslation("global.dock.dockWrapper.decline"),
							action: () => dispatch(logOut())
						}}
						dir={dir}
					/>
					{!sessionEnded &&
						firstUseAck && ( // -- don't show notifications if firstUseAck dialog or sessionEnded dialog open
							<NotificationsDialog
								notifications={dialogNotifications}
								clearSystemNotifications={clearSystemNotifications}
								dir={dir}
							/>
						)}
					{getUnitPanel(appId) && unitsApp && unitsApp.permissions.includes("manage") && (
						<a
							className="link-wrapper"
							onClick={
								componentState.isOpen
									? () => dispatch(setTab("Units_panel"))
									: () => handleTouchTap("Units_panel")
							}
						>
							<SvgIcon
								style={{
									width: "24px",
									height: "24px",
									color: "#FFFFFF"
								}}
							>
								<path d={mdiShieldCheck} />
							</SvgIcon>
						</a>
					)}
					{statusBoardApp && (
						<a
							className="link-wrapper"
							onClick={
								componentState.isOpen
									? () => dispatch(setTab("Status_board"))
									: () => handleTouchTap("Status_board")
							}
						>
							<SvgIcon
								style={{
									width: "24px",
									height: "24px",
									color: "#FFFFFF"
								}}
							>
								<path d={mdiCheckboxMultipleMarked} />
							</SvgIcon>
						</a>
					)}

					{zetronPhoneVisible && (
						<a
							className="link-wrapper"
							onClick={
								componentState.isOpen
									? () => dispatch(setTab("Calling_Panel"))
									: () => handleTouchTap("Calling_Panel")
							}
						>
							<Phone
								style={{
									width: "24px",
									height: "24px",
									color: "#FFFFFF"
								}}
							/>
						</a>
					)}

					{(alerts.length > 0 || hasSysHealthError) && <div className="alert-bar-overlay" />}
					{alerts.length > 0 && (
						<a
							className="link-wrapper alert-wrapper"
							onClick={
								componentState.isOpen
									? () => dispatch(setTab("Notifications"))
									: () => handleAlertTouchTap("Notifications")
							}
						>
							<div
								className={
									"tray-icon alert-icon pulse bounce" + (alerts.length > 99 ? " high-count" : "")
								}
							>
								<div className="item-info">{alerts.length}</div>
							</div>
							<span>
								<Translate value="global.dock.dockWrapper.alerts" />
							</span>
						</a>
					)}
					<a
						className="link-wrapper"
						onClick={
							componentState.isOpen
								? () => dispatch(setTab("System_health"))
								: () => handleTouchTap("System_health")
						}
					>
						{hasSysHealthError ? (
							<Badge
								badgeContent={
									<Alert
										iconStyles={{
											marginTop: "30px",
											fontSize: "20px"
										}}
										iconColor="#C64849"
									/>
								}
							>
								<ClipboardPulse
									style={{
										width: "24px",
										height: "48px",
										color: "#FFF"
									}}
								/>
							</Badge>
						) : (
							<ClipboardPulse
								style={{
									width: "24px",
									height: "24px",
									color: "#FFF"
								}}
							/>
						)}
					</a>
					<a
						className="link-wrapper"
						onClick={
							componentState.isOpen
								? () => dispatch(setTab("Notifications"))
								: () => handleTouchTap("Notifications")
						}
					>
						{nonPriority.length > 0 ? (
							<Badge
								badgeContent={<Error color="#c64849" />}
								badgeStyle={{
									width: 16,
									height: 16,
									top: 24,
									right: 10
								}}
							>
								<InfoIcon className="info-icon" style={badgeIconStyle} />
							</Badge>
						) : (
							<InfoIcon className="info-icon" style={iconStyle} />
						)}
					</a>
					{userHasWavCameras && (
						<a className="link-wrapper" onClick={() => dispatch(toggleWavCam())}>
							<Image
								style={{
									color: "white",
									width: "24px",
									height: "24px"
								}}
							/>
						</a>
					)}
					{userHasCameras && (
						<a
							className="link-wrapper"
							onClick={
								componentState.isOpen
									? () => dispatch(setTab("Cameras"))
									: () => handleTouchTap("Cameras")
							}
						>
							<Videocam
								style={{
									width: "24px",
									height: "24px",
									color: "#FFF"
								}}
							/>
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
						open={componentState.isOpen}
						anchor={dir === "rtl" ? "left" : "right"}
						sx={{
							["& .MuiDrawer-paper"]: {
								width: componentState.isOpen ? panelWidth : " 420px",
								backgroundColor: "#2C2B2D",
								position: "fixed!important",
								height: "calc(100vh - 48px) !important",
								top: "48px !important",
								overflow: " visible !important"
							}
						}}
						variant="persistent"
					>
						<div onClick={() => dispatch(toggleOpen())} className="ad-toggle-mobile" />
						{componentState.isOpen && (
							<Dock
								{...props}
								dir={dir}
								setTab={setTab}
								componentState={componentState}
								toggleOpen={toggleOpen}
								notifications={notifications}
								unitSettings={unitSettings}
								statusBoardApp={statusBoardApp}
							/>
						)}
					</Drawer>
				</div>
			</ThemeProvider>
		</StyledEngineProvider>
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
