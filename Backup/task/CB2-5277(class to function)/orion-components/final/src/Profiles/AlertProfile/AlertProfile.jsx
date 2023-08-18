import React, { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Alert } from "orion-components/CBComponents/Icons";
import { TargetingIcon } from "orion-components/SharedComponents";
import { withStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import { Cancel, ChatBubble, Videocam, Info, Undo } from "@material-ui/icons";
import { Pin, TooltipImage } from "mdi-material-ui";
import { timeConversion, eventService } from "client-app-core";
import {
	PinnedItemsWidget,
	Activities,
	CameraWidget,
	FileWidget
} from "../Widgets/index";
import Measure from "react-measure";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

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
	addCameraToDockMode: PropTypes.func,
	classes: PropTypes.object.isRequired,
	closeAlertProfile: PropTypes.func,
	closeNotification: PropTypes.func.isRequired,
	context: PropTypes.object,
	dockedCameras: PropTypes.array,
	expanded: PropTypes.bool,
	getActivityDetails: PropTypes.func,
	handleExpand: PropTypes.func,
	loadProfile: PropTypes.func,
	measure: PropTypes.func,
	notification: PropTypes.object.isRequired,
	openAlertProfile: PropTypes.func,
	reopenNotification: PropTypes.func.isRequired,
	unsubscribeFromFeed: PropTypes.func,
	userFeeds: PropTypes.array,
	timeFormat: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	addCameraToDockMode: () => { },
	closeAlertProfile: () => { },
	context: null,
	dockedCameras: [],
	expanded: false,
	getActivityDetails: () => { },
	handleExpand: () => { },
	loadProfile: () => { },
	measure: () => { },
	openAlertProfile: () => { },
	unsubscribeFromFeed: () => { },
	userFeeds: [],
	timeFormat: "12-hour",
	dir: "ltr",
	locale: "en",
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null
};

