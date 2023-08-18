import React, { Fragment, useState, useEffect, useRef } from "react";
import { withSpan } from "../../../Apm";
import { activityService, eventService } from "client-app-core";
import {
	IconButton,
	FlatButton,
	RaisedButton,
	TextField,
	Checkbox,
	Dialog
} from "material-ui";
import { Typography, Divider } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import Settings from "material-ui/svg-icons/action/settings";
import Activity from "./components/Activity";
import moment from "moment";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const propTypes = {
	locale: PropTypes.string
};

const defaultProps = {
	locale: "en"
};
const Activities = (props) => {
	const {
		activityFilters,
		activities,
		contextId,
		unsubscribeFromFeed,
		subscriberRef,
		isPrimary,
		selectWidget,
		entityType,
		entity,
		updateActivityFilters,
		forReplay,
		endDate,
		locale,
		canManage,
		selected,
		order,
		enabled,
		widgetsExpandable,
		widgetsLaunchable,
		dialog,
		readOnly,
		isAlertProfile,
		timeFormatPreference,
		dir,
		openDialog,
		closeDialog
	} = props;
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [comment, setComment] = useState("");
	const [filters, setFilters] = useState(activityFilters);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [activitiesState, setActivitiesState] = useState(activities || []);
	const [loadMore, setLoadMore] = useState(true);


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
				setActivitiesState(_.uniqBy([...activitiesState, ...activities], "id"));
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
		}
		else if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/activity-timeline`);
		}
		else if (entityType === "facility") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		}
	};

	const handleChange = event => {
		if (event.target.value.length > 280) {
			setName(event.target.value);
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
		if (EntityType !== "event")
			activityService.comment(contextId, EntityType, comment);
		// Otherwise, use event-specific add comment (events work differently than entities)
		else {
			eventService.addComment(contextId, comment, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					// Update event's 'lastModified' property
					eventService.mockUpdateEvent(contextId, (err, response) => {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		}
		setComment("");
		setError("");
	};

	const handleUpdateFilter = values => {
		let newFilters = filters ? [...filters] : [];
		if (_.intersection(newFilters, values).length > 0) {
			newFilters = _.difference(newFilters, values);
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
		dispatch(updateActivityFilters({ activityFilters: filters }));
		closeFilterDialog();
	};

	const getActivities = () => {

		const EntityType = entity.entityType;
		const streamedActivities = !forReplay && activities ? activities : [];
		const sorted = activitiesState.sort((a, b) =>
			moment.utc(a.published).diff(moment.utc(b.published))
		);
		const initial = forReplay ? endDate : (new Date()).toISOString();
		const date =
			sorted.length > 0 ? sorted[0].published : initial;
		EntityType === "event"
			? activityService.getActivitiesByEvent(
				contextId, //eventId
				5, //pageSize
				date, //fromDate
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							setActivitiesState(_.uniqBy(
								[...activitiesState, ...streamedActivities, ...res],
								"id"
							));
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
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							setActivitiesState(_.uniqBy(
								[...activitiesState, ...streamedActivities, ...res],
								"id"
							));
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

	const capitalizeFirstLetter = string => {
		if (locale === "en") {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		else if (locale === "ar") {
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
			borderRadius: 10,
			backgroundColor: "#6C6C6E"
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
			padding: 10,
			minHeight: 50,
			height: 55,
			margin: ".75rem 0"
		},
		area: {
			marginTop: 0
		},
		hint: {
			top: 12
		},
		button: {
			width: "100%",
			minWidth: 0,
			height: 50,
			margin: ".75rem 0",
			borderRadius: 10
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

	const checkboxStyles = {
		input: {
			width: "auto",
			minWidth: 160
		},
		icon: {
			height: "1.25rem",
			width: "1.25rem",
			marginRight: 8
		},
		label: {
			fontSize: ".75rem"
		},
		dialog: {
			minWidth: "45%"
		}
	};

	const filterActions = [
		<FlatButton
			label={getTranslation("global.profiles.widgets.activities.main.cancel")}
			secondary={true}
			onClick={handleCancelFilter}
		/>,
		<FlatButton
			label={getTranslation("global.profiles.widgets.activities.main.confirm")}
			primary={true}
			onClick={handleSaveFilter}
		/>
	];
	// acitivities don't have the usual properties that allow for ownership checking, but if a user has access to an activity, it's safe to assume they have the proper access to comment
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
					? activitiesState.filter(activity => activity.type === "comment")
					: activitiesState.filter(activity => activity.type !== "comment");
	}
	return selected || !enabled ? (
		<div />
	) : (
		<div
			className={`collapsed ${"index-" + order}`}
		>
			{/* Hide activity wrapper if in alert profile and is read-only */}
			{!isAlertProfile || canComment ? (
				<div id="activity-wrapper" className="widget-wrapper">
					{!isAlertProfile && (
						<div className="widget-header">
							<div className="cb-font-b2"><Translate value="global.profiles.widgets.activities.main.activityTimeline" /></div>
							<div id="activity-filter-button">
								<IconButton>
									<Settings color="#828283" onClick={openFilterDialog} />
								</IconButton>
							</div>
							<div className="widget-header-buttons">
								{widgetsExpandable ? (
									<div className="widget-expand-button">
										<IconButton
											style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
											onClick={handleExpand}
										>
											<Expand />
										</IconButton>
									</div>
								) : null}
								{widgetsLaunchable ? (
									<div className="widget-expand-button">
										<IconButton
											style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
											onClick={handleLaunch}
										>
											<LaunchIcon />
										</IconButton>
									</div>
								) : null}
							</div>
						</div>
					)}
					<div className="widget-content">
						{canComment && (
							<div id="comment-field-wrapper">
								<div id="comment-input-wrapper">
									<TextField
										id="comment-field"
										hintText={getTranslation("global.profiles.widgets.activities.main.postToTimeline")}
										hintStyle={inputStyle.hint}
										style={{ ...inputStyle.field, direction: dir }}
										textareaStyle={inputStyle.area}
										multiLine={true}
										fullWidth={true}
										rows={2}
										underlineShow={false}
										value={comment}
										onChange={handleChange}
										errorText={error}
									/>
									<div id="comment-post-button">
										<RaisedButton
											primary={true}
											disabled={comment.trim() ? false : true}
											label={getTranslation("global.profiles.widgets.activities.main.post")}
											style={
												comment.trim()
													? inputStyle.button
													: disabledStyle.button
											}
											buttonStyle={
												comment.trim()
													? inputStyle.buttonBorder
													: disabledStyle.buttonBorder
											}
											labelStyle={
												comment.trim()
													? inputStyle.buttonLabel
													: disabledStyle.buttonLabel
											}
											onClick={handleAddComment}
										/>
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
						)}
						<Dialog
							open={dialog === "activityFilterDialog" ? true : false}
							actions={filterActions}
							onRequestClose={handleCancelFilter}
							contentStyle={{ maxWidth: 500 }}
						>
							<p className="dialog-text"><Translate value="global.profiles.widgets.activities.main.activityTimelineFilters" /></p>
							<div id="activity-filter-dialog">
								<Checkbox
									checked={filters && filters.includes("comment")}
									label={getTranslation("global.profiles.widgets.activities.main.postedMessages")}
									style={checkboxStyles.dialog}
									onClick={() => handleUpdateFilter(["comment"])}
								/>
								<Checkbox
									checked={filters && filters.includes("updated")}
									label={getTranslation("global.profiles.widgets.activities.main.updates", capitalizeFirstLetter(EntityType))}
									style={checkboxStyles.dialog}
									onClick={() =>
										handleUpdateFilter([
											"updated",
											"created",
											"pinned",
											"exit",
											"enter"
										])
									}
								/>
							</div>
						</Dialog>
					</div>
				</div>
			) : (
				<Divider />
			)}

			<div className="activity-list-wrapper">
				{
					filteredActivities.length > 0 ? (
						<Fragment>
							{filteredActivities
								.sort((a, b) => {
									return moment.utc(b.published) - moment.utc(a.published);
								})
								.map(activity => {
									return <Activity
										key={activity.id}
										activity={activity}
										forReplay={forReplay}
										timeFormatPreference={timeFormatPreference}
										dir={dir}
										locale={locale} />;
								})}
							{loadMore && (
								<FlatButton
									label={getTranslation("global.profiles.widgets.activities.main.loadMore")}
									primary={true}
									onClick={handleNextPage}
								/>
							)}
						</Fragment>
					) : (
						<Typography
							style={{ padding: 12 }}
							component="p"
							align="center"
							variant="caption"
						>
							<Translate value="global.profiles.widgets.activities.main.noActivities" />
						</Typography>
					)}
			</div>
		</div>
	);

};

Activities.propTypes = propTypes;
Activities.defaultProps = defaultProps;
export default withSpan("activities-widget", "profile-widget")(Activities);
