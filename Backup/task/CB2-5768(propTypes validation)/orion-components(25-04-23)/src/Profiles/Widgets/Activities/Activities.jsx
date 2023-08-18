import React, { Fragment, useState, useEffect, useRef } from "react";
import { withSpan } from "../../../Apm";
import { activityService, eventService } from "client-app-core";
import {
	IconButton,
	Button,
	Checkbox,
	Typography,
	Divider,
	FormControlLabel,
	DialogActions,
	TextField
} from "@mui/material";
import { Dialog } from "orion-components/CBComponents";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import { default as Settings } from "@mui/icons-material/Settings";
import Activity from "./components/Activity";
import moment from "moment";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import uniqBy from "lodash/uniqBy";
import intersection from "lodash/intersection";
import difference from "lodash/difference";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

//actions
import { updateActivityFilters } from "orion-components/SharedActions/commonActions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { persistedState } from "orion-components/AppState/Selectors";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";

const propTypes = {
	id: PropTypes.string,
	activities: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	selected: PropTypes.bool,
	selectWidget: PropTypes.func,
	readOnly: PropTypes.bool,
	contextId: PropTypes.string,
	subscriberRef: PropTypes.any,
	entityType: PropTypes.string,
	canManage: PropTypes.bool,
	forReplay: PropTypes.bool,
	endDate: PropTypes.date,
	isAlertProfile: PropTypes.bool,
	entity: PropTypes.object,
	dialog: PropTypes.string,
	displayType: PropTypes.string
};

const useStyles = makeStyles({
	input: {
		color: "#fff",
		fontSize: "0.75rem",
		"&::placeholder": {
			opacity: "0.7"
		}
	}
});

