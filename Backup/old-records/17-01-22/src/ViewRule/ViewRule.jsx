import React, { Component, Fragment } from "react";
import _ from "lodash";
import { Link, hashHistory } from "react-router";

// Material UI
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import Checkbox from "material-ui/Checkbox";

import ruleStatementBuilder from "orion-components/rule-builder";

class ViewRule extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			edited: false,
			rule: {}
		};
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		const ruleId = nextProps.params.id;
		const rule = nextProps.rules.filter(rule => {
			if (rule.id === ruleId) {
				return JSON.parse(JSON.stringify(rule));
			}
		})[0];
		if (rule && (!prevState.rule.id || prevState.rule.id !== rule.id)) {
			nextProps.addContext(rule);
			return {
				rule: rule,
				myAssignments: rule.assignments[nextProps.user.id]
			};
		}

	}
	// UNSAFE_componentWillMount() {
	// 	const myUser = this.props.user;

	// 	const ruleId = this.props.params.id;
	// 	const rule = this.props.rules.filter(rule => {
	// 		if (rule.id === ruleId) {
	// 			return JSON.parse(JSON.stringify(rule));
	// 		}
	// 	})[0];
	// 	this.props.addContext(rule);
	// 	this.setState({
	// 		rule: rule,
	// 		myAssignments: rule.assignments[myUser.id]
	// 	});
	// }

	_handleClose = () => {
		this.props.removeContext(this.state.rule.id);
		this.props.closeDialog("view-rule-dialog");
	};

	handleOpen = () => {
		this.props.openDialog("view-rule-dialog");
	};

	_deleteAndHome = id => {
		this.props.deleteRule(id);
		this.props.closeDialog("view-rule-dialog");
		hashHistory.push("/");
	};

	backToHome = () => {
		this.props.removeContext(this.state.rule.id);
		hashHistory.push("/");
	};

	// User can choose alerts they receive for individual rules
	toggleMyAssignment = alertType => {
		const assignments = { ...this.state.myAssignments };
		assignments[alertType] = !assignments[alertType];
		// If toggled priority, toggle notifySystem if not already toggled
		if (
			alertType === "isPriority" &&
			assignments[alertType] &&
			!assignments["notifySystem"]
		)
			assignments["notifySystem"] = true;
		assignments["shared"] =
			assignments.isPriority ||
			assignments.notifyEmail ||
			assignments.notifySystem ||
			assignments.notifyPush;
		this.setState({
			myAssignments: assignments,
			edited: true
		});
	};

	handleSave = () => {
		const { rule } = this.state;
		const myUser = this.props.user;
		const assignments = rule.assignments;
		assignments[myUser.id] = this.state.myAssignments;

		this.props.updateRule(
			rule.id,
			rule.title,
			rule.desc,
			rule.audioSettings,
			rule.dismissForOrg,
			rule.statement,
			rule.subject,
			rule.trigger,
			rule.targets,
			rule.conditions,
			rule.escalationEvent,
			assignments
		);
		this.setState({
			edited: false
		});
	};

	render() {
		const { orgUsers, userId, user, canManage, timeFormatPreference, WavCamOpen } = this.props;
		const { rule, myAssignments } = this.state;
		const actions = [
			<FlatButton label="Cancel" primary={true} onClick={this._handleClose} />,
			<FlatButton
				label="Yes, Delete"
				primary={true}
				keyboardFocused={true}
				onClick={() => this._deleteAndHome(rule.id)}
				style={{
					color: "#E85858"
				}}
			/>
		];

		const author = orgUsers.filter(user => {
			return user.id === rule.owner;
		});

		const assignees = rule.assignments ? Object.values(rule.assignments) : [];
		let sharedUsers = assignees.filter(user => {
			return user.shared === true;
		});

		sharedUsers = _.sortBy(sharedUsers, user => {
			return user.id === userId ? 0 : 1;
		});

		const myUser = user;
		const owner = myUser.profile.id === rule.owner;
		rule.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";

		let alertAudio = "Speak ";
		if (rule.audioSettings) {
			if (rule.audioSettings.speakAlertText && rule.audioSettings.speakAlertNotification)
				alertAudio += "\"" + rule.audioSettings.alertText + "\", followed by alert notification text.";
			else if (rule.audioSettings.speakAlertText && !rule.audioSettings.speakAlertNotification)
				alertAudio +=  "\"" + rule.audioSettings.alertText + "\".";
			else if (!rule.audioSettings.speakAlertText && rule.audioSettings.speakAlertNotification)
				alertAudio = "Speak alert notification text.";
		} else {
			alertAudio += "\"Alert, Alert\", followed by alert notification text.";
		}

		const dismissText = rule.dismissForOrg ? "Dismiss alerts for all users in the Organization."
			: "Dismiss alerts by user.";

		return (rule.id ? <div className="rules-wrapper" style={{ overflowY: "scroll", height: `calc(100vh - ${WavCamOpen ? "308px" : "48px"})` }}>
			<IconButton className="back-arrow" onClick={this.backToHome}>
				<ArrowBack />
			</IconButton>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="viewTitling">
						<h1>{rule.title}</h1>
						<span className="author">Created by {author[0] ? author[0].name : ""}</span>
						<h3 className="inline-rule-statement">
							{rule.desc || rule.statement ||
								ruleStatementBuilder(
									rule,
									this.props.collections,
									() => { },
									false
								)}
						</h3>
					</div>
				</div>
				<div className="row-item">
					<div className="rule-operations">
						<ul>
							{(canManage || owner) && (
								<Fragment>
									<li>
										<Link to={`/edit/${rule.id}`}>
											<i className="material-icons">edit</i>
											<span>Edit</span>
										</Link>
									</li>
									<li>
										<button onClick={this.handleOpen}>
											<i className="material-icons delete-rule-button">
												delete
											</i>
											<span>Delete</span>
										</button>
									</li>
								</Fragment>
							)}
						</ul>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="rule-states">
						<span>The rule states...</span>
						<h2>
							"
							{rule.statement ||
								ruleStatementBuilder(
									rule,
									this.props.collections,
									() => { },
									false
								)}
							"
						</h2>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="row-item fullwidth">
					<div className="view-rule-attribute">
						<h1>Alert Audio</h1>
						<h3>{alertAudio}</h3>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="row-item fullwidth">
					<div className="view-rule-attribute">
						<h1>Alert Dismiss Rule</h1>
						<h3>{dismissText}</h3>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="row-item fullwidth">
					<div className="alert-table">
						<table>
							<thead>
								{sharedUsers.length > 0 && (
									<tr className="nobg">
										<th>
											<span className="gets-alerts">Who gets alerts?</span>
										</th>
										<th className="priority">
											<span className="break-icon priority">
												<i className="material-icons priority">error</i>
											</span>
											Priority
										</th>
										<th>
											<span className="break-icon">
												<i className="material-icons">laptop</i>
											</span>
											System
										</th>
										<th>
											<span className="break-icon">
												<i className="material-icons">email</i>
											</span>
											Emails
										</th>
										{/* FIXME: Disabling until push notifications are resolved <th><span className="break-icon"><i className="material-icons">phone_iphone</i></span>Push</th> */}
									</tr>
								)}
							</thead>
							<tbody>
								{sharedUsers.length === 0 && (
									<div className="unshared-rule-message">
										<span className="gets-alerts">Who gets alerts?</span>
										<p>
											This rule is not currently being shared with other
											users.
										</p>
									</div>
								)}
								{sharedUsers.map(user => {
									if (user.id === myUser.id) {
										return (
											<tr key={user.id}>
												<td>{user.user}</td>
												<td>
													<Checkbox
														checked={myAssignments["isPriority"]}
														onClick={() =>
															this.toggleMyAssignment("isPriority")
														}
														style={{
															width: "auto"
														}}
													/>
												</td>
												<td>
													<Checkbox
														checked={myAssignments["notifySystem"]}
														onClick={() =>
															this.toggleMyAssignment("notifySystem")
														}
														style={{
															width: "auto"
														}}
														disabled={myAssignments["isPriority"]}
													/>
												</td>
												<td>
													<Checkbox
														checked={myAssignments["notifyEmail"]}
														onClick={() =>
															this.toggleMyAssignment("notifyEmail")
														}
														style={{
															width: "auto"
														}}
													/>
												</td>
												{/* FIXME: Disabling until push notifications are resolved
														<td>
															<Checkbox
																checked={this.state.myAssignments["notifyPush"]}
																onClick={() => this.toggleMyAssignment("notifyPush")}
																style={{
																	width: "auto"
																}}
															/>
														</td> */}
											</tr>
										);
									} else {
										return (
											<tr key={user.id}>
												<td>{user.user}</td>
												<td>
													<div
														className={`alert-toggle priority-toggle ${
															user.isPriority ? "checked" : "unchecked"
														}`}
													/>
												</td>
												<td>
													<div
														className={`alert-toggle ${
															user.notifySystem ? "checked" : "unchecked"
														}`}
													/>
												</td>
												<td>
													<div
														className={`alert-toggle ${
															user.notifyEmail ? "checked" : "unchecked"
														}`}
													/>
												</td>
												{/* FIXME: Disabling until push notifications are resolved
														<td>
															<div
																className={`alert-toggle ${user.notifyPush ? "checked" : "unchecked"}`}
															>	
															</div>
														</td> */}
											</tr>
										);
									}
								})}
							</tbody>
						</table>
						{this.state.edited && (
							<RaisedButton
								label="Save"
								primary={true}
								style={{ marginTop: "1rem", float: "right" }}
								onClick={this.handleSave}
							/>
						)}
					</div>
				</div>
			</div>
			<Dialog
				paperClassName="delete-dialog"
				title="DELETE RULE"
				actions={actions}
				modal={false}
				open={this.props.isOpen === "view-rule-dialog"}
				onRequestClose={this._handleClose}
			>
				Are you sure you want to delete this rule?
			</Dialog>
		</div> 
			:
			<div></div>);
			
	}
}

export default ViewRule;