const AlertProfile = ({
	expanded,
	measure,
	context,
	unsubscribeFromFeed,
	notification, openAlertProfile, forReplay,
	closeAlertProfile,
	closeNotification,
	reopenNotification,
	addCameraToDockMode,
	removeDockedCameraAndState,
	dockedCameras,
	userFeeds,
	loadProfile,
	user,
	dialog,
	openDialog,
	closeDialog,
	setCameraPriority,
	fullscreenCamera,
	readOnly,
	timeFormat,
	endDate,
	dir,
	locale,
	selectFloorPlanOn,
	floorPlansWithFacilityFeed,
	classes,
	addSpotlight,
	spotlights,
	spotlightProximity,
	appId
}) => {
	const [tab, setTab] = useState(0);
	const [eventEnabled, setEventEnabled] = useState(false);
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
			Object.keys(subscriptions).forEach(subscription =>
				unsubscribeFromFeed(id, subscription, "dock")
			);
		}
	};

	const handleChangeTab = (event, tab) => {
		setTab(tab);
		if (!context) {
			openAlertProfile(notification, forReplay);
		}
	};

	const handleCreateEscalate = (callback) => {
		const event = { name: notification.summary, startDate: notification.createdDate, id: notification.id };
		const body = JSON.stringify(event);
		eventService.escalateEvent(body, callback);
	};

	const handleEventEscalate = () => {
		handleCreateEscalate((err, res) => {
			if (err) {
				console.log(err);
			} else {
				loadProfile(res.id, res.name, res.entityType, "profile", );
			}
		});
	};

	const handleEnableEvent = () => {
		eventService.enableEvent(notification.object.id, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				setEventEnabled(true);
			}
		});
	};

	const handleCollapse = () => {
		const { activityId } = notification;
		setTab(0);
		handleUnsubscribe();
		if (context && expanded) {
			closeAlertProfile(activityId);
		}
	};

	const handleClose = () => {
		const { closed, id } = notification;
		closed ? reopenNotification(notification) : closeNotification(id);
		measure();
	};

	const renderTabs = () => {
		const { entity, camerasInRange, attachments, activities } = context;
		const { id, contextEntities, geometry } = entity;

		const cameraList = _.uniq([...(camerasInRange || []), ...(contextEntities || []).filter(ent => ent.entityType === "camera")]);

		return (
			<CardContent style={{ padding: 0 }}>
				{tab === 0 && (
					<FileWidget
						attachments={attachments}
						contextId={id}
						enabled={true}
						readOnly={readOnly}
						subscriberRef="dock"
						isAlertProfile={true}
						dir={dir}
					/>
				)}
				{tab === 1 && (
					<CameraWidget
						addCameraToDockMode={addCameraToDockMode}
						cameras={cameraList}
						contextId={id}
						dockedCameras={dockedCameras}
						entityType="activity"
						geometry={geometry}
						enabled={true}
						loadProfile={loadProfile}
						readOnly={readOnly}
						subscriberRef="dock"
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						setCameraPriority={setCameraPriority}
						fullscreenCamera={fullscreenCamera}
						user={user}
						disableSlew={!geometry}
						removeDockedCamera={removeDockedCameraAndState}
						isAlertProfile={true}
						dir={dir}
						selectFloorPlanOn={selectFloorPlanOn}
						floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
					/>
				)}
				{tab === 2 && (
					<PinnedItemsWidget
						contextId={id}
						event={entity}
						items={contextEntities}
						feeds={userFeeds}
						enabled={true}
						loadProfile={loadProfile}
						readOnly={readOnly}
						subscriberRef="dock"
						isAlertProfile={true}
						dir={dir}
					/>
				)}
				{tab === 3 && (
					<Activities
						contextId={id}
						entity={{ entityType: "activity" }}
						activities={activities}
						enabled={true}
						subscriberRef="dock"
						userId={user.id}
						readOnly={readOnly}
						isAlertProfile={true}
						forReplay={forReplay}
						endDate={endDate}
						timeFormatPreference={timeFormat ? timeFormat : "12-hour"}
						dir={dir}
						locale={locale}
					/>
				)}
			</CardContent>
		);
	};

	const {
		summary,
		activityDate,
		createdDate,
		isPriority,
		geometry,
		closed,
		contextEntities,
		target,
		object
	} = notification;
	const { button, tabs, selected } = classes;
	const spotlightsEnabled =
		!!spotlights && Object.values(spotlights).filter(s => !!s).length < 3;

	// -- build out appropriate spotlight target
	let spotlightGeo = null;
	if (target && target.entity && target.entity.entityType === "camera") {
		spotlightGeo = target.entity.spotlightShape ? target.entity.spotlightShape : target.entity.entityData;
		spotlightGeo.spotlightProximity = spotlightProximity;
	}
	else if (object && object.entity && object.entity.entityType === "camera") {
		spotlightGeo = object.entity.spotlightShape ? object.entity.spotlightShape : object.entity.entityData;
		spotlightGeo.spotlightProximity = spotlightProximity;
	}
	else {
		spotlightGeo = geometry ? { geometry } : (target && target.entity && target.entity.entityData ? target.entity.entityData :
			object && object.entity && object.entity.entityData ? object.entity.entityData : null);
	}

	const isEvent = object && object.entity && object.entity.entityType === "event";
	const canEnableEvent = isEvent && !eventEnabled && object.entity.disabled === true;

	return (
		<Measure bounds onResize={measure}>
			{({ measureRef }) => (
				<div ref={measureRef}>
					<Card style={{ marginBottom: 12, borderRadius: 5 }}>
						<CardHeader
							avatar={
								<div style={{ display: "flex", alignItems: "center" }}>
									<TargetingIcon geometry={geometry} />
									{isPriority ? (
										<Alert fontSize="large" />
									) : (
										<Info fontSize="large" style={{ opacity: 0.3 }} />
									)}
								</div>
							}
							title={summary}
							titleTypographyProps={{
								style: { lineHeight: "1.25em" },
								variant: "body1"
							}}
							subheader={
								<Fragment>
									<Typography variant="body2">
										{timeConversion.convertToUserTime((activityDate || createdDate), `full_${timeFormat}`)}
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
												onClick={() =>
													addSpotlight(spotlightGeo)
												}
												variant="body1"
												underline="none"
												component={spotlightsEnabled ? "a" : "p"}
												color="textSecondary"
												style={{
													color: spotlightsEnabled ? "#4eb5f3" : "",
													display: !spotlightsEnabled ? "inline-block" : "",
													paddingRight: "12px"
												}}
											>
												<Translate value="global.profiles.alertProfile.spotlight" />
											</Link>
										</Tooltip>
									)}
									<Fragment>
										{!closed && (appId === "map-app" || appId === "mpo-app") && !readOnly && !isEvent && (
											<Link
												onClick={() =>
													handleEventEscalate()
												}
												variant="body1"
												underline="none"
												color="textSecondary"
												style={dir == "rtl" ? {
													color: "#4eb5f3",
													paddingLeft: "12px",
													cursor: "pointer"
												} : {
													color: "#4eb5f3",
													paddingRight: "12px",
													cursor: "pointer"
												}}
											>
												<Translate value="global.profiles.alertProfile.escalate" />
											</Link>
										)}
									</Fragment>
									<Fragment>
										{!closed && (appId === "map-app" || appId === "events-app") && !readOnly && canEnableEvent && (
											<Link
												onClick={() =>
													handleEnableEvent()
												}
												variant="body1"
												underline="none"
												color="textSecondary"
												style={dir == "rtl" ? {
													color: "#4eb5f3",
													paddingLeft: "12px"
												} : {
													color: "#4eb5f3",
													paddingRight: "12px"
												}}
											>
												<Translate value="global.profiles.alertProfile.escalate" />
											</Link>
										)}
									</Fragment>
								</Fragment>
							}
							subheaderTypographyProps={{
								component: "div"
							}}
							action={
								!readOnly ? closed ? (
									<IconButton
										style={{ opacity: 1, color: "#B5B9BE" }}
										onClick={handleClose}
									>
										<Undo fontSize="small" />
									</IconButton>
								) : (
									<IconButton
										style={{ opacity: 1, color: "#B5B9BE" }}
										onClick={handleClose}
									>
										<Cancel fontSize="small" />
									</IconButton>
								) : (
									null
								)
							}
						/>

						{!closed && (
							<div style={{ backgroundColor: "#3D3F42" }}>
								<CardContent style={{ padding: 0 }}>
									<Tabs
										value={expanded ? tab : false}
										classes={{ flexContainer: tabs }}
										onChange={handleChangeTab}
										TabIndicatorProps={{ style: { display: "none" } }}
									>
										<Tab
											classes={{ root: classes.tab, selected }}
											icon={<TooltipImage />}
										/>
										<Tab
											classes={{ root: classes.tab, selected }}
											icon={<Videocam />}
										/>
										<Tab
											classes={{ root: classes.tab, selected }}
											icon={<Pin />}
										/>
										<Tab
											classes={{ root: classes.tab, selected }}
											icon={<ChatBubble />}
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
