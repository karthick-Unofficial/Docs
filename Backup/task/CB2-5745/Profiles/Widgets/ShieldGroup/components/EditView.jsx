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
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { ExpandMore, ExpandLess, Cancel } from "@mui/icons-material";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n";
import find from "lodash/find";
import without from "lodash/without";
import map from "lodash/map";
import includes from "lodash/includes";
import filter from "lodash/filter";
import { useDispatch } from "react-redux";

const styles = {
	root: {
		color: "#FFF",
		"&:hover": {
			backgroundColor: "transparent"
		}
	}
};

const propTypes = {
	classes: PropTypes.object,
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
	updateEvent,
	contextId,
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
	const dispatch = useDispatch();

	const inlineStyles = {
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" && {
				right: "unset",
				left: 16
			})
		},
		grid: {
			borderRight: "1px solid rgba(255, 255, 255, 0.12)",
			marginTop: 6
		}
	};

	useEffect(() => {
		if (!edited && !isEqual(settings, settingsState)) setEdited(true);
		if (edited && isEqual(settings, settingsState)) setEdited(false);
	}, [edited, settings, settingsState]);

	const handleChange = (name) => (event) => {
		const id = event.target.value;
		setSettingsState({ ...settingsState, [name]: id });
		if (name === "shape_id") {
			const shape = find(zones, ["id", id]);
			if (shape)
				setSettingsState({
					...settingsState,
					shape_id: id,
					shape_points: shape.coordinates
				});
		}
	};

	const handleToggle = (name) => {
		setSettingsState({ ...settingsState, [name]: !settingsState[name] });
	};

	const handleExpand = (id) => {
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
				update = newFieldSettings.filter((value) => value !== id);
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
		setSettingsState({
			...settingsState,
			[field]: without(settingsState[field], id)
		});
	};

	const handleCancel = () => {
		setSettingsState(settings);
	};

	const handleUpdate = () => {
		const update = { additionalProperties: { ...settingsState } };
		dispatch(updateEvent(contextId, update));
		setEdited(false);
	};

	const renderActions = () => {
		const node = document.getElementById("widget-actions");
		return (
			node && (
				<Portal node={node}>
					<Fragment>
						<Button onClick={handleCancel}>
							<Translate value="global.profiles.widgets.shieldGroup.editView.cancel" />
						</Button>
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
	users.forEach((user) => {
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
				<Typography variant="h6">
					<Translate
						value="global.profiles.widgets.shieldGroup.editView.threadId"
						count={threadId}
					/>
				</Typography>
			)}
			<Grid container justify="space-between" spacing={24}>
				<Grid item lg={6} md={12}>
					<SelectField
						id="points_of_contact"
						label={getTranslation(
							"global.profiles.widgets.shieldGroup.editView.fieldLabel.pointOfContact"
						)}
						multiple={true}
						items={users}
						value={points_of_contact || []}
						handleChange={handleChange("points_of_contact")}
						maxHeight={315}
						dir={dir}
					/>
					<SelectField
						id="location"
						label={getTranslation(
							"global.profiles.widgets.shieldGroup.editView.fieldLabel.predefinedLocation"
						)}
						items={locations}
						value={location_id || ""}
						handleChange={handleChange("location_id")}
						maxHeight={315}
						dir={dir}
					>
						{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
						<MenuItem value="">
							<Translate value="global.profiles.widgets.shieldGroup.editView.fieldLabel.none" />
						</MenuItem>
					</SelectField>
					<SelectField
						id="bulletin-zone"
						label={getTranslation(
							"global.profiles.widgets.shieldGroup.editView.fieldLabel.bulletinZone"
						)}
						items={zones}
						value={shape_id || ""}
						handleChange={handleChange("shape_id")}
						maxHeight={315}
						dir={dir}
					>
						{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
						<MenuItem value="">
							<Translate value="global.profiles.widgets.shieldGroup.editView.fieldLabel.none" />
						</MenuItem>
					</SelectField>
				</Grid>
				<Grid item lg={6} md={12}>
					<List>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.shareToCMS"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							<ListItemSecondaryAction
								style={inlineStyles.listItemSecondaryAction}
							>
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
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.visibleToAll"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							<ListItemSecondaryAction
								style={inlineStyles.listItemSecondaryAction}
							>
								<Switch
									color="primary"
									checked={!limited_to_audience}
									onChange={() =>
										handleToggle("limited_to_audience")
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.notifyOnEntry"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							<ListItemSecondaryAction
								style={inlineStyles.listItemSecondaryAction}
							>
								<Switch
									color="primary"
									checked={recurring_notification}
									onChange={() =>
										handleToggle("recurring_notification")
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.disableNotifications"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							<ListItemSecondaryAction
								style={inlineStyles.listItemSecondaryAction}
							>
								<Switch
									color="primary"
									checked={push_disabled}
									onChange={() =>
										handleToggle("push_disabled")
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</Grid>
			</Grid>
			<Divider style={{ margin: "16px 0" }} />
			<Typography variant="h6">
				<Translate value="global.profiles.widgets.shieldGroup.editView.audiences" />
			</Typography>
			<List>
				<Grid container justify="space-between" spacing={24}>
					<Grid item lg={6} sm={12} style={inlineStyles.grid}>
						<ListItem
							button
							className={classes.root}
							onClick={() => handleExpand("groups")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.groups"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							{expanded["groups"] ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItem>
						<Collapse in={expanded["groups"]}>
							<List>
								{map(groups, (group) => (
									<ListItem key={group.id}>
										<ListItemText
											primary={group.name}
											primaryTypographyProps={{
												noWrap: true
											}}
											style={inlineStyles.textAlignRight}
										/>
										<ListItemSecondaryAction
											style={
												inlineStyles.listItemSecondaryAction
											}
										>
											<Switch
												onClick={() =>
													handleSelect(
														"audience_groups",
														group.id
													)
												}
												checked={includes(
													audience_groups,
													group.id
												)}
												color="primary"
											/>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</Collapse>
					</Grid>
					<Grid item lg={6} sm={12} style={inlineStyles.grid}>
						<ListItem
							button
							className={classes.root}
							onClick={() => handleExpand("departments")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.departments"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							{expanded["departments"] ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItem>
						<Collapse in={expanded["departments"]}>
							<List>
								{map(departments, (department) => (
									<ListItem key={department.id}>
										<ListItemText
											primary={department.name}
											primaryTypographyProps={{
												noWrap: true
											}}
											style={inlineStyles.textAlignRight}
										/>
										<ListItemSecondaryAction
											style={
												inlineStyles.listItemSecondaryAction
											}
										>
											<Switch
												onClick={() =>
													handleSelect(
														"audience_departments",
														department.id
													)
												}
												checked={includes(
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
					<Grid item lg={6} sm={12} style={inlineStyles.grid}>
						<ListItem
							button
							className={classes.root}
							onClick={() => handleExpand("districts")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.districts"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							{expanded["districts"] ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItem>
						<Collapse in={expanded["districts"]}>
							<List>
								{map(districts, (district) => (
									<ListItem key={district.id}>
										<ListItemText
											primary={district.name}
											primaryTypographyProps={{
												noWrap: true
											}}
											style={inlineStyles.textAlignRight}
										/>
										<ListItemSecondaryAction
											style={
												inlineStyles.listItemSecondaryAction
											}
										>
											<Switch
												onClick={() =>
													handleSelect(
														"audience_districts",
														district.id
													)
												}
												checked={includes(
													audience_districts,
													district.id
												)}
												color="primary"
											/>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</Collapse>
					</Grid>
					<Grid item lg={6} sm={12} style={inlineStyles.grid}>
						<ListItem
							button
							className={classes.root}
							onClick={() => handleExpand("individuals")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText
								primary={getTranslation(
									"global.profiles.widgets.shieldGroup.editView.individuals"
								)}
								primaryTypographyProps={{ noWrap: true }}
								style={inlineStyles.textAlignRight}
							/>
							{expanded["individuals"] ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItem>
						<Collapse
							in={expanded["individuals"]}
							style={
								expanded["individuals"]
									? { overflow: "visible" }
									: {}
							}
						>
							<List>
								<ListItem
									style={{
										...(dir === "rtl" && {
											paddingLeft: 0
										}),
										...(dir === "ltr" && {
											paddingRight: 0
										}),
										paddingTop: 0
									}}
								>
									<SearchSelectField
										id="individual-search"
										items={admins}
										selected={audience_individuals}
										handleSelect={(id) =>
											handleSelect(
												"audience_individuals",
												id
											)
										}
										placeholder={getTranslation(
											"global.profiles.widgets.shieldGroup.editView.searchForIndividuals"
										)}
										dir={dir}
									/>
								</ListItem>
								{map(
									filter(users, (individual) =>
										includes(
											settingsState[
												"audience_individuals"
											],
											individual.id
										)
									),
									(individual) => (
										<ListItem key={individual.id}>
											<ListItemText
												primary={individual.name}
												primaryTypographyProps={{
													noWrap: true
												}}
												style={
													inlineStyles.textAlignRight
												}
											/>
											<ListItemSecondaryAction
												style={
													inlineStyles.listItemSecondaryAction
												}
											>
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
