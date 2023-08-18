import React, { Component } from "react";
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

const RULE_OPTIONS = [
	{
		label: "Track Movement",
		value: "track-movement"
	},
	{
		label: "Vessel Event Rule",
		value: "vessel-event",
		condition: "canCreateVesselEventRule"
	},
	{
		label: "Alarm Rule",
		value: "alarm"
	},
	{
		label: "Event Created",
		value: "create-event"
	}
];

class Main extends Component {
	state = {
		open: false,
		menuOpen: false,
		menuOpenMobile: false,
		filterOwner: []
	};

	_handleClose = () => {
		this.props.closeDialog("main-delete-dialog");
	};

	_deleteAndClose = () => {
		this.props.deleteRule(this.state.ruleToDelete);
		this.props.closeDialog("main-delete-dialog");
	};

	_confirmDelete(id) {
		this.props.openDialog("main-delete-dialog");
		this.setState({
			ruleToDelete: id
		});
	}

	deleteRule(id) {
		this.props.deleteRule(id);
	}

	_goCreate = path => {
		hashHistory.push(`/create/${path}`);
	};

	openMenu = e => {
		this.setState({
			menuOpen: true,
			anchorEl: e.currentTarget
		});
	};

	openMenuMobile = e => {
		this.setState({
			menuOpenMobile: true,
			anchorEl: e.currentTarget
		});
	};

	handleRequestClose = () => {
		this.setState({
			menuOpen: false
		});
	};

	handleRequestCloseMobile = () => {
		this.setState({
			menuOpenMobile: false
		});
	};

	handleFilterOwner = userId => {
		const filters = this.state.filterOwner;
		if (this.state.filterOwner.includes(userId)) {
			filters.splice(filters.indexOf(userId), 1);
			this.setState({
				filterOwner: filters
			});
		} else {
			this.setState({
				filterOwner: [...this.state.filterOwner, userId]
			});
		}
	};

