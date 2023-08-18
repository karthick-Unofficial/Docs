import React, { Fragment, useState, useEffect, useRef } from "react";
import sortBy from "lodash/sortBy";
import { Link } from "react-router-dom";

// Material UI
import { Dialog, DialogTitle, DialogActions, Button, IconButton, Checkbox } from "@mui/material";
import { useStyles } from "../shared/styles/overrides";

import { ArrowBack, ArrowForward } from "@mui/icons-material";


import ruleStatementBuilder from "orion-components/rule-builder";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./viewRuleActions";
import { getDir } from "orion-components/i18n/Config/selector";

const ViewRule = ({ navigate, params }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { removeContext, deleteRule, updateRule, addContext, openDialog, closeDialog } = actionCreators;

	const rules = useSelector(state => Object.keys(state.globalData.rules).map((key) => state.globalData.rules[key]
	));

	const collections = useSelector(state => Object.keys(state.globalData.collections).map((key) => state.globalData.collections[key]
	));
	const user = useSelector(state => state.session.user);
	const canManage = user.profile.applications
		&& user.profile.applications.find(app => app.appId === "rules-app")
		&& user.profile.applications.find(app => app.appId === "rules-app").permissions
		&& user.profile.applications.find(app => app.appId === "rules-app").permissions.includes("manage");
	const userId = useSelector(state => state.session.user.profile.id);
	const orgUsers = useSelector(state => state.globalData.org.orgUsers);
	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));


	const props = { navigate, orgUsers, userId, user, canManage, timeFormatPreference, WavCamOpen, dir, collections, isOpen, params, rules, removeContext, deleteRule, updateRule, addContext, openDialog, closeDialog };
	const [open, setOpen] = useState(false);
	const [edited, setEdited] = useState(false);
	const [rule, setRule] = useState({});
	const [myAssignments, setMyAssignments] = useState([]);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevRule = usePrevious(rule);
	useEffect(() => {
		const ruleId = params.id;
		const filteredRule = rules.filter(item => {
			if (item.id === ruleId) {
				return JSON.parse(JSON.stringify(rule));
			}
		})[0];
		if (filteredRule && prevRule && (!prevRule.id || prevRule.id !== filteredRule.id)) {
			dispatch(addContext(filteredRule));
			setRule(filteredRule);
			setMyAssignments(filteredRule.assignments[user.id]);
		}
	}, [props]);

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

	const _handleClose = () => {
		dispatch(removeContext(rule.id));
		dispatch(closeDialog("view-rule-dialog"));
	};

	const handleOpen = () => {
		dispatch(openDialog("view-rule-dialog"));
	};

	const _deleteAndHome = id => {
		dispatch(deleteRule(id));
		dispatch(closeDialog("view-rule-dialog"));
		navigate("/");
	};

	const backToHome = () => {
		dispatch(removeContext(rule.id));
		navigate("/");
	};

	// User can choose alerts they receive for individual rules
	const toggleMyAssignment = alertType => {
		const assignments = { ...myAssignments };
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
		setMyAssignments(assignments);
		setEdited(true);
	};

	const handleSave = () => {
		const myUser = user;
		const assignments = rule.assignments;
		assignments[myUser.id] = myAssignments;

		dispatch(updateRule(
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
		));
		setEdited(false);
	};

	const actions = [
		<Button
			className="themedButton"
			variant="text"
			onClick={_handleClose}
		>
			{getTranslation("viewRule.actions.flatButtonLabel.cancel")}
		</Button >,
		<Button
			className="themedButton"
			variant="text"
			onClick={() => _deleteAndHome(rule.id)}
			style={{
				color: "#E85858"
			}}
		>
			{getTranslation("viewRule.actions.flatButtonLabel.yesDelete")}
		</Button>
	];

	const author = orgUsers.filter(user => {
		return user.id === rule.owner;
	});

	const assignees = rule.assignments ? Object.values(rule.assignments) : [];
	let sharedUsers = assignees.filter(user => {
		return user.shared === true;
	});

	sharedUsers = sortBy(sharedUsers, user => {
		return user.id === userId ? 0 : 1;
	});

	const myUser = user;
	const owner = myUser.profile.id === rule.owner;
	rule.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";

	let alertAudio = getTranslation("viewRule.alertAudio.speak");
	if (rule.audioSettings) {
		if (rule.audioSettings.speakAlertText && rule.audioSettings.speakAlertNotification)
			alertAudio += "\"" + rule.audioSettings.alertText + "\", " + getTranslation("viewRule.alertAudio.followedBy") + "";
		else if (rule.audioSettings.speakAlertText && !rule.audioSettings.speakAlertNotification)
			alertAudio += "\"" + rule.audioSettings.alertText + "\".";
		else if (!rule.audioSettings.speakAlertText && rule.audioSettings.speakAlertNotification)
			alertAudio = getTranslation("viewRule.alertAudio.speakAlert");
	} else {
		alertAudio += "\"" + getTranslation("viewRule.alertAudio.Alert") + ", " + getTranslation("viewRule.alertAudio.speakAlert") + "";
	}

	const dismissText = rule.dismissForOrg ? getTranslation("viewRule.dismissText.dismissAlertsOrg")
		: getTranslation("viewRule.dismissText.dismissAlertsUser");

	const styles = {
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
		iconButton: {
			...(dir == "rtl" && { left: "unset", right: "0.5rem", background: "none" }),
			...(dir === "ltr" && { background: "none" })
		},
		tableHeader: {
			...(dir == "rtl" && { textAlign: "right", padding: "0 6px 0 0" })
		},
		textAlignRight: {
			...(dir == "rtl" && { textAlign: "right" })
		},
		checkbox: {
			...(dir == "rtl" && { marginRight: 0, marginLeft: 16 })
		}
	};


	return (rule.id ? <div className="rules-wrapper" style={{ overflowY: "scroll", height: `calc(100vh - ${WavCamOpen ? "308px" : "48px"})` }}>
		<IconButton className="back-arrow" onClick={backToHome} style={styles.iconButton}>
			{dir == "rtl" ? <ArrowForward /> : <ArrowBack />}
		</IconButton>
		<div className="row">
			<div className="row-item fullwidth">
				<div className="viewTitling">
					<h1>{rule.title}</h1>
					<span className="author"><Translate value="viewRule.viewTitling.createdBy" count={author[0] ? author[0].name : ""} /></span>
					<h3 className="inline-rule-statement">
						{rule.desc || rule.statement ||
							ruleStatementBuilder(
								rule,
								collections,
								() => { },
								false
							)}
					</h3>
				</div>
			</div>
			<div className="row-item">
				<div className={`rule-operations ${dir == "rtl" ? "rule-operationsRTL" : ""}`}>
					<ul>
						{(canManage || owner) && (
							<Fragment>
								<li>
									<Link to={`/edit/${rule.id}`}>
										<i className="material-icons">edit</i>
										<span><Translate value="viewRule.ruleOperations.edit" /></span>
									</Link>
								</li>
								<li>
									<button onClick={handleOpen}>
										<i className="material-icons delete-rule-button">
											delete
										</i>
										<span><Translate value="viewRule.ruleOperations.delete" /></span>
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
				<div className="rule-states" style={styles.textAlignRight}>
					<span><Translate value="viewRule.ruleStates.theRuleStates" /></span>
					<h2>
						"
						{rule.statement ||
							ruleStatementBuilder(
								rule,
								collections,
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
					<h1><Translate value="viewRule.alertTable.alertAudio" /></h1>
					<h3>{alertAudio}</h3>
				</div>
			</div>
		</div>

		<div className="row">
			<div className="row-item fullwidth">
				<div className="view-rule-attribute">
					<h1><Translate value="viewRule.alertTable.alertDismissRule" /></h1>
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
									<th style={styles.tableHeader}>
										<span className="gets-alerts"><Translate value="viewRule.alertTable.thead.whoGetsAlerts" /></span>
									</th>
									<th className="priority">
										<span className="break-icon priority">
											<i className="material-icons priority">error</i>
										</span>
										<Translate value="viewRule.alertTable.thead.priority" />
									</th>
									<th>
										<span className="break-icon">
											<i className="material-icons">laptop</i>
										</span>
										<Translate value="viewRule.alertTable.thead.system" />
									</th>
									<th>
										<span className="break-icon">
											<i className="material-icons">email</i>
										</span>
										<Translate value="viewRule.alertTable.thead.emails" />
									</th>
									{/* FIXME: Disabling until push notifications are resolved <th><span className="break-icon"><i className="material-icons">phone_iphone</i></span>Push</th> */}
								</tr>
							)}
						</thead>
						<tbody>
							{sharedUsers.length === 0 && (
								<div className="unshared-rule-message" style={styles.textAlignRight}>
									<span className="gets-alerts"><Translate value="viewRule.alertTable.tbody.unsharedRuleMessage.whoGetsAlerts" /></span>
									<p>
										<Translate value="viewRule.alertTable.tbody.unsharedRuleMessage.rule" />
									</p>
								</div>
							)}
							{sharedUsers.map(user => {
								if (user.id === myUser.id) {
									return (
										<tr key={user.id}>
											<td style={styles.tableHeader}>{user.user}</td>
											<td>
												<Checkbox
													checked={myAssignments["isPriority"]}
													onClick={() =>
														toggleMyAssignment("isPriority")
													}
													style={{
														width: "auto"
													}}
													iconStyle={styles.checkbox}
												/>
											</td>
											<td>
												<Checkbox
													checked={myAssignments["notifySystem"]}
													onClick={() =>
														toggleMyAssignment("notifySystem")
													}
													style={{
														width: "auto"
													}}
													disabled={myAssignments["isPriority"]}
													iconStyle={styles.checkbox}
												/>
											</td>
											<td>
												<Checkbox
													checked={myAssignments["notifyEmail"]}
													onClick={() =>
														toggleMyAssignment("notifyEmail")
													}
													style={{
														width: "auto"
													}}
													iconStyle={styles.checkbox}
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
													className={`alert-toggle priority-toggle ${user.isPriority ? "checked" : "unchecked"
														}`}
												/>
											</td>
											<td>
												<div
													className={`alert-toggle ${user.notifySystem ? "checked" : "unchecked"
														}`}
												/>
											</td>
											<td>
												<div
													className={`alert-toggle ${user.notifyEmail ? "checked" : "unchecked"
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
					{edited && (
						<Button
							style={{ marginTop: "1rem", float: "right" }}
							onClick={handleSave}
						>
							{getTranslation("viewRule.alertTable.raisedButton.save")}
						</Button>
					)}
				</div>
			</div>
		</div>
		<Dialog
			PaperProps={{ className: "delete-dialog", sx: styles.paperProps }}
			open={isOpen === "view-rule-dialog"}
			onClose={_handleClose}
			classes={{ scrollPaper: classes.mainScrollPaper }}
		>
			<DialogTitle
				sx={styles.dialogTitle}
			>
				{getTranslation("viewRule.dialog.title")}
			</DialogTitle>
			<span style={styles.dialogContent}>
				<Translate value="viewRule.dialog.content" />
			</span>
			<DialogActions>{actions}</DialogActions>
		</Dialog>
	</div>
		:
		<div></div>);

};

export default ViewRule;
