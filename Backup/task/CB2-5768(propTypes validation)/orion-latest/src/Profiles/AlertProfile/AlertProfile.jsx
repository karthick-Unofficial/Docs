import React, { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Alert } from "orion-components/CBComponents/Icons";
import { TargetingIcon } from "orion-components/SharedComponents";
import { withStyles } from "@mui/styles";
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	IconButton,
	Tabs,
	Tab,
	Collapse,
	Button,
	Typography,
	Link,
	Tooltip
} from "@mui/material";
import { Cancel, ChatBubble, Videocam, Info, Undo } from "@mui/icons-material";
import { Pin, TooltipImage } from "mdi-material-ui";
import { timeConversion, eventService } from "client-app-core";
import { PinnedItemsWidget, Activities, CameraWidget, FileWidget } from "../Widgets/index";
import Measure from "react-measure";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { contextById } from "orion-components/ContextualData/Selectors";
import { notificationById } from "orion-components/GlobalData/Selectors";
import { fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import * as actionCreators from "./actions";
import uniq from "lodash/uniq";
import isArray from "lodash/isArray";

const styles = {
	tabs: {
		justifyContent: "space-between",
		color: "#B5B9BE",
		padding: "0px 12px"
	},
	tab: {
		minWidth: 0,
		"&:hover": {
			color: "#FFF"
		}
	},
	selected: {
		color: "#FFF",
		opacity: 1
	},
	button: {
		textTransform: "none"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	closeAlertProfile: PropTypes.func,
	closeNotification: PropTypes.func.isRequired,
	context: PropTypes.object,
	expanded: PropTypes.bool,
	getActivityDetails: PropTypes.func,
	handleExpand: PropTypes.func,
	loadProfile: PropTypes.func,
	measure: PropTypes.func,
	notification: PropTypes.object.isRequired,
	openAlertProfile: PropTypes.func,
	reopenNotification: PropTypes.func.isRequired,
	unsubscribeFromFeed: PropTypes.func,
	timeFormat: PropTypes.string,
	dir: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object,
	readOnly: PropTypes.bool,
	endDate: PropTypes.date,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	activityId: PropTypes.string,
	forReplay: PropTypes.bool
};

const defaultProps = {
	closeAlertProfile: () => { },
	context: null,
	expanded: false,
	getActivityDetails: () => { },
	handleExpand: () => { },
	loadProfile: () => { },
	measure: () => { },
	openAlertProfile: () => { },
	unsubscribeFromFeed: () => { },
	timeFormat: "12-hour",
	dir: "ltr",
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null
};

const AlertProfile = (props) => {
	const dispatch = useDispatch();

	const {
		measure,
		readOnly,
		endDate,
		id,
		activityId,
		selectFloorPlanOn,
		floorPlansWithFacilityFeed,
		classes,
		forReplay
	} = props;

	const {
		unsubscribeFromFeed,
		openAlertProfile,
		closeAlertProfile,
		closeNotification,
		reopenNotification,
		loadProfile,
		addSpotlight
	} = actionCreators;

	const spotlights = useSelector((state) => state.spotlights);
	const expandedAlert = useSelector((state) => state.appState.dock?.dockData?.expandedAlert);
	const context = useSelector((state) => contextById(activityId)(state));
	const notificationByID = useSelector((state) => notificationById(id)(state) || {});
	const spotlightProximity = useSelector((state) => state.appState.global?.spotlightProximity);
	const timeFormat = useSelector((state) => state.appState.global?.timeFormat);
	const appId = useSelector((state) => state.appId);
	const expanded = Boolean(id === expandedAlert);
	const notification = props.notification ? props.notification : notificationByID;
	const fullscreenCamera = useSelector((state) => fullscreenCameraOpen(state));
	const dir = useSelector((state) => getDir(state));

	const [tab, setTab] = useState(0);
	const [eventEnabled, setEventEnabled] = useState(false);

	const inlineStyles = {
		escalate: {
			color: "#4eb5f3",
			cursor: "pointer",
			fontSize: "14px",
			...(dir === "ltr" && { paddingRight: "12px" }),
			...(dir === "rtl" && { paddingLeft: "12px" })
		}
	};

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevExpanded = usePrevious(expanded);

	useEffect(() => {
		if (prevExpanded && !expanded) {
			handleCollapse();
		}
		measure();
	}, [expanded]);

	useEffect(() => {
		return () => {
			handleCollapse();
		};
	}, []);

	const handleUnsubscribe = () => {
		if (context) {
			const { subscriptions, entity } = context;
			const { id } = entity;
			Object.keys(subscriptions).forEach((subscription) =>
				dispatch(unsubscribeFromFeed(id, subscription, "dock"))
			);
		}
	};

	const handleChangeTab = (event, tab) => {
		setTab(tab);
		if (!context || !context.entity || !context.camerasInRange || !context.attachments || !context.activities) {
			dispatch(openAlertProfile(notification, forReplay));
		}
	};

	const handleCreateEscalate = (callback) => {
		const event = {
			name: notification.summary,
			startDate: notification.createdDate,
			id: notification.id
		};
		const body = JSON.stringify(event);
		eventService.escalateEvent(body, callback);
	};

	const handleEventEscalate = () => {
		handleCreateEscalate((err, res) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(loadProfile(res.id, res.name, res.entityType, "profile"));
			}
		});
	};

	const handleEnableEvent = () => {
		eventService.enableEvent(notification.object.id, (err, response) => {
			if (err) {
				console.log(err, response);
			} else {
				setEventEnabled(true);
			}
		});
	};

	const handleCollapse = () => {
		const { activityId } = notification;
		setTab(0);
		handleUnsubscribe();
		if (context && expanded) {
			dispatch(closeAlertProfile(activityId));
		}
	};

	const handleClose = () => {
		const { closed, id } = notification;
		closed ? dispatch(reopenNotification(notification)) : dispatch(closeNotification(id));
		measure();
	};

	const renderTabs = () => {
		const { entity, camerasInRange } = context;
		const { id, contextEntities, geometry } = entity;

		const cameraList = uniq([
			...((isArray(camerasInRange) && camerasInRange) || []),
			...((isArray(contextEntities) && contextEntities) || []).filter((ent) => ent.entityType === "camera")
		]);

		return (
			<CardContent style={{ padding: 0 }}>
				{tab === 0 && (
					<FileWidget contextId={id} readOnly={readOnly} subscriberRef="dock" isAlertProfile={true} />
				)}
				{tab === 1 && (
					<CameraWidget
						cameras={cameraList}
						contextId={id}
						entityType="activity"
						geometry={geometry}
						readOnly={readOnly}
						subscriberRef="dock"
						fullscreenCamera={fullscreenCamera}
						disableSlew={!geometry}
						disableLock={true}
						isAlertProfile={true}
						selectFloorPlanOn={selectFloorPlanOn}
						floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
					/>
				)}
				{tab === 2 && (
					<PinnedItemsWidget
						contextId={id}
						items={contextEntities}
						readOnly={readOnly}
						subscriberRef="dock"
						isAlertProfile={true}
					/>
				)}
				{tab === 3 && (
					<Activities
						contextId={entity.activityId ? entity.activityId : id}
						subscriberRef="dock"
						readOnly={readOnly}
						isAlertProfile={true}
						forReplay={forReplay}
						endDate={endDate}
					/>
				)}
			</CardContent>
		);
	};

	const { summary, activityDate, createdDate, isPriority, geometry, closed, target, object } = notification;
	const { button, tabs, selected } = classes;
	const spotlightsEnabled = !!spotlights && Object.values(spotlights).filter((s) => !!s).length < 3;

	// -- build out appropriate spotlight target
	let spotlightGeo = null;
	if (target && target.entity && target.entity.entityType === "camera") {
		spotlightGeo = target.entity.spotlightShape ? target.entity.spotlightShape : target.entity.entityData;
		spotlightGeo.spotlightProximity = spotlightProximity;
	} else if (object && object.entity && object.entity.entityType === "camera") {
		spotlightGeo = object.entity.spotlightShape ? object.entity.spotlightShape : object.entity.entityData;
		spotlightGeo.spotlightProximity = spotlightProximity;
	} else {
		spotlightGeo = geometry
			? { geometry }
			: target && target.entity && target.entity.entityData
				? target.entity.entityData
				: object && object.entity && object.entity.entityData
					? object.entity.entityData
					: null;
	}

	const isEvent = object && object.entity && object.entity.entityType === "event";
	const canEnableEvent = isEvent && !eventEnabled && object.entity.disabled === true;

	return (
		<Measure bounds onResize={measure}>
			{({ measureRef }) => (
				<div ref={measureRef}>
					<Card style={{ marginBottom: 12, borderRadius: 5 }}>
						<CardHeader
							sx={{ backgroundColor: "#494D53", color: "#fff" }}
							avatar={
								<div
									style={{
										display: "flex",
										alignItems: "center"
									}}
								>
									{geometry ? <TargetingIcon geometry={geometry} /> : null}
									{isPriority ? (
										<Alert fontSize="large" iconWidth="37px" iconHeight="37px" />
									) : (
										<Info fontSize="large" style={{ opacity: 0.3 }} />
									)}
								</div>
							}
							title={summary}
							titleTypographyProps={{
								style: {
									lineHeight: "1.25em",
									fontSize: "14px"
								}
							}}
							subheader={
								<Fragment>
									<Typography style={{ fontSize: "12px" }} color="#82878C">
										{timeConversion.convertToUserTime(
											activityDate || createdDate,
											`full_${timeFormat}`
										)}
									</Typography>
									{!closed && spotlightGeo && !!spotlights && (
										<Tooltip
											disableFocusListener={spotlightsEnabled}
											disableHoverListener={spotlightsEnabled}
											disableTouchListener={spotlightsEnabled}
											title={getTranslation("global.profiles.alertProfile.activeSpotlightsTxt")}
											placement="bottom-start"
										>
											<Link
												onClick={() => dispatch(addSpotlight(spotlightGeo))}
												underline="none"
												component={spotlightsEnabled ? "a" : "p"}
												color="textSecondary"
												style={{
													color: spotlightsEnabled ? "#4eb5f3" : "",
													display: !spotlightsEnabled ? "inline-block" : "",
													paddingRight: "12px",
													fontSize: "14px"
												}}
											>
												<Translate value="global.profiles.alertProfile.spotlight" />
											</Link>
										</Tooltip>
									)}
									<Fragment>
										{!closed &&
											(appId === "map-app" || appId === "mpo-app") &&
											!readOnly &&
											!isEvent && (
												<Link
													onClick={() => handleEventEscalate()}
													underline="none"
													color="textSecondary"
													style={inlineStyles.escalate}
												>
													<Translate value="global.profiles.alertProfile.escalate" />
												</Link>
											)}
									</Fragment>
									<Fragment>
										{!closed &&
											(appId === "map-app" || appId === "events-app") &&
											!readOnly &&
											canEnableEvent && (
												<Link
													onClick={() => handleEnableEvent()}
													variant="body1"
													underline="none"
													color="textSecondary"
													style={inlineStyles.escalate}
												>
													<Translate value="global.profiles.alertProfile.escalate" />
												</Link>
											)}
									</Fragment>
								</Fragment>
							}
							subheaderTypographyProps={{
								component: "div",
								styles: {
									color: "#fff"
								}
							}}
							action={
								!readOnly ? (
									closed ? (
										<IconButton
											style={{
												opacity: 1,
												color: "#B5B9BE"
											}}
											onClick={handleClose}
										>
											<Undo fontSize="small" />
										</IconButton>
									) : (
										<IconButton
											style={{
												opacity: 1,
												color: "#B5B9BE"
											}}
											onClick={handleClose}
										>
											<Cancel fontSize="small" />
										</IconButton>
									)
								) : null
							}
						/>

						{!closed && (
							<div style={{ backgroundColor: "#3D3F42" }}>
								<CardContent style={{ padding: 0 }}>
									<Tabs
										value={expanded ? tab : false}
										classes={{ flexContainer: tabs }}
										onChange={handleChangeTab}
										TabIndicatorProps={{
											style: { display: "none" }
										}}
									>
										<Tab
											classes={{
												root: classes.tab,
												selected
											}}
											icon={<TooltipImage className="alertProfileTabIcons" />}
										/>
										<Tab
											classes={{
												root: classes.tab,
												selected
											}}
											icon={<Videocam className="alertProfileTabIcons" />}
										/>
										<Tab
											classes={{
												root: classes.tab,
												selected
											}}
											icon={<Pin className="alertProfileTabIcons" />}
										/>
										<Tab
											classes={{
												root: classes.tab,
												selected
											}}
											icon={<ChatBubble className="alertProfileTabIcons" />}
										/>
									</Tabs>
								</CardContent>
								<Collapse in={tab !== false && expanded} unmountOnExit>
									{context && context.entity && renderTabs()}
									<CardActions>
										<Button
											fullWidth={true}
											color="primary"
											classes={{ root: button }}
											onClick={handleCollapse}
										>
											<Translate value="global.profiles.alertProfile.close" />
										</Button>
									</CardActions>
								</Collapse>
							</div>
						)}
					</Card>
				</div>
			)}
		</Measure>
	);
};

AlertProfile.propTypes = propTypes;
AlertProfile.defaultProps = defaultProps;

export default withStyles(styles)(AlertProfile);
