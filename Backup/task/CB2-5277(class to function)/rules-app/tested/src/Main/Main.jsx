import React, { useEffect, useState } from "react";
import TypeAheadFilterContainer from "../TypeAheadFilter/TypeAheadFilterContainer";
import RuleItem from "./components/RuleItem";

//Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material ui components
import { ListItem } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Checkbox from "material-ui/Checkbox";
import Popover from "material-ui/Popover";
import MenuItem from "material-ui/MenuItem";
import Menu from "material-ui/Menu";
import Dialog from "material-ui/Dialog";
import FloatingActionButton from "material-ui/FloatingActionButton";

// utils
import _ from "lodash";
import { hashHistory } from "react-router";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

let RULE_OPTIONS = [];

const Main = (props) => {
	const {
		closeDialog,
		deleteRule,
		openDialog,
		canManage,
		rules,
		userId,
		orgUsers,
		typeAheadFilter,
		filterToggleTrigger,
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
		unsubscribeFromRule,
		isOpen
	} = props;
	const [open, setOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuOpenMobile, setMenuOpenMobile] = useState(false);
	const [filterOwner, setFilterOwner] = useState([]);
	const [ruleToDelete, setRuleToDelete] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if(!mounted) {
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
		closeDialog("main-delete-dialog");
	};

	const _deleteAndClose = () => {
		deleteRule(ruleToDelete);
		closeDialog("main-delete-dialog");
	};

	const _confirmDelete = (id) => {
		openDialog("main-delete-dialog");
		setRuleToDelete(id);
	};

	const deleteRuleById = (id) => {
		deleteRule(id);
	};

	const _goCreate = path => {
		hashHistory.push(`/create/${path}`);
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
		<FlatButton label={getTranslation("main.mainJsx.actions.label.cancel")} primary={true} onClick={_handleClose} />,
		<FlatButton
			label={getTranslation("main.mainJsx.actions.label.delete")}
			primary={true}
			keyboardFocused={true}
			onClick={_deleteAndClose}
			style={{
				color: "#E85858"
			}}
		/>
	];
	const sortedOrgUsers = orgUsers.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}

		return 0;
	});

	const userChecklist = sortedOrgUsers
		.filter(user => {
			return user.id !== userId;
		})
		.map(user => (
			<Checkbox
				label={user.name}
				key={user.id}
				labelStyle={{
					fontSize: 14,
					color: "#828283"
				}}
				onCheck={() => handleFilterOwner(user.id)}
				iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
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
			if (_.isEmpty(filterValues) === true) return true;
			else {
				if (_.some(filterValues, el => _.includes(rule.trigger, el)))
					return true;
				else return false;
			}
		})
		// filter by typeahead
		.filter(rule => {
			if (typeAheadFilter === "") return rule;
			else {
				if (
					_.includes(rule.title.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					_.includes(rule.desc.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					!rule.desc &&
					_.includes(
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
				deleteCallback={_confirmDelete.bind(this)}
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
			if (_.isEmpty(filterValues) === true) return true;
			else {
				if (_.some(filterValues, el => _.includes(rule.trigger, el)))
					return true;
				else return false;
			}
		})
		// filter by typeahead
		.filter(rule => {
			if (typeAheadFilter === "") return rule;
			else {
				if (
					_.includes(rule.title.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					_.includes(rule.desc.toLowerCase(), typeAheadFilter.toLowerCase())
				) {
					return rule;
				} else if (
					!rule.desc &&
					_.includes(
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
				<MenuItem
					key={option.value}
					primaryText={option.label}
					onClick={() => _goCreate(option.value)}
				/>
			);
		}
		return null;
	});
	const createButton = (
		<div>
			<RaisedButton
				label={getTranslation("main.mainJsx.createButton.createNewRule")}
				secondary={true}
				onClick={openMenu}
				style={menuOpen ? { opacity: 0.4 } : { opacity: 1 }}
			/>
			<Popover
				open={menuOpen}
				anchorEl={anchorEl}
				anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
				targetOrigin={{ horizontal: "left", vertical: "top" }}
				onRequestClose={handleRequestClose}
			>
				<Menu>
					{menuItems}
				</Menu>
			</Popover>
		</div>
	);

	const createButtonMobile = (
		<div>
			<FloatingActionButton
				className="mobile-create-button"
				onClick={openMenuMobile}
				style={menuOpenMobile ? { opacity: 0.4 } : { opacity: 1 }}
			>
				<div className="create-rule-icon" />
			</FloatingActionButton>
			<Popover
				open={menuOpenMobile}
				anchorEl={anchorEl}
				anchorOrigin={{ horizontal: "right", vertical: "top" }}
				targetOrigin={{ horizontal: "right", vertical: "bottom" }}
				onRequestClose={handleRequestCloseMobile}
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

	return (
		<div className="rules-wrapper-home">
			<div className="rules-filters">
				<h2><Translate value="main.mainJsx.rulesFilters.filterBy" /></h2>

				<ListItem
					key={"trigger-list"}
					primaryText={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.primaryText")}
					style={{
						fontSize: 12
					}}
					nestedListStyle={{
						padding: "0 0 16px 0",
						borderBottom: "1px solid #41454A"
					}}
					innerDivStyle={dir == "rtl" ? {
						paddingRight: 0
					} : {
						paddingLeft: 0
					}}
					hoverColor={"transparent"}
					initiallyOpen={true}
					primaryTogglesNestedList={true}
					nestedItems={[
						<Checkbox
							key={1}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.cross")}
							checked={filterTriggerCross}
							labelStyle={{
								fontSize: 14,
								color: "#828283"
							}}
							onClick={() => filterToggleTrigger("Cross")}
							iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
						/>,
						<Checkbox
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.enter")}
							key={2}
							checked={filterTriggerEnter}
							labelStyle={{
								fontSize: 14,
								color: "#828283"
							}}
							onClick={() => filterToggleTrigger("Enter")}
							iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
						/>,
						<Checkbox
							key={3}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.exit")}
							checked={filterTriggerExit}
							labelStyle={{
								fontSize: 14,
								color: "#828283"
							}}
							onClick={() => filterToggleTrigger("Exit")}
							iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
						/>,
						<Checkbox
							key={4}
							label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.loiter")}
							checked={filterTriggerLoiter}
							labelStyle={{
								fontSize: 14,
								color: "#828283"
							}}
							onClick={() => filterToggleTrigger("Loiter")}
							iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
						/>,
						...(canCreateVesselEventRule ?
							[
								<Checkbox
									key={5}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.newRequest")}
									checked={filterTriggerNewRequest}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("NewRequest")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>,
								<Checkbox
									key={6}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.requestApproval")}
									checked={filterTriggerRequestApproval}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("RequestApproval")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>,
								<Checkbox
									key={7}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.berthUpdates")}
									checked={filterTriggerBerthUpdates}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("BerthUpdates")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>,
								<Checkbox
									key={8}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.arrivals")}
									checked={filterTriggerArrivals}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("Arrivals")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>,
								<Checkbox
									key={9}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.departures")}
									checked={filterTriggerDepartures}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("Departures")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>,
								<Checkbox
									key={10}
									label={getTranslation("main.mainJsx.rulesFilters.listItem.triggerList.nestedItems.checkbox.label.securityViolations")}
									checked={filterTriggerSecurityViolations}
									labelStyle={{
										fontSize: 14,
										color: "#828283"
									}}
									onClick={() => filterToggleTrigger("SecurityViolations")}
									iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
								/>
							] : []
						)
					]}
				/>
				<ListItem
					key={"createdby"}
					primaryText={getTranslation("main.mainJsx.rulesFilters.listItem.createdby.primaryText")}
					style={{
						padding: 0,
						fontSize: 12
					}}
					nestedListStyle={{
						padding: "0 0 16px 0",
						borderBottom: "1px solid #41454A"
					}}
					innerDivStyle={dir == "rtl" ? {
						paddingRight: 0
					} : {
						paddingLeft: 0
					}}
					hoverColor={"transparent"}
					initiallyOpen={true}
					primaryTogglesNestedList={true}
					nestedItems={userChecklist}
				/>
			</div>
			<div className="rules-areas">
				<div className="row">
					<div className="row-item fullwidth">
						<ErrorBoundary>
							<TypeAheadFilterContainer
								className="typeAheadFilter"
								placeholder={getTranslation("main.mainJsx.rulesFilters.rulesAreas.TypeAheadFilterContainer.placeholder")}
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
				paperClassName="delete-dialog"
				title={getTranslation("main.mainJsx.rulesFilters.dialog.title")}
				actions={actions}
				modal={false}
				open={isOpen === "main-delete-dialog"}
				onRequestClose={_handleClose}
			>
				<Translate value="main.mainJsx.rulesFilters.dialog.content" />
			</Dialog>
		</div>
	);
};

export default Main;
