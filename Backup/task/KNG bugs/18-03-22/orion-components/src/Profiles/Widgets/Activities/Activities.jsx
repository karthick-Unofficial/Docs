import React, { PureComponent, Fragment } from "react";
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
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";

const propTypes = {
	locale: PropTypes.string
};

const defaultProps = {
	locale: "en"
};
class Activities extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			comment: "",
			filters: this.props.activityFilters,
			error: "",
			page: 1,
			activities: this.props.activities || [],
			loadMore: true
		};
	}

	componentDidMount() {
		this.getActivities();
	}

	componentDidUpdate(prevProps, prevState) {
		const { activities } = this.props;
		if (!isEqual(activities, prevProps.activities)) {
			this.setState({
				activities: _.uniqBy([...this.state.activities, ...activities], "id")
			});
		}
	}

	componentWillUnmount() {
		const {
			contextId,
			unsubscribeFromFeed,
			subscriberRef,
			isPrimary
		} = this.props;
		if (!isPrimary && unsubscribeFromFeed)
			unsubscribeFromFeed(contextId, "activities", subscriberRef);
	}

	// selectWidget
	handleExpand = () => {
		this.props.selectWidget("Activity Timeline");
	};

	handleLaunch = () => {
		const { contextId, entityType } = this.props;

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

	handleChange = event => {
		if (event.target.value.length > 280) {
			this.setState({
				name: event.target.value,
				error: getTranslation("global.profiles.widgets.activities.main.errorText.commentsTxt")
			});
			return;
		}
		this.setState({
			comment: event.target.value,
			error: ""
		});
	};

	handleAddComment = () => {
		const { contextId, entity } = this.props;
		const { entityType } = entity;
		const { comment } = this.state;
		// If not an event, use generic add comment,
		if (entityType !== "event")
			activityService.comment(contextId, entityType, comment);
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
		this.setState({ comment: "", error: "" });
	};

	handleUpdateFilter = values => {
		const { updateActivityFilters } = this.props;
		const { filters } = this.state;
		let newFilters = filters ? [...filters] : [];
		if (_.intersection(newFilters, values).length > 0) {
			newFilters = _.difference(newFilters, values);
		} else {
			newFilters = [...newFilters, ...values];
		}
		// if (expanded) {
		// 	updateActivityFilters({ activityFilters: newFilters });
		// }
		this.setState({
			filters: newFilters
		});
	};

	handleCancelFilter = () => {
		const { activityFilters } = this.props;
		this.setState({
			filters: activityFilters || []
		});
		this.closeDialog();
	};

	handleSaveFilter = () => {
		const { updateActivityFilters } = this.props;
		const { filters } = this.state;
		updateActivityFilters({ activityFilters: filters });
		this.closeDialog();
	};

	getActivities = () => {
		const { entity, contextId, forReplay, endDate } = this.props;
		const { activities } = this.state;
		const { entityType } = entity;
		const streamedActivities = !forReplay && this.props.activities ? this.props.activities : [];
		const sorted = activities.sort((a, b) =>
			moment.utc(a.published).diff(moment.utc(b.published))
		);
		const initial = forReplay ? endDate : (new Date()).toISOString();
		const date =
			sorted.length > 0 ? sorted[0].published : initial;
		entityType === "event"
			? activityService.getActivitiesByEvent(
				contextId, //eventId
				5, //pageSize
				date, //fromDate
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							this.setState({
								activities: _.uniqBy(
									[...activities, ...streamedActivities, ...res],
									"id"
								)
							});
						}
						// If it's the end of activities
						if (res.length < 5) {
							this.setState({
								loadMore: false
							});
						}
					}
				}
			)
			: activityService.getActivitiesByEntity(
				entityType, //entityType
				contextId, //Id
				5, //pageSize
				date, //fromDate
				(err, res) => {
					if (err) console.log(err);
					if (res) {
						// If there are new activities after attempting to load more
						if (res.length > 0) {
							this.setState({
								activities: _.uniqBy(
									[...activities, ...streamedActivities, ...res],
									"id"
								)
							});
						}
						// If it's the end of activities
						if (res.length < 5) {
							this.setState({
								loadMore: false
							});
						}
					}
				}
			);
	};

	// This will load the first 5 activities older than the oldest visible activity
	handleNextPage = () => {
		const { page } = this.state;
		this.getActivities();
		this.setState({
			page: page + 1
		});
	};

	closeDialog = () => {
		this.props.closeDialog("activityFilterDialog");
	};

	openDialog = () => {
		this.props.openDialog("activityFilterDialog");
	};

	capitalizeFirstLetter = string => {
		const { locale } = this.props;
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
				default:
					return string;
			}
		}
	};

	render() {
		const { filters, comment, error, activities, loadMore } = this.state;
		const {
			canManage,
			entity,
			selected,
			order,
			enabled,
			widgetsExpandable,
			widgetsLaunchable,
			dialog,
			activityFilters,
			readOnly,
			isAlertProfile,
			forReplay,
			timeFormatPreference,
			dir,
			locale
		} = this.props;

		const { entityType, owner } = entity;

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
				onClick={this.handleCancelFilter}
			/>,
			<FlatButton
				label={getTranslation("global.profiles.widgets.activities.main.confirm")}
				primary={true}
				onClick={this.handleSaveFilter}
			/>
		];
		// acitivities don't have the usual properties that allow for ownership checking, but if a user has access to an activity, it's safe to assume they have the proper access to comment
		const canComment = !readOnly && (!owner && entityType === "activity" ? true : canManage);
		/**
		 * This is a quick fix til activity filtering becomes more robust.
		 * If there are no filters, or the length of this filters is greater than 1,
		 * i.e. the filter does not just include "comment", show all activities
		 */
		let filteredActivities = activities;
		if (activityFilters) {
			const showUpdates = activityFilters.length > 1;
			const showComments = activityFilters.includes("comment");
			filteredActivities =
				!activityFilters.length || (showUpdates && showComments)
					? activities
					: showComments
						? activities.filter(activity => activity.type === "comment")
						: activities.filter(activity => activity.type !== "comment");
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
										<Settings color="#828283" onClick={this.openDialog} />
									</IconButton>
								</div>
								<div className="widget-header-buttons">
									{widgetsExpandable ? (
										<div className="widget-expand-button">
											<IconButton
												style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
												onClick={this.handleExpand}
											>
												<Expand />
											</IconButton>
										</div>
									) : null}
									{widgetsLaunchable ? (
										<div className="widget-expand-button">
											<IconButton
												style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
												onClick={this.handleLaunch}
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
											onChange={this.handleChange}
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
												onClick={this.handleAddComment}
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
								onRequestClose={this.handleCancelFilter}
								contentStyle={{ maxWidth: 500 }}
							>
								<p className="dialog-text"><Translate value="global.profiles.widgets.activities.main.activityTimelineFilters" /></p>
								<div id="activity-filter-dialog">
									<Checkbox
										checked={filters && filters.includes("comment")}
										label={getTranslation("global.profiles.widgets.activities.main.postedMessages")}
										style={checkboxStyles.dialog}
										onClick={() => this.handleUpdateFilter(["comment"])}
									/>
									<Checkbox
										checked={filters && filters.includes("updated")}
										label={getTranslation("global.profiles.widgets.activities.main.updates", this.capitalizeFirstLetter(entityType))}
										style={checkboxStyles.dialog}
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
								.map(activity => {
									return <Activity
										key={activity.id}
										activity={activity}
										forReplay={forReplay}
										timeFormatPreference={timeFormatPreference} 
										dir={dir}
										locale={locale}/>;
								})}
							{loadMore && (
								<FlatButton
									label={getTranslation("global.profiles.widgets.activities.main.loadMore")}
									primary={true}
									onClick={this.handleNextPage}
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
	}
}

Activities.propTypes = propTypes;
Activities.defaultProps = defaultProps;
export default withSpan("activities-widget", "profile-widget")(Activities);
