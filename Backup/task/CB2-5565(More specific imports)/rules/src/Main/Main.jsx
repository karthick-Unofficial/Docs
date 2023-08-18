import React, { useEffect, useState } from "react";
import TypeAheadFilter from "../TypeAheadFilter/TypeAheadFilter";
import RuleItem from "./components/RuleItem";

//Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material ui components
import { ListItem, ListItemText, ListItemButton, FormControlLabel, Checkbox, Popover, MenuItem, Menu, Dialog, DialogTitle, DialogActions, Button, Fab, IconButton } from "@mui/material";
import { useStyles } from "../shared/styles/overrides";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

// utils
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector, useStore } from "react-redux";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./mainActions";
import { getDir } from "orion-components/i18n/Config/selector";
import isEmpty from "lodash/isEmpty";
import some from "lodash/some";
import includes from "lodash/includes";

let RULE_OPTIONS = [];

const Main = ({ navigate }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const canCreateVesselEventRule = useSelector(state => state.session.user && state.session.user.profile.applications.some(application => {
		return application.appId === "berth-schedule-app";
	}));
	const rules = useSelector(state => Object.keys(state.globalData.rules).map((key) => state.globalData.rules[key]));
	const user = useSelector(state => state.session.user.profile);
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "rules-app")
		&& user.applications.find(app => app.appId === "rules-app").permissions
		&& user.applications.find(app => app.appId === "rules-app").permissions.includes("manage");
	const userId = useSelector(state => state.session.user.profile.id);
	const orgUsers = useSelector(state => state.globalData.org.orgUsers);
	const filterTriggerExit = useSelector(state => state.appState.indexPage.filterTriggerExit);
	const filterTriggerEnter = useSelector(state => state.appState.indexPage.filterTriggerEnter);
	const filterTriggerCross = useSelector(state => state.appState.indexPage.filterTriggerCross);
	const filterTriggerSystemHealth = useSelector(state => state.appState.indexPage.filterTriggerSystemHealth);
	const filterTriggerLoiter = useSelector(state => state.appState.indexPage.filterTriggerLoiter);
	const filterTriggerNewRequest = useSelector(state => state.appState.indexPage.filterTriggerNewRequest);
	const filterTriggerRequestApproval = useSelector(state => state.appState.indexPage.filterTriggerRequestApproval);
	const filterTriggerBerthUpdates = useSelector(state => state.appState.indexPage.filterTriggerBerthUpdates);
	const filterTriggerArrivals = useSelector(state => state.appState.indexPage.filterTriggerArrivals);
	const filterTriggerDepartures = useSelector(state => state.appState.indexPage.filterTriggerDepartures);
	const filterTriggerSecurityViolations = useSelector(state => state.appState.indexPage.filterTriggerSecurityViolations);
	const typeAheadFilter = useSelector(state => state.appState.indexPage.typeAheadFilter);
	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const dir = useSelector(state => getDir(state));

	const {
		deleteRule,
		filterToggleTrigger,
		unsubscribeFromRule
	} = actionCreators;

	const props = {
		canManage,
		rules,
		userId,
		orgUsers,
		typeAheadFilter,
		filterTriggerExit,
		filterTriggerEnter,
		filterTriggerCross,
		filterTriggerLoiter,
		filterTriggerNewRequest,
		filterTriggerRequestApproval,
		filterTriggerBerthUpdates,
		filterTriggerArrivals,
		filterTriggerDepartures,
		filterTriggerSecurityViolations,
		canCreateVesselEventRule,
		dir,
		isOpen,
		navigate
	};
	const [open, setOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuOpenMobile, setMenuOpenMobile] = useState(false);
	const [filterOwner, setFilterOwner] = useState([]);
	const [ruleToDelete, setRuleToDelete] = useState([]);
	const [anchorEl, setAnchorEl] = useState([]);
	const [mounted, setMounted] = useState(false);
	const [collapse, setCollapse] = useState({
		trigger: true,
		userCheck: true
	});
	const store = useStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		RULE_OPTIONS = [
			{
				label: getTranslation("main.mainJsx.rulesOptions.label.trackMovement"),
				value: "track-movement"
			},
			{
				label: getTranslation("main.mainJsx.rulesOptions.label.vesselEventRule"),
				value: "vessel-event",
				condition: "canCreateVesselEventRule"
			},
			{
				label: getTranslation("main.mainJsx.rulesOptions.label.alarmRule"),
				value: "alarm"
			},
			{
				label: getTranslation("main.mainJsx.rulesOptions.label.eventCreated"),
				value: "create-event"
			}
		];
		setMounted(true);
	}

	const _handleClose = () => {
		dispatch(closeDialog("main-delete-dialog"));
	};

	const _deleteAndClose = () => {
		dispatch(deleteRule(ruleToDelete));
		dispatch(closeDialog("main-delete-dialog"));
	};

	const _confirmDelete = (id) => {
		dispatch(openDialog("main-delete-dialog"));
		setRuleToDelete(id);
	};

	const deleteRuleById = (id) => {
		dispatch(deleteRule(id));
	};

	const _goCreate = path => {
		navigate(`/create/${path}`);
	};

	const openMenu = e => {
		setMenuOpen(true);
		setAnchorEl(e.currentTarget);
	};

	const openMenuMobile = e => {
		setMenuOpenMobile(true);
		setAnchorEl(e.currentTarget);
	};

	const handleRequestClose = () => {
		setMenuOpen(false);
	};

	const handleRequestCloseMobile = () => {
		setMenuOpenMobile(false);
	};

	const handleFilterOwner = userId => {
		const filters = filterOwner;
		if (filterOwner.includes(userId)) {
			filters.splice(filters.indexOf(userId), 1);
			setFilterOwner(filters);
		} else {
			setFilterOwner([...filterOwner, userId]);
		}
	};

	const actions = [
		<Button
			className="themedButton"
			variant="text"
			onClick={_handleClose} >
			{getTranslation("main.mainJsx.actions.label.cancel")}
		</Button>,
		<Button
			className="themedButton"
			onClick={_deleteAndClose}
			style={{
				color: "#E85858",
				margin: 0
			}}
			variant="text"
		>
			{getTranslation("main.mainJsx.actions.label.delete")}
		</Button>
	];
	const sortedOrgUsers = orgUsers ? orgUsers.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}

		return 0;
	}) : [];

	const styles = {
		createNewRule: {
			backgroundColor: "rgb(0, 188, 212)",
			borderRadius: "2px",
			color: "#fff",
			height: "36px",
			...(menuOpen ? { opacity: 0.4 } : { opacity: 1 }),
			"&:hover": {
				backgroundColor: "rgb(102 215 229)"
			}
		},
		ruleOption: {
			lineHeight: "48px",
			padding: "0px 16px",
			letterSpacing: 0,
			"&:hover": {
				backgroundColor: "rgba(255, 255, 255, 0.1)"
			}
		},
		listItem: {
			fontSize: "12px",
			display: "block",
			padding: "0px",
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemText: {
			...(dir === "rtl" && { padding: "16px 0px 16px 56px", textAlign: "right" }),
			...(dir === "ltr" && { padding: "16px 56px 16px 0px" }),
			fontSize: 12,
			lineHeight: "16px",
			letterSpacing: 0
		},
		listItemButton: {
			...(dir === "rtl" && { padding: "0 0 0 20px" }),
			...(dir === "ltr" && { padding: "0 20px 0 0" })
		},
		checkBoxRoot: {
			padding: "0px",
			...(dir === "rtl" && { marginLeft: "16px" }),
			...(dir === "ltr" && { marginRight: "16px" })
		},
		paperProps: {
			width: "100%",
			borderRadius: "2px"
		},
		dialogTitle: {
			padding: "24px 24px 20px",
			color: "rgb(255, 255, 255)",
			fontSize: "22px",
			lineHeight: "32px",
			fontWeight: 400,
			letterSpacing: "unset"
		},
		dialogContent: {
			fontSize: "16px",
			color: "rgba(255, 255, 255, 0.6)",
			padding: "0px 24px 24px",
			border: "none",
			maxHeight: "329px"
		},
		collapse: {
			padding: "0px 0 16px",
			borderBottom: "1px solid rgb(65, 69, 74)"
		}
	};


	const userChecklist = sortedOrgUsers
		.filter(user => {
			return user.id !== userId;
		})
		.map(user => (
			<FormControlLabel
				className="rulesCheckBox"
				control={<Checkbox
					key={user.id}
					onChange={() => handleFilterOwner(user.id)}
					sx={styles.checkBoxRoot}
				/>}
				label={user.name}
				classes={{ root: classes.formControlLabel, label: classes.label }}
			/>
		));

	const filterValues = [];
	if (filterTriggerExit) filterValues.push("exit");
	if (filterTriggerEnter) filterValues.push("enter");
	if (filterTriggerCross) filterValues.push("cross");
	if (filterTriggerLoiter) filterValues.push("loiter");
	if (filterTriggerNewRequest) filterValues.push("berth-assignment-created");
	if (filterTriggerRequestApproval)
		filterValues.push("berth-assignment-approval");
	if (filterTriggerBerthUpdates) filterValues.push("berth-assignment-update");
	if (filterTriggerArrivals) filterValues.push("arrival");
	if (filterTriggerDepartures) filterValues.push("departure");
	if (filterTriggerSecurityViolations)
		filterValues.push("berth-security-violation");

	const rulesArr = Object.keys(rules).map(id => {
		return rules[id];
	});

	const myRules = rulesArr
		.filter(rule => {
			return rule.owner === userId;
		})
		// filter by trigger
		.filter(rule => {
			if (isEmpty(filterValues) === true) return true;
			else {
				if (some(filterValues, el => includes(rule.trigger, el)))
					return true;
				else return false;
			}
		})
		// filter by typeahead
		.filter(rule => {
			if (typeAheadFilter === "") return rule;
			else {
				if (
					includes(rule.title.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					includes(rule.desc.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					!rule.desc &&
					includes(
						rule.statement.toLowerCase(),
						typeAheadFilter.toLowerCase()
					)
				) {
					return rule;
				} else return false;
			}
		})
		.map((rule, index) => (
			<RuleItem
				key={rule.id}
				canManage={canManage || (userId === rule.owner)}
				dialogId={rule.id}
				closeDialog={closeDialog}
				openDialog={openDialog}
				linkId={rule.id}
				ruleName={rule.title}
				isPriority={
					rule.assignments[userId] && rule.assignments[userId].isPriority
				}
				desc={rule.desc || rule.statement}
				notifySystem={
					rule.assignments[userId] && rule.assignments[userId].notifySystem
				}
				notifyEmail={
					rule.assignments[userId] && rule.assignments[userId].notifyEmail
				}
				notifyPush={
					rule.assignments[userId] && rule.assignments[userId].notifyPush
				}
				deleteCallback={_confirmDelete}
				dir={dir}
			/>
		));
	const numMyRules = myRules.length;
	const sharedRules = rulesArr
		.filter(rule => {
			if (rule.assignments[userId])
				return rule.assignments[userId].shared && rule.owner !== userId;
		})
		// filter by trigger
		.filter(rule => {
			if (isEmpty(filterValues) === true) return true;
			else {
				if (some(filterValues, el => includes(rule.trigger, el)))
					return true;
				else return false;
			}
		})
		// filter by typeahead
		.filter(rule => {
			if (typeAheadFilter === "") return rule;
			else {
				if (
					includes(rule.title.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					includes(rule.desc.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					!rule.desc &&
					includes(
						rule.statement.toLowerCase(),
						typeAheadFilter.toLowerCase()
					)
				) {
					return rule;
				} else return false;
			}
		})
		// filter by rule owner
		.filter(rule => {
			if (filterOwner.length > 0) {
				return filterOwner.includes(rule.owner);
			} else {
				return rule;
			}
		})
		.map((rule, index) => (
			<RuleItem
				key={rule.id}
				canManage={canManage}
				dialogId={rule.id}
				linkId={rule.id}
				ruleName={rule.title}
				isPriority={
					rule.assignments[userId] && rule.assignments[userId].isPriority
				}
				desc={rule.desc || rule.statement}
				notifySystem={
					rule.assignments[userId] && rule.assignments[userId].notifySystem
				}
				notifyEmail={
					rule.assignments[userId] && rule.assignments[userId].notifyEmail
				}
				notifyPush={
					rule.assignments[userId] && rule.assignments[userId].notifyPush
				}
				sharedRule={true}
				userId={userId}
				rule={rule}
				closeDialog={closeDialog}
				openDialog={openDialog}
				isOpen={isOpen}
				unsubscribeFromRule={unsubscribeFromRule}
				dir={dir}
			/>
		));
	const numSharedRules = sharedRules.length;

	const menuItems = RULE_OPTIONS.map(option => {
		if (!option.condition || props[option.condition] === true) {
			return (
				<MenuItem key={option.value} onClick={() => _goCreate(option.value)} sx={styles.ruleOption}>
					{option.label}
				</MenuItem>
			);
		}
		return null;
	});
	const createButton = (
		<div>
			<Button
				onClick={openMenu}
				color="primary"
				sx={styles.createNewRule}
			>
				<span style={{ padding: "0 8px", letterSpacing: 0 }}>{getTranslation("main.mainJsx.createButton.createNewRule")}</span>
			</Button>
			<Popover
				open={menuOpen}
				anchorEl={anchorEl}
				anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
				anchorPosition={{ horizontal: "left", vertical: "top" }}
				onClose={handleRequestClose}
				style={{
					backgroundColor: "transparent"
				}}
				PaperProps={{
					style: {
						width: "168px",
						padding: "8px 0",
						boxShadow: "rgb(0 0 0 / 12%) 0px 1px 6px, rgb(0 0 0 / 12%) 0px 1px 4px"
					}
				}}
			>
				{menuItems}
			</Popover>
		</div>
	);

	const createButtonMobile = (
		<div>
			<Fab
				className="mobile-create-button"
				onClick={openMenuMobile}
				style={menuOpenMobile ? { opacity: 0.4 } : { opacity: 1 }}
			>
				<div className="create-rule-icon" />
			</Fab>
			<Popover
				open={menuOpenMobile}
				anchorEl={anchorEl}
				anchorOrigin={{ horizontal: "right", vertical: "top" }}
				anchorPosition={{ horizontal: "right", vertical: "bottom" }}
				onClose={handleRequestCloseMobile}
			>
				<Menu>
					<MenuItem
						primaryText={getTranslation("main.mainJsx.rulesOptions.label.trackMovement")}
						onClick={() => _goCreate("track-movement")}
					/>
					{canCreateVesselEventRule && <MenuItem
						primaryText={getTranslation("main.mainJsx.rulesOptions.label.vesselEventRule")}
						onClick={() => _goCreate("vessel-event")}
					/>}
				</Menu>
			</Popover>
		</div>
	);

	const setTriggerCollapse = () => {
		setCollapse({ ...collapse, trigger: !collapse.trigger });
	};

	const setUserCheckCollapse = () => {
		setCollapse({ ...collapse, userCheck: !collapse.userCheck });
	};

	return (
		<div className="rules-wrapper-home">
			<div className="rules-filters" style={styles.ruleFilters}>
				<h2><Translate value="main.mainJsx.rulesFilters.filterBy" /></h2>
				<ListItem
					key={"trigger-list"}
					sx={styles.listItem}
				>
					<ListItemButton className="listItemButton-overrides" sx={{ ...styles.listItemButton, background: "none!important" }} onClick={setTriggerCollapse}>
						<ListItemText
							primary={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.primaryText")}
							sx={{ margin: "0px" }}
							primaryTypographyProps={{ style: styles.listItemText }}
						/>
						<IconButton edge="end" onClick={setTriggerCollapse} style={{ color: "#fff", background: "none" }}>
							{collapse.trigger ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</ListItemButton>
					<div style={collapse.trigger ? styles.collapse : { ...styles.collapse, display: "none" }}>
						<FormControlLabel
							className="rulesCheckBox"
							control={<Checkbox
								key={1}
								checked={filterTriggerCross}
								onChange={() => dispatch(filterToggleTrigger("Cross"))}
								sx={styles.checkBoxRoot}
							/>}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.cross")}
							classes={{ root: classes.formControlLabel, label: classes.label }}
						/>
						<FormControlLabel
							className="rulesCheckBox"
							control={<Checkbox
								key={2}
								checked={filterTriggerEnter}
								onChange={() => dispatch(filterToggleTrigger("Enter"))}
								sx={styles.checkBoxRoot}
							/>}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.enter")}
							classes={{ root: classes.formControlLabel, label: classes.label }}
						/>
						<FormControlLabel
							className="rulesCheckBox"
							control={<Checkbox
								key={3}
								checked={filterTriggerExit}
								onChange={() => dispatch(filterToggleTrigger("Exit"))}
								sx={styles.checkBoxRoot}
							/>}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.exit")}
							classes={{ root: classes.formControlLabel, label: classes.label }}
						/>
						<FormControlLabel
							className="rulesCheckBox"
							control={<Checkbox
								key={4}
								checked={filterTriggerLoiter}
								onChange={() => dispatch(filterToggleTrigger("Loiter"))}
								sx={styles.checkBoxRoot}
							/>}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.loiter")}
							classes={{ root: classes.formControlLabel, label: classes.label }}
						/>
						{canCreateVesselEventRule ? <><FormControlLabel
							className="rulesCheckBox"
							control={<Checkbox
								key={5}
								checked={filterTriggerNewRequest}
								onChange={() => dispatch(filterToggleTrigger("NewRequest"))}
								sx={styles.checkBoxRoot}
							/>}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.newRequest")}
							classes={{ root: classes.formControlLabel, label: classes.label }}
						/><FormControlLabel
								className="rulesCheckBox"
								control={<Checkbox
									key={6}
									checked={filterTriggerRequestApproval}
									onChange={() => dispatch(filterToggleTrigger("RequestApproval"))}
									sx={styles.checkBoxRoot}
								/>}
								label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.requestApproval")}
								classes={{ root: classes.formControlLabel, label: classes.label }}
							/><FormControlLabel
								className="rulesCheckBox"
								control={<Checkbox
									key={7}
									checked={filterTriggerBerthUpdates}
									onChange={() => dispatch(filterToggleTrigger("BerthUpdates"))}
									sx={styles.checkBoxRoot}
								/>}
								label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.berthUpdates")}
								classes={{ root: classes.formControlLabel, label: classes.label }}
							/><FormControlLabel
								className="rulesCheckBox"
								control={<Checkbox
									key={8}
									checked={filterTriggerArrivals}
									onChange={() => dispatch(filterToggleTrigger("Arrivals"))}
									sx={styles.checkBoxRoot}
								/>}
								label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.arrivals")}
								classes={{ root: classes.formControlLabel, label: classes.label }}
							/><FormControlLabel
								className="rulesCheckBox"
								control={<Checkbox
									key={9}
									checked={filterTriggerDepartures}
									onChange={() => dispatch(filterToggleTrigger("Departures"))}
									sx={styles.checkBoxRoot}
								/>}
								label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.departures")}
								classes={{ root: classes.formControlLabel, label: classes.label }}
							/><FormControlLabel
								className="rulesCheckBox"
								control={<Checkbox
									key={10}
									checked={filterTriggerSecurityViolations}
									onChange={() => dispatch(filterToggleTrigger("SecurityViolations"))}
									sx={styles.checkBoxRoot}
								/>}
								label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.securityViolations")}
								classes={{ root: classes.formControlLabel, label: classes.label }}
							/></>
							: <div></div>
						}
					</div>
				</ListItem>
				<ListItem
					key={"createdby"}
					sx={styles.listItem}
				>
					<ListItemButton className="listItemButton-overrides" sx={{ ...styles.listItemButton, background: "none!important" }} onClick={setUserCheckCollapse}>
						<ListItemText
							primary={getTranslation("main.mainJsx.rulesFilters.listItem.createdby.primaryText")}
							sx={{ margin: "0px" }}
							primaryTypographyProps={{ style: styles.listItemText }}
						/>
						<IconButton edge="end" style={{ color: "#fff", background: "none" }}>
							{collapse.userCheck ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</ListItemButton>
					<div style={collapse.userCheck ? styles.collapse : { ...styles.collapse, display: "none" }}>
						{userChecklist}
					</div>
				</ListItem>
			</div>
			<div className="rules-areas">
				<div className="row">
					<div className="row-item fullwidth">
						<ErrorBoundary>
							<TypeAheadFilter
								className="typeAheadFilter"
								placeholder={getTranslation("main.mainJsx.rulesFilters.rulesAreas.TypeAheadFilterContainer.placeholder")}
								dispatch={dispatch}
							/>
						</ErrorBoundary>
					</div>
					<div className="row-item fullwidth">
						{createButtonMobile}

						<div className="createRuleBtn">{createButton}</div>
					</div>
				</div>
				<div className="rulesSectionWrapper">
					<h3 className="rulesSectionTitle">
						{numMyRules === 1 ? <Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.ruleSectionTitle" count={numMyRules} /> : <Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.rulesSectionTitle" count={numMyRules} />}
					</h3>
					<div className="row rulesContainer">
						{numMyRules === 0 ? <p><Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.rulesContainer" /></p> : myRules}
					</div>
				</div>
				<div className="rulesSectionWrapper">
					<h3 className="rulesSectionTitle">
						{numSharedRules === 1 ? <Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.ruleShared" count={numSharedRules} /> : <Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.rulesShared" count={numSharedRules} />}
					</h3>
					<div className="row rulesContainer">
						{numSharedRules === 0 ? (
							<p>
								<Translate value="main.mainJsx.rulesFilters.rulesAreas.rulesSectionWrapper.noRules" />
							</p>
						) : (
							sharedRules
						)}
					</div>
				</div>
			</div>
			<Dialog
				PaperProps={{ className: "delete-dialog", sx: styles.paperProps }}
				open={isOpen === "main-delete-dialog"}
				onClose={_handleClose}
				classes={{ scrollPaper: classes.mainScrollPaper }}
			>
				<DialogTitle
					sx={styles.dialogTitle}
				>
					{getTranslation("main.mainJsx.rulesFilters.dialog.title")}
				</DialogTitle>
				<span style={styles.dialogContent}>
					<Translate value="main.mainJsx.rulesFilters.dialog.content" />
				</span>
				<DialogActions>{actions}</DialogActions>
			</Dialog>
		</div >
	);
};

export default Main;