const Activities = (props) => {
	const {
		id,
		activities,
		contextId,
		subscriberRef,
		selectWidget,
		entityType,
		entity,
		forReplay,
		endDate,
		canManage,
		selected,
		readOnly,
		isAlertProfile,
		displayType
	} = props;
	const dispatch = useDispatch();
	const classes = useStyles();

	const activityFilters = useSelector((state) => entity && persistedState(state).activityFilters);
	const dialog = useSelector((state) => entity && state.appState.dialog.openDialog);
	const app = useSelector((state) => state.appId || state.clientConfig.app);
	const enabled = useSelector((state) => isAlertProfile || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state.i18n.locale);
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat) || "12 hours";
	const isPrimary = useSelector(
		(state) => entity && contextId === contextPanelState(state).selectedContext.primary
	);
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable, widgetsLaunchable } = launchableAndExpandable;

	const [comment, setComment] = useState("");
	const [filters, setFilters] = useState(activityFilters);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [activitiesState, setActivitiesState] = useState(activities || []);
	const [loadMore, setLoadMore] = useState(true);

	const inlineStyles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "ltr" && { paddingRight: 0 }),
			...(dir === "rtl" && { paddingLeft: 0 })
		}
	};

	useEffect(() => {
		getActivities();
	}, []);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		if (prevProps) {
			if (!isEqual(activities, prevProps.activities)) {
				setActivitiesState(uniqBy([...activitiesState, ...activities], "id"));
			}
		}
	}, [activities]);

	useEffect(() => {
		return () => {
			if (!isPrimary && unsubscribeFromFeed)
				dispatch(unsubscribeFromFeed(contextId, "activities", subscriberRef));
		};
	}, []);

	// selectWidget
	const handleExpand = () => {
		dispatch(selectWidget("Activity Timeline"));
	};

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/activity-timeline`);
		} else if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/activity-timeline`);
		} else if (entityType === "facility") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		}
	};

	const handleChange = (event) => {
		if (event.target.value.length > 280) {
			setError(getTranslation("global.profiles.widgets.activities.main.errorText.commentsTxt"));
			return;
		}
		setComment(event.target.value);
		setError("");
	};

	const handleAddComment = () => {
		//const { entityType } = entity;
		const EntityType = entity.entityType;
		// If not an event, use generic add comment,
		if (EntityType !== "event") activityService.comment(contextId, EntityType, comment);
		// Otherwise, use event-specific add comment (events work differently than entities)
		else {
			eventService.addComment(contextId, comment, (err, res) => {
				if (err) {
					console.log(err, res);
				} else {
					// Update event's 'lastModified' property
					eventService.mockUpdateEvent(contextId, (err, response) => {
						if (err) {
							console.log(err, response);
						}
					});
				}
			});
		}
		setComment("");
		setError("");
	};

	const handleUpdateFilter = (values) => {
		let newFilters = filters ? [...filters] : [];
		if (intersection(newFilters, values).length > 0) {
			newFilters = difference(newFilters, values);
		} else {
			newFilters = [...newFilters, ...values];
		}
		// if (expanded) {
		// 	updateActivityFilters({ activityFilters: newFilters });
		// }
		setFilters(newFilters);
	};

	const handleCancelFilter = () => {
		setFilters(activityFilters || []);
		closeFilterDialog();
	};

	const handleSaveFilter = () => {
		dispatch(updateActivityFilters(app, { activityFilters: filters }));
		closeFilterDialog();
	};

	const getActivities = () => {
		const EntityType = entity.entityType;
		const streamedActivities = !forReplay && activities ? activities : [];
		const sorted = activitiesState.sort((a, b) => moment.utc(a.published).diff(moment.utc(b.published)));
		const initial = forReplay ? endDate : new Date().toISOString();
		const date = sorted.length > 0 ? sorted[0].published : initial;
		EntityType === "event"
			? activityService.getActivitiesByEvent(
				contextId, //eventId
				5, //pageSize
				date, //fromDate
				null,
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							setActivitiesState(uniqBy([...activitiesState, ...streamedActivities, ...res], "id"));
						}
						// If it's the end of activities
						if (res.length < 5) {
							setLoadMore(false);
						}
					}
				}
			)
			: activityService.getActivitiesByEntity(
				EntityType, //entityType
				contextId, //Id
				5, //pageSize
				date, //fromDate
				null,
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							setActivitiesState(uniqBy([...activitiesState, ...streamedActivities, ...res], "id"));
						}
						// If it's the end of activities
						if (res.length < 5) {
							setLoadMore(false);
						}
					}
				}
			);
	};

	// This will load the first 5 activities older than the oldest visible activity
	const handleNextPage = () => {
		getActivities();
		setPage(page + 1);
	};

	const closeFilterDialog = () => {
		dispatch(closeDialog("activityFilterDialog"));
	};

	const openFilterDialog = () => {
		dispatch(openDialog("activityFilterDialog"));
	};

	const capitalizeFirstLetter = (string) => {
		if (locale === "en") {
			return string.charAt(0).toUpperCase() + string.slice(1);
		} else if (locale === "ar") {
			switch (string) {
				case "camera": {
					return getTranslation("global.profiles.widgets.activities.main.camera");
				}
				case "event": {
					return getTranslation("global.profiles.widgets.activities.main.event");
				}
				case "shapes": {
					return getTranslation("global.profiles.widgets.activities.main.shapes");
				}
				case "accessPoint": {
					return getTranslation("global.profiles.widgets.activities.main.accessPoints");
				}
				default:
					return string;
			}
		}
	};

	const { owner } = entity;
	const EntityType = entity.entityType;

	const disabledStyle = {
		button: {
			width: "100%",
			minWidth: 0,
			height: 50,
			margin: ".75rem 0",
			borderRadius: 5,
			backgroundColor: "#6C6C6E",
			padding: "0 9px",
			color: "#fff"
		},
		buttonBorder: {
			borderRadius: 5,
			backgroundColor: "#6C6C6E"
		},
		buttonLabel: {
			width: "100%",
			paddingLeft: 9,
			paddingRight: 9,
			textTransform: "none",
			color: "#ffffff"
		}
	};
	const inputStyle = {
		field: {
			fontSize: ".75rem",
			border: "1px solid #828283",
			padding: "10px 10px 0",
			margin: ".75rem 0",
			width: "100%",
			backgroundColor: "#1F1F21",
			color: "#fff",
			minHeight: "72px"
		},
		button: {
			width: "100%",
			minWidth: 0,
			height: 50,
			margin: ".75rem 0",
			borderRadius: 5,
			color: "#fff",
			padding: "0 9px"
		},
		buttonBorder: {
			borderRadius: 5
		},
		buttonLabel: {
			width: "100%",
			paddingLeft: 9,
			paddingRight: 9,
			textTransform: "none"
		}
	};

	const filterActions = [
		<Button
			key="cancel-action-button"
			variant="text"
			style={{ color: "#fff" }}
			color="primary"
			onClick={handleCancelFilter}
		>
			{getTranslation("global.profiles.widgets.activities.main.cancel")}
		</Button>,
		<Button
			key="confirm-action-button"
			variant="text"
			style={{ color: "#fff" }}
			color="primary"
			onClick={handleSaveFilter}
		>
			{getTranslation("global.profiles.widgets.activities.main.confirm")}
		</Button>
	];

	const activityDialogActions = () => {
		return <DialogActions>{filterActions}</DialogActions>;
	};
	// activities don't have the usual properties that allow for ownership checking, but if a user has access to an activity, it's safe to assume they have the proper access to comment
	const canComment = !readOnly && (!owner && EntityType === "activity" ? true : canManage);
	/**
	 * This is a quick fix til activity filtering becomes more robust.
	 * If there are no filters, or the length of this filters is greater than 1,
	 * i.e. the filter does not just include "comment", show all activities
	 */
	let filteredActivities = activitiesState;
	if (activityFilters) {
		const showUpdates = activityFilters.length > 1;
		const showComments = activityFilters.includes("comment");
		filteredActivities =
			!activityFilters.length || (showUpdates && showComments)
				? activitiesState
				: showComments
					? activitiesState.filter((activity) => activity.type === "comment")
					: activitiesState.filter((activity) => activity.type !== "comment");
	}
	return selected || !enabled ? (
		<div />
	) : (
		<div className="collapsed">
			{/* Hide activity wrapper if in alert profile and is read-only */}
			{!isAlertProfile || canComment ? (
				<div id="activity-wrapper" className="widget-wrapper">
					{!isAlertProfile && (
						<div className="widget-header">
							<div className="cb-font-b2">
								<Translate value="global.profiles.widgets.activities.main.activityTimeline" />
							</div>
							<div id="activity-filter-button">
								<IconButton onClick={openFilterDialog}>
									<Settings color="#828283" />
								</IconButton>
							</div>
							<div className="widget-header-buttons">
								{widgetsExpandable ? (
									<div className="widget-expand-button">
										<IconButton style={inlineStyles.widgetExpandButton} onClick={handleExpand}>
											<Expand />
										</IconButton>
									</div>
								) : null}
								{widgetsLaunchable ? (
									<div className="widget-expand-button">
										<IconButton style={inlineStyles.widgetExpandButton} onClick={handleLaunch}>
											<LaunchIcon />
										</IconButton>
									</div>
								) : null}
							</div>
						</div>
					)}
					<div className="widget-content">
						{canComment && (
							<div>
								<div id="comment-field-wrapper">
									<div id="comment-input-wrapper">
										<TextField
											id="comment-field"
											placeholder={getTranslation(
												"global.profiles.widgets.activities.main.postToTimeline"
											)}
											style={{
												...inputStyle.field,
												direction: dir
											}}
											multiline
											fullWidth={true}
											value={comment}
											onChange={handleChange}
											error={!!error}
											helperText={error}
											variant="standard"
											InputProps={{
												style: {
													padding: 0,
													letterSpacing: "unset"
												},
												classes: {
													input: classes.input
												},
												disableUnderline: true
											}}
											FormHelperTextProps={{
												style: {
													fontSize: 12,
													letterSpacing: "unset",
													lineHeight: "unset"
												}
											}}
										/>
										<div id="comment-post-button">
											<Button
												color="primary"
												disabled={comment.trim() ? false : true}
												variant="contained"
												style={comment.trim() ? inputStyle.button : disabledStyle.button}
												onClick={handleAddComment}
											>
												{getTranslation("global.profiles.widgets.activities.main.post")}
											</Button>
										</div>
									</div>

									{/* {!isAlertProfile && (
										<div id="activity-filter-wrapper">
											<Checkbox
												checked={filters && filters.includes("comment")}
												label="Posted Messages"
												iconStyle={checkboxStyles.icon}
												labelStyle={checkboxStyles.label}
												style={checkboxStyles.input}
												onClick={() => this.handleUpdateFilter(["comment"])}
											/>
											<Checkbox
												checked={filters && filters.includes("updated")}
												label={
													this.capitalizeFirstLetter(entityType) + " Updates"
												}
												iconStyle={checkboxStyles.icon}
												labelStyle={checkboxStyles.label}
												style={checkboxStyles.input}
												onClick={() =>
													this.handleUpdateFilter([
														"updated",
														"created",
														"pinned",
														"exit",
														"enter"
													])
												}
											/>
										</div>
									)} */}
								</div>
							</div>
						)}
						<Dialog
							open={dialog === "activityFilterDialog" ? true : false}
							actions={true}
							DialogActionsFunction={activityDialogActions}
							dialogContentStyles={{
								maxWidth: 500,
								padding: "20px",
								width: "500px"
							}}
						>
							<p className="dialog-text" style={{ color: "#ABABAC" }}>
								<Translate value="global.profiles.widgets.activities.main.activityTimelineFilters" />
							</p>
							<div id="activity-filter-dialog" style={{ display: "inline-grid" }}>
								<FormControlLabel
									control={
										<Checkbox
											checked={filters && filters.includes("comment")}
											onChange={() => handleUpdateFilter(["comment"])}
										/>
									}
									style={{ color: "#7E7F7F" }}
									label={getTranslation("global.profiles.widgets.activities.main.postedMessages")}
								/>

								<FormControlLabel
									style={{ color: "#7E7F7F" }}
									control={
										<Checkbox
											checked={filters && filters.includes("updated")}
											onChange={() =>
												handleUpdateFilter(["updated", "created", "pinned", "exit", "enter"])
											}
										/>
									}
									label={getTranslation(
										"global.profiles.widgets.activities.main.updates",
										displayType ? displayType : capitalizeFirstLetter(EntityType)
									)}
								/>
							</div>
						</Dialog>
					</div>
				</div>
			) : (
				<Divider />
			)}

			<div className="activity-list-wrapper">
				{filteredActivities.length > 0 ? (
					<Fragment>
						{filteredActivities
							.sort((a, b) => {
								return moment.utc(b.published) - moment.utc(a.published);
							})
							.map((activity) => {
								return (
									<Activity
										key={activity.id}
										activity={activity}
										forReplay={forReplay}
										timeFormatPreference={timeFormatPreference}
										dir={dir}
										locale={locale}
									/>
								);
							})}
						{loadMore && (
							<Button
								variant="text"
								style={{ color: "#fff" }}
								color="primary"
								onClick={handleNextPage}
								key="load-more-activities-button"
							>
								{getTranslation("global.profiles.widgets.activities.main.loadMore")}
							</Button>
						)}
					</Fragment>
				) : (
					<Typography style={{ padding: 12, color: "#fff" }} component="p" align="center" variant="caption">
						<Translate value="global.profiles.widgets.activities.main.noActivities" />
					</Typography>
				)}
			</div>
		</div>
	);
};

Activities.propTypes = propTypes;

export default withSpan("activities-widget", "profile-widget")(Activities);
