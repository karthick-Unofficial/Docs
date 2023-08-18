import React, { Fragment, useEffect, useState } from "react";
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

const EditView = ({
	settings,
	zones,
	updateEvent, contextId,
	classes,
	users,
	locations,
	groups,
	departments,
	districts,
	isPublic,
	dir
}) => {
	const [expanded, setExpanded] = useState({});
	const [settingsState, setSettingsState] = useState();
	const [edited, setEdited] = useState(false);

	useEffect(() => {
		if (!edited && !isEqual(settings, settingsState))
			setEdited(true);
		if (edited && isEqual(settings, settingsState))
			setEdited(false);
	}, [edited, settings, settingsState]);

	const handleChange = name => event => {
		const id = event.target.value;
		setSettingsState({ ...settingsState, [name]: id });
		if (name === "shape_id") {
			const shape = _.find(zones, ["id", id]);
			if (shape)
				setSettingsState({
					...settingsState,
					shape_id: id,
					shape_points: shape.coordinates
				});
		}
	};

	const handleToggle = name => {
		setSettingsState({ ...settingsState, [name]: !settingsState[name] });
	};

	const handleExpand = id => {
		expanded[id]
			? setExpanded({ ...expanded, [id]: false })
			: setExpanded({ ...expanded, [id]: true });
	};

	const handleSelect = (field, id) => {
		const hasField = settingsState[field];
		let update;
		if (!hasField) {
			update = [id];
		}
		if (hasField) {
			const newFieldSettings = [...settingsState[field]];
			if (settingsState[field].includes(id)) {
				update = newFieldSettings.filter(value => value !== id);
			} else {
				update = [...newFieldSettings, id];
			}
		}
		setSettingsState({
			...settingsState,
			[field]: update
		});
	};

	const handleRemove = (field, id) => {
		setSettingsState({ ...settingsState, [field]: _.without(settingsState[field], id) });
	};

	const handleCancel = () => {
		setSettingsState(settings);
	};

	const handleUpdate = () => {
		const update = { additionalProperties: { ...settingsState } };
		updateEvent(contextId, update);
		setEdited(false);
	};

	const renderActions = () => {
		const node = document.getElementById("widget-actions");
		return (
			node && (
				<Portal node={node}>
					<Fragment>
						<Button onClick={handleCancel}><Translate value="global.profiles.widgets.shieldGroup.editView.cancel" /></Button>
						<Button onClick={handleUpdate} color="primary">
							<Translate value="global.profiles.widgets.shieldGroup.editView.save" />
						</Button>
					</Fragment>
				</Portal>
			)
		);
	};

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
	} = settingsState;

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
			{edited && renderActions()}
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
						handleChange={handleChange("points_of_contact")}
						maxHeight={315}
						dir={dir}
					/>
					<SelectField
						id="location"
						label={getTranslation("global.profiles.widgets.shieldGroup.editView.fieldLabel.predefinedLocation")}
						items={locations}
						value={location_id || ""}
						handleChange={handleChange("location_id")}
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
						handleChange={handleChange("shape_id")}
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
								style={dir == "rtl" ? { textAlign: "right" } : {}}
							/>
							<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
								<Switch
									color="primary"
									checked={shareToCMS}
									onChange={() => handleToggle("shareToCMS")}
									disabled={!isPublic}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.visibleToAll")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
							/>
							<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
								<Switch
									color="primary"
									checked={!limited_to_audience}
									onChange={() => handleToggle("limited_to_audience")}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.notifyOnEntry")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
							/>
							<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
								<Switch
									color="primary"
									checked={recurring_notification}
									onChange={() => handleToggle("recurring_notification")}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.disableNotifications")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
							/>
							<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
								<Switch
									color="primary"
									checked={push_disabled}
									onChange={() => handleToggle("push_disabled")}
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
							onClick={() => handleExpand("groups")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.groups")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
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
											style={dir == "rtl" ? { textAlign: "right" } : {}}
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
											<Switch
												onClick={() =>
													handleSelect("audience_groups", group.id)
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
							onClick={() => handleExpand("departments")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.departments")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
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
											style={dir == "rtl" ? { textAlign: "right" } : {}}
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
											<Switch
												onClick={() =>
													handleSelect(
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
							onClick={() => handleExpand("districts")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.districts")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
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
											style={dir == "rtl" ? { textAlign: "right" } : {}}
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
											<Switch
												onClick={() =>
													handleSelect("audience_districts", district.id)
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
							onClick={() => handleExpand("individuals")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation("global.profiles.widgets.shieldGroup.editView.individuals")}
								primaryTypographyProps={{ noWrap: true }}
								style={dir == "rtl" ? { textAlign: "right" } : {}}
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
											handleSelect("audience_individuals", id)
										}
										placeholder={getTranslation("global.profiles.widgets.shieldGroup.editView.searchForIndividuals")}
										dir={dir}
									/>
								</ListItem>
								{_.map(
									_.filter(users, individual =>
										_.includes(
											settingsState["audience_individuals"],
											individual.id
										)
									),
									individual => (
										<ListItem key={individual.id}>
											<ListItemText
												primary={individual.name}
												primaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? { textAlign: "right" } : {}}
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
												<IconButton
													onClick={() =>
														handleRemove(
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

};

EditView.propTypes = propTypes;
EditView.defaultProps = defaultProps;

export default withStyles(styles)(EditView);