	render() {
		const {
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
			filterTriggerSecurityViolations
		} = this.props;

		const actions = [
			<FlatButton label="Cancel" primary={true} onClick={this._handleClose} />,
			<FlatButton
				label="Yes, Delete"
				primary={true}
				keyboardFocused={true}
				onClick={this._deleteAndClose}
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
					onCheck={() => this.handleFilterOwner(user.id)}
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
					closeDialog={this.props.closeDialog}
					openDialog={this.props.openDialog}
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
					deleteCallback={this._confirmDelete.bind(this)}
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
				if (this.state.filterOwner.length > 0) {
					return this.state.filterOwner.includes(rule.owner);
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
					closeDialog={this.props.closeDialog}
					openDialog={this.props.openDialog}
					isOpen={this.props.isOpen}
					unsubscribeFromRule={this.props.unsubscribeFromRule}
				/>
			));
		const numSharedRules = sharedRules.length;

		const menuItems = RULE_OPTIONS.map(option => {
			if (!option.condition || this.props[option.condition] === true) {
				return (
					<MenuItem
						key={option.value}
						primaryText={option.label}
						onClick={() => this._goCreate(option.value)}
					/>
				);
			}
			return null;
		});
		const createButton = (
			<div>
				<RaisedButton
					label={"Create New Rule \u23f7"}
					secondary={true}
					onClick={this.openMenu}
					style={this.state.menuOpen ? { opacity: 0.4 } : { opacity: 1 }}
				/>
				<Popover
					open={this.state.menuOpen}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
					targetOrigin={{ horizontal: "left", vertical: "top" }}
					onRequestClose={this.handleRequestClose}
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
					onClick={this.openMenuMobile}
					style={this.state.menuOpenMobile ? { opacity: 0.4 } : { opacity: 1 }}
				>
					<div className="create-rule-icon" />
				</FloatingActionButton>
				<Popover
					open={this.state.menuOpenMobile}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: "right", vertical: "top" }}
					targetOrigin={{ horizontal: "right", vertical: "bottom" }}
					onRequestClose={this.handleRequestCloseMobile}
				>
					<Menu>
						<MenuItem
							primaryText="Track Movement"
							onClick={() => this._goCreate("track-movement")}
						/>
						{this.props.canCreateVesselEventRule && <MenuItem
							primaryText="Vessel Event Rule"
							onClick={() => this._goCreate("vessel-event")}
						/>}
					</Menu>
				</Popover>
			</div>
		);

		return (
			<div className="rules-wrapper-home">
				<div className="rules-filters">
					<h2>Filter By...</h2>

					<ListItem
						key={"trigger-list"}
						primaryText="Trigger"
						style={{
							fontSize: 12
						}}
						nestedListStyle={{
							padding: "0 0 16px 0",
							borderBottom: "1px solid #41454A"
						}}
						innerDivStyle={{
							paddingLeft: 0
						}}
						hoverColor={"transparent"}
						initiallyOpen={true}
						primaryTogglesNestedList={true}
						nestedItems={[
							<Checkbox
								key={1}
								label="Cross"
								checked={filterTriggerCross}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Cross")}
							/>,
							<Checkbox
								label="Enter"
								key={2}
								checked={filterTriggerEnter}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Enter")}
							/>,
							<Checkbox
								key={3}
								label="Exit"
								checked={filterTriggerExit}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Exit")}
							/>,
							<Checkbox
								key={4}
								label="Loiter"
								checked={filterTriggerLoiter}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Loiter")}
							/>,
							// TODO: Add vessel-event triggers
							<Checkbox
								key={5}
								label="New Request"
								checked={filterTriggerNewRequest}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("NewRequest")}
							/>,
							<Checkbox
								key={6}
								label="Request Approval"
								checked={filterTriggerRequestApproval}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("RequestApproval")}
							/>,
							<Checkbox
								key={7}
								label="Berth Updates"
								checked={filterTriggerBerthUpdates}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("BerthUpdates")}
							/>,
							<Checkbox
								key={8}
								label="Arrivals"
								checked={filterTriggerArrivals}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Arrivals")}
							/>,
							<Checkbox
								key={9}
								label="Departures"
								checked={filterTriggerDepartures}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("Departures")}
							/>,
							<Checkbox
								key={10}
								label="Security Violations"
								checked={filterTriggerSecurityViolations}
								labelStyle={{
									fontSize: 14,
									color: "#828283"
								}}
								onClick={() => filterToggleTrigger("SecurityViolations")}
							/>
						]}
					/>
					<ListItem
						key={"createdby"}
						primaryText="Created By"
						style={{
							padding: 0,
							fontSize: 12
						}}
						nestedListStyle={{
							padding: "0 0 16px 0",
							borderBottom: "1px solid #41454A"
						}}
						innerDivStyle={{
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
									placeholder={"I want to find..."}
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
							{numMyRules === 1 ? "rule" : "rules"} I created ({numMyRules})
						</h3>
						<div className="row rulesContainer">
							{numMyRules === 0 ? <p>You have no rules available.</p> : myRules}
						</div>
					</div>
					<div className="rulesSectionWrapper">
						<h3 className="rulesSectionTitle">
							{numSharedRules === 1 ? "rule" : "rules"} shared with me (
							{numSharedRules})
						</h3>
						<div className="row rulesContainer">
							{numSharedRules === 0 ? (
								<p>
									There are no rules subscriptions shared with you at the
									moment.
								</p>
							) : (
								sharedRules
							)}
						</div>
					</div>
				</div>
				<Dialog
					paperClassName="delete-dialog"
					title="DELETE RULE"
					actions={actions}
					modal={false}
					open={this.props.isOpen === "main-delete-dialog"}
					onRequestClose={this._handleClose}
				>
					Are you sure you want to delete this rule?
				</Dialog>
			</div>
		);
	}
}

export default Main;
