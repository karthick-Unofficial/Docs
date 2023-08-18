import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
	SelectField,
	SearchSelectField,
	Portal
} from "orion-components/CBComponents";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Switch,
	Collapse,
	Grid,
	Typography,
	Divider,
	IconButton,
	Button,
	MenuItem
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore, ExpandLess, Cancel } from "@material-ui/icons";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
	root: {
		color: "#FFF",
		"&:hover": {
			backgroundColor: "transparent"
		}
	}
};

const propTypes = {
	users: PropTypes.array,
	locations: PropTypes.array,
	groups: PropTypes.array,
	departments: PropTypes.array,
	districts: PropTypes.array,
	updateEvent: PropTypes.func.isRequired,
	contextId: PropTypes.string.isRequired,
	settings: PropTypes.object.isRequired,
	zones: PropTypes.array,
	isPublic: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	users: [],
	locations: [],
	groups: [],
	departments: [],
	districts: [],
	zones: [],
	isPublic: false,
	dir: "ltr"
};

class EditView extends Component {
	constructor(props) {
		super(props);
		const { settings } = this.props;
		this.state = {
			expanded: {},
			settings,
			edited: false
		};
	}

	componentDidUpdate(prevProps, prevState) {
		const { edited } = this.state;
		const { settings } = this.props;
		// Control the display of Save/Cancel actions
		if (!edited && !isEqual(settings, this.state.settings))
			this.setState({ edited: true });
		if (edited && isEqual(settings, this.state.settings))
			this.setState({ edited: false });
	}

	handleChange = name => event => {
		const { zones } = this.props;
		const { settings } = this.state;
		const id = event.target.value;
		this.setState({ settings: { ...settings, [name]: id } });
		if (name === "shape_id") {
			const shape = _.find(zones, ["id", id]);
			if (shape)
				this.setState({
					settings: {
						...settings,
						shape_id: id,
						shape_points: shape.coordinates
					}
				});
		}
	};

	handleToggle = name => {
		const { settings } = this.state;
		this.setState({ settings: { ...settings, [name]: !settings[name] } });
	};

	handleExpand = id => {
		const { expanded } = this.state;
		expanded[id]
			? this.setState({ expanded: { ...expanded, [id]: false } })
			: this.setState({ expanded: { ...expanded, [id]: true } });
	};

	handleSelect = (field, id) => {
		const { settings } = this.state;
		const hasField = settings[field];
		let update;
		if (!hasField) {
			update = [id];
		}
		if (hasField) {
			const newFieldSettings = [...settings[field]];
			if (settings[field].includes(id)) {
				update = newFieldSettings.filter(value => value !== id);
			} else {
				update = [...newFieldSettings, id];
			}
		}
		this.setState({
			settings: {
				...settings,
				[field]: update
			}
		});
	};

	handleRemove = (field, id) => {
		const { settings } = this.state;
		this.setState({
			settings: { ...settings, [field]: _.without(settings[field], id) }
		});
	};

	handleCancel = () => {
		const { settings } = this.props;
		this.setState({
			settings
		});
	};

	handleUpdate = () => {
		const { updateEvent, contextId } = this.props;
		const { settings } = this.state;
		const update = { additionalProperties: { ...settings } };
		updateEvent(contextId, update);
		this.setState({
			edited: false
		});
	};

	renderActions = () => {
		const node = document.getElementById("widget-actions");

		return (
			node && (
				<Portal node={node}>
					<Fragment>
						<Button onClick={this.handleCancel}><Translate value="global.profiles.widgets.shieldGroup.editView.cancel" /></Button>
						<Button onClick={this.handleUpdate} color="primary">
							<Translate value="global.profiles.widgets.shieldGroup.editView.save" />
						</Button>
					</Fragment>
				</Portal>
			)
		);
	};

	render() {
		const {
			classes,
			users,
			locations,
			groups,
			departments,
			districts,
			zones,
			isPublic,
			dir
		} = this.props;
		const { settings, expanded, edited } = this.state;
		const {
			threadId,
			points_of_contact,
			location_id,
			shape_id,
			shareToCMS,
			limited_to_audience,
			recurring_notification,
			push_disabled,
			audience_groups,
			audience_departments,
			audience_districts,
			audience_individuals
		} = settings;
		const admins = {};
		users.forEach(user => {
			if (user.role_id === 3) {
				admins[user.id] = {
					label: user.name,
					searchString: user.name
				};
			}
		});
		return (
			<Fragment>
				{edited && this.renderActions()}
				{threadId && (
					<Typography variant="h6"><Translate value="global.profiles.widgets.shieldGroup.editView.threadId" count={threadId} /></Typography>
				)}
				<Grid container justify="space-between" spacing={24}>
					<Grid item lg={6} md={12}>
						<SelectField
							id="points_of_contact"
							label={getTranslation("global.profiles.widgets.shieldGroup.editView.fieldLabel.pointOfContact")}
							multiple={true}
							items={users}
							value={points_of_contact || []}
							handleChange={this.handleChange("points_of_contact")}
							maxHeight={315}
							dir={dir}
						/>
						<SelectField
							id="location"
							label={getTranslation("global.profiles.widgets.shieldGroup.editView.fieldLabel.predefinedLocation")}
							items={locations}
							value={location_id || ""}
							handleChange={this.handleChange("location_id")}
							maxHeight={315}
							dir={dir}
						>
							{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
							<MenuItem value=""><Translate value="global.profiles.widgets.shieldGroup.editView.fieldLabel.none" /></MenuItem>
						</SelectField>
						<SelectField
							id="bulletin-zone"
							label={getTranslation("global.profiles.widgets.shieldGroup.editView.fieldLabel.bulletinZone")}
							items={zones}
							value={shape_id || ""}
							handleChange={this.handleChange("shape_id")}
							maxHeight={315}
							dir={dir}
						>
							{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
							<MenuItem value=""><Translate value="global.profiles.widgets.shieldGroup.editView.fieldLabel.none" /></MenuItem>
						</SelectField>
					</Grid>
					<Grid item lg={6} md={12}>
						<List>
							<ListItem disableGutters>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.shareToCMS")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
									<Switch
										color="primary"
										checked={shareToCMS}
										onChange={() => this.handleToggle("shareToCMS")}
										disabled={!isPublic}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<ListItem disableGutters>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.visibleToAll")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
									<Switch
										color="primary"
										checked={!limited_to_audience}
										onChange={() => this.handleToggle("limited_to_audience")}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<ListItem disableGutters>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.notifyOnEntry")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
									<Switch
										color="primary"
										checked={recurring_notification}
										onChange={() => this.handleToggle("recurring_notification")}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<ListItem disableGutters>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.disableNotifications")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
									<Switch
										color="primary"
										checked={push_disabled}
										onChange={() => this.handleToggle("push_disabled")}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						</List>
					</Grid>
				</Grid>
				<Divider style={{ margin: "16px 0" }} />
				<Typography variant="h6"><Translate value="global.profiles.widgets.shieldGroup.editView.audiences" /></Typography>
				<List>
					<Grid container justify="space-between" spacing={24}>
						<Grid
							item
							lg={6}
							sm={12}
							style={dir == "rtl" ? {
								borderRight: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							} : {
								borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							}}
						>
							<ListItem
								button
								className={classes.root}
								onClick={() => this.handleExpand("groups")}
								disableGutters
								disableTouchRipple
							>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.groups")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								{expanded["groups"] ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse in={expanded["groups"]}>
								<List>
									{_.map(groups, group => (
										<ListItem key={group.id}>
											<ListItemText
												primary={group.name}
												primaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}}
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
												<Switch
													onClick={() =>
														this.handleSelect("audience_groups", group.id)
													}
													checked={_.includes(audience_groups, group.id)}
													color="primary"
												/>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Collapse>
						</Grid>
						<Grid
							item
							lg={6}
							sm={12}
							style={dir == "rtl" ? {
								borderRight: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							} : {
								borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							}}
						>
							<ListItem
								button
								className={classes.root}
								onClick={() => this.handleExpand("departments")}
								disableGutters
								disableTouchRipple
							>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.departments")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								{expanded["departments"] ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse in={expanded["departments"]}>
								<List>
									{_.map(departments, department => (
										<ListItem key={department.id}>
											<ListItemText
												primary={department.name}
												primaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}}
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
												<Switch
													onClick={() =>
														this.handleSelect(
															"audience_departments",
															department.id
														)
													}
													checked={_.includes(
														audience_departments,
														department.id
													)}
													color="primary"
												/>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Collapse>
						</Grid>
						<Grid
							item
							lg={6}
							sm={12}
							style={dir == "rtl" ? {
								borderRight: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							} : {
								borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							}}
						>
							<ListItem
								button
								className={classes.root}
								onClick={() => this.handleExpand("districts")}
								disableGutters
								disableTouchRipple
							>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.districts")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								{expanded["districts"] ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse in={expanded["districts"]}>
								<List>
									{_.map(districts, district => (
										<ListItem key={district.id}>
											<ListItemText
												primary={district.name}
												primaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}}
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
												<Switch
													onClick={() =>
														this.handleSelect("audience_districts", district.id)
													}
													checked={_.includes(audience_districts, district.id)}
													color="primary"
												/>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Collapse>
						</Grid>
						<Grid
							item
							lg={6}
							sm={12}
							style={dir == "rtl" ? {
								borderRight: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							} : {
								borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
								marginTop: 6
							}}
						>
							<ListItem
								button
								className={classes.root}
								onClick={() => this.handleExpand("individuals")}
								disableGutters
								disableTouchRipple
							>
								<ListItemText
									primary={getTranslation("global.profiles.widgets.shieldGroup.editView.individuals")}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? {textAlign: "right"} : {}}
								/>
								{expanded["individuals"] ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse
								in={expanded["individuals"]}
								style={expanded["individuals"] ? { overflow: "visible" } : {}}
							>
								<List>
									<ListItem
										style={dir == "rtl" ? {
											paddingTop: 0,
											paddingLeft: 0
										} : {
											paddingTop: 0,
											paddingRight: 0
										}}
									>
										<SearchSelectField
											id="individual-search"
											items={admins}
											selected={audience_individuals}
											handleSelect={id =>
												this.handleSelect("audience_individuals", id)
											}
											placeholder={getTranslation("global.profiles.widgets.shieldGroup.editView.searchForIndividuals")}
											dir={dir}
										/>
									</ListItem>
									{_.map(
										_.filter(users, individual =>
											_.includes(
												settings["audience_individuals"],
												individual.id
											)
										),
										individual => (
											<ListItem key={individual.id}>
												<ListItemText
													primary={individual.name}
													primaryTypographyProps={{ noWrap: true }}
													style={dir == "rtl" ? {textAlign: "right"} : {}}
												/>
												<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
													<IconButton
														onClick={() =>
															this.handleRemove(
																"audience_individuals",
																individual.id
															)
														}
													>
														<Cancel />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
										)
									)}
								</List>
							</Collapse>
						</Grid>
					</Grid>
				</List>
			</Fragment>
		);
	}
}

EditView.propTypes = propTypes;
EditView.defaultProps = defaultProps;

export default withStyles(styles)(EditView);
