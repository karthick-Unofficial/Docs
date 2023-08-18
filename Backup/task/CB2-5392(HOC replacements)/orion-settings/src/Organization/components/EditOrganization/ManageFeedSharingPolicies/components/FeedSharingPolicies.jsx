import React, { Fragment, memo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { savePolicies } from "./feedSharingPoliciesActions";

// components
import { DatePicker } from "orion-components/CBComponents";
import EditPageTemplate from "../../../../../shared/components/EditPageTemplate";
// material ui
import {
	Avatar,
	Button,
	Checkbox,
	Container,
	Divider,
	FormControl,
	FormControlLabel,
	List,
	ListItem,
	ListItemText,
	Radio,
	RadioGroup,
	useMediaQuery
} from "@material-ui/core";
// utility
import { getIntegrationIcon } from "../../../../../utility/index.js";
import moment from "moment";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const FeedSharingPolicies = ({
	dir
}) => {

	const location = useLocation();
	const dispatch = useDispatch();

	const [selected, setSelected] = useState(-1);
	const [errorState, updateErrorState] = useState({});
	const [newPolicies, updateNewPolicies] = useState({});

	// ***** From container class
	const params = location.pathname.split("/");
	const feedId = params[params.length - 1];
	const userOrgId = useSelector((state) => state.session.user.profile.orgId);
	const locale = useSelector((state) => state.i18n.locale);
	const org = useSelector((state) => state.globalData.orgs[userOrgId]);
	const chosenIntegration = org.integrations.find(int => int.feedId === feedId);
	const sharingTokensEnabled = useSelector((state) => state.appState.sharingTokens.enabled);
	const orgs = useSelector((state) => state.globalData.orgs);
	const policies = {};
	let ecosystem = [];
	if (chosenIntegration) {

		const intId = chosenIntegration.feedId;
		const intOwnerOrg = chosenIntegration.feedOwnerOrg;
		let orgIds = Object.keys(orgs);

		// If sharing tokens are in use, filter only orgs that you have an active token with
		if (sharingTokensEnabled) {
			const orgSharingConnections = orgs[userOrgId].sharingConnections;
			const sharedWithOrgs = orgSharingConnections
				.filter((conn) => {
					return conn.sourceOrg === userOrgId;
				})
				.map((conn) => {
					return conn.targetOrg;
				});
			orgIds = orgIds.filter(id => sharedWithOrgs.includes(id));
		}
		ecosystem = orgIds
			.filter((orgId) => orgId !== userOrgId && !orgs[orgId].disabled)
			.map((orgId) => orgs[orgId]);
		ecosystem.forEach((org) => {
			const integration = org.integrations.find((int) => {
				// handle case where org integration is from a remote
				// strip @@targetEcoId so can match to feed
				const feedId = int.feedId.includes("@@") ? int.feedId.split("@@")[0] : int.feedId;
				return feedId === intId && int.feedOwnerOrg === intOwnerOrg;
			});
			if (!integration) {
				return;
			}
			policies[org.orgId] = integration.policy || { enabled: false };
		});
	}
	// ***** End from container

	useEffect(() => {
		if (chosenIntegration && ecosystem && policies) {
			const endOfYear = moment();
			endOfYear.set({ "month": 11, "day": 31 });

			let items = {};
			ecosystem.forEach(org => {
				const policy = policies[org.orgId];
				if (!policy) {
					items = Object.assign({}, items, {
						[org.orgId]: {
							enabled: false,
							type: "never-shared",
							alwaysShared: {
								unlimited: true,
								startDate: moment(),
								endDate: endOfYear
							},
							eventSharingOnly: {
								unlimited: true,
								startDate: moment(),
								endDate: endOfYear
							},
							allowedPermissions: []
						}
					});
				} else {
					items = Object.assign({}, items, {
						[org.orgId]: {
							enabled: true,
							type: policy.type,
							alwaysShared: {
								unlimited: !policy.term,
								startDate: policy.term
									? moment(policy.term.start)
									: moment(),
								endDate: policy.term ? moment(policy.term.end) : moment()
							},
							eventSharingOnly: {
								unlimited: !policy.term,
								startDate: policy.term
									? moment(policy.term.start)
									: moment(),
								endDate: policy.term ? moment(policy.term.end) : moment()
							},
							allowedPermissions: policy.allowedPermissions
						}
					});
				}
			});
			updateNewPolicies(items);
		}
	}, [chosenIntegration]);

	const styles = {
		listItemText: {
			flex: "0 0 170px"
		},
		listItemCheckBox: {
			flex: "0 0 170px"
		},
		listItem: {
			paddingLeft: 0,
			marginBottom: 12,
			marginTop: 12
		},
		listItemExpanded: {
			flexDirection: "column",
			alignItems: "flex-start",
			backgroundColor: "#323539",
			padding: "20px 40px",
			marginLeft: "-40px",
			marginRight: "-40px",
			width: "calc(100% + 80px)"
		},
		listItemRTL: {
			paddingRight: 0,
			marginBottom: 12,
			marginTop: 12,
			textAlign: "right"
		},
		listItemExpandedRTL: {
			flexDirection: "column",
			alignItems: "flex-start",
			backgroundColor: "#323539",
			padding: "20px 40px",
			marginLeft: "-40px",
			marginRight: "-40px",
			width: "calc(100% + 80px)",
			textAlign: "right"
		}
	};

	const handlePolicyUpdate = (selectedIntegration, orgId, policies) => e => {
		policies[orgId].type = e.target.value;
		policies[orgId].enabled = policies[orgId].type === "never-shared" ? false : true;
		dispatch(savePolicies(
			selectedIntegration.feedId,
			policies
		));
	};

	const handleCheckUnlimited = (orgId, feedId, newPolicies) => {
		newPolicies[orgId].type === "always" ? newPolicies[orgId].alwaysShared.unlimited = !newPolicies[orgId].alwaysShared.unlimited
			: newPolicies[orgId].eventSharingOnly.unlimited = !newPolicies[orgId].eventSharingOnly.unlimited;
		dispatch(savePolicies(
			feedId,
			newPolicies
		));
	};

	const handleAllowedPermissionsUpdate = (permission, checked, orgId, feedId, newPolicies) => {
		if (!newPolicies[orgId].allowedPermissions) newPolicies[orgId].allowedPermissions = [];
		const permissionIndex = newPolicies[orgId].allowedPermissions.indexOf(permission);
		if (checked) {
			if (permissionIndex === -1) newPolicies[orgId].allowedPermissions.push(permission);
		}
		else {
			if (permissionIndex > -1) newPolicies[orgId].allowedPermissions.splice(permissionIndex, 1);
		}

		dispatch(savePolicies(
			feedId,
			newPolicies
		));
	};

	const handleDeactivateAll = (selectedIntegration, policies) => {
		const newPolicies = { ...policies };
		Object.values(newPolicies).forEach(policy => {
			policy.type = "never-shared";
			policy.enabled = false;
		});
		dispatch(savePolicies(
			selectedIntegration.feedId,
			policies
		));
	};

	const handleStartDateChange = (date, orgId, feedId, policies, updateNewPolicies, updateErrorState) => {
		if (policies[orgId].type === "always" ? policies[orgId].alwaysShared.endDate : policies[orgId].eventSharingOnly.endDate) {
			const endDate = policies[orgId].type === "always" ? policies[orgId].alwaysShared.endDate : policies[orgId].eventSharingOnly.endDate;
			if (endDate.isBefore(date)) {
				updateErrorState({
					startDatePickerError: <Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.startDatePickerError" />,
					endDatePickerError: ""
				});
				updateNewPolicies({
					...policies,
					[orgId]: {
						...policies[orgId],
						[policies[orgId].type === "always" ? "alwaysShared" : "eventSharingOnly"]: {
							...policies[orgId][policies[orgId].type === "always" ? "alwaysShared" : "eventSharingOnly"],
							startDate: date
						}
					}
				});
				return;
			}
		}
		policies[orgId].type === "always" ? policies[orgId].alwaysShared.startDate = date : policies[orgId].eventSharingOnly.startDate = date;
		updateErrorState({
			startDatePickerError: "",
			endDatePickerError: ""
		});
		dispatch(savePolicies(
			feedId,
			policies
		));
	};

	const handleEndDateChange = (date, orgId, feedId, policies, updateNewPolicies, updateErrorState) => {
		//we want the end date's hours to be the end of the day not the beginning
		date.endOf("day");
		if (policies[orgId].type === "always" ? policies[orgId].alwaysShared.startDate : policies[orgId].eventSharingOnly.startDate) {
			const startDate = policies[orgId].type === "always" ? policies[orgId].alwaysShared.startDate : policies[orgId].eventSharingOnly.startDate;
			if (startDate.isAfter(date)) {
				updateErrorState({
					startDatePickerError: "",
					endDatePickerError: <Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.endDatePickerError" />
				});
				updateNewPolicies({
					...policies,
					[orgId]: {
						...policies[orgId],
						[policies[orgId].type === "always" ? "alwaysShared" : "eventSharingOnly"]: {
							...policies[orgId][policies[orgId].type === "always" ? "alwaysShared" : "eventSharingOnly"],
							endDate: date
						}
					}
				});
				return;
			}
		}
		policies[orgId].type === "always" ? policies[orgId].alwaysShared.endDate = date : policies[orgId].eventSharingOnly.endDate = date;
		updateErrorState({
			startDatePickerError: "",
			endDatePickerError: ""
		});
		dispatch(savePolicies(
			feedId,
			policies
		));

	};

	// These aren't hooks but eslint is too stupid to know that
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const matchesLarge = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const matchesSmall = useMediaQuery("(min-width:600px)");
	const icon = getIntegrationIcon(chosenIntegration.feedIcon);
	return (
		<EditPageTemplate
			title={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.title" />}
			subTitle={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.titleText" />}
			dir={dir}
		>
			<Container style={{
				position: "relative",
				marginTop: 8,
				...(matchesSmall ? {
					marginTop: 16
				} : {}),
				...(matchesLarge ? {
					flexBasis: "100%",
					flexGrow: 1,
					flexShrink: 1,
					marginLeft: "auto",
					marginRight: "auto",
					marginTop: 24,
					minWidth: 0
				} : {}),
				padding: 40,
				borderRadius: 8,
				width: "100%",
				backgroundColor: "#41454a",
				...({
					maxWidth: 680
				})
			}}>
				<header style={{ marginBottom: 24 }}>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<div>
							<div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
								{icon ? icon : <Avatar
									style={{ width: 36, height: 36 }}
									color="white"
								>
									{chosenIntegration.name ? chosenIntegration.name[0] : ""}
								</Avatar>}
								<h3 style={dir == "rtl" ? { marginRight: 18 } : { marginLeft: 18 }}>
									{chosenIntegration.name}
								</h3>
							</div>
							<div className="b2-bright-gray">
								<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.titleDesc" />
							</div>
						</div>
						<Button style={{ textTransform: "none", fontSize: 12, color: "#4eb5f3" }}
							onClick={() => handleDeactivateAll(chosenIntegration, newPolicies)}
						>
							<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.deactivate" />
						</Button>
					</div>
				</header>
				<Divider style={{ position: "absolute", left: 0, right: 0 }} />
				<List style={{ paddingTop: 1 }}>
					{ecosystem
						.sort((a, b) => {
							if (a.name < b.name) return -1;
							if (a.name > b.name) return 1;
							return 0;
						})
						.map((org, index) => {
							return (
								<Fragment key={index}>
									<ListItem button={selected !== index ? true : false} onClick={selected !== index ? () => setSelected(index) : null}
										style={selected === index ?
											(dir == "rtl" ? { ...styles.listItemExpandedRTL, ...(index !== 0 ? { marginTop: 13 } : {}) } : { ...styles.listItemExpanded, ...(index !== 0 ? { marginTop: 13 } : {}) })
											: (dir == "rtl" ? { ...styles.listItemRTL, ...(index !== 0 ? { marginTop: 24 } : {}) } : { ...styles.listItem, ...(index !== 0 ? { marginTop: 24 } : {}) })}
									>
										<ListItemText
											primaryTypographyProps={{
												style: {
													fontSize: 18
												}
											}}
											primary={org.name}
										/>
										{selected !== index ? (
											<Fragment>
												{
													newPolicies[org.orgId] && (
														<ListItemText
															primaryTypographyProps={{
																style: {
																	fontFamily: "roboto",
																	fontSize: 12,
																	color: "#b5b9be"
																}
															}}
															primary={newPolicies[org.orgId].type === "always" ?
																<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.alwaysHaveAccess" />
																:
																newPolicies[org.orgId].type === "never-shared" ?
																	""
																	:
																	<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.policies.onlyWhenAdded" />}
														/>
													)
												}
											</Fragment>
										) : (
											<Fragment>
												<div style={dir === "rtl" ? {
													backgroundColor: "#41454a",
													padding: 20,
													width: "100%",
													marginTop: 8,
													width: "100%"
												} : {
													backgroundColor: "#41454a",
													padding: 20,
													width: "100%",
													marginTop: 8
												}}>
													<FormControl component="fieldset" style={dir == "rtl" ? { flexDirection: "row-reverse" } : {}}>
														<RadioGroup
															aria-label="Alert Audio"
															name="alertAudio"
															value={newPolicies[org.orgId] ? newPolicies[org.orgId].type || "never-shared" : "never-shared"}
															style={{ flexDirection: "row" }}
															onChange={handlePolicyUpdate(chosenIntegration, org.orgId, newPolicies)}
														>
															<FormControlLabel
																style={dir == "rtl" ? {
																	marginLeft: 50
																} : {
																	marginRight: 50
																}}
																control={
																	<Radio value="never-shared" color="primary" />
																}
																label={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.never" />}
															/>
															<FormControlLabel
																style={dir == "rtl" ? {
																	marginLeft: 50
																} : {
																	marginRight: 50
																}}
																control={
																	<Radio value="always" color="primary" />
																}
																label={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.always" />}
															/>
															<FormControlLabel
																style={dir == "rtl" ? {
																	marginLeft: 50
																} : {
																	marginRight: 50
																}}
																control={
																	<Radio value="event" color="primary" />
																}
																label={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.event" />}
															/>
														</RadioGroup>
													</FormControl>
													{newPolicies[org.orgId] && newPolicies[org.orgId].type !== "never-shared" && (
														<Fragment>
															<div style={dir == "rtl" ? { marginTop: 35, textAlign: "right" } : { marginTop: 35 }} className="cb-font-b2"><Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.policyTerm" /></div>
															<div style={{ display: "flex", alignItems: "baseline" }}>
																<div style={dir == "rtl" ? { marginLeft: 45 } : { marginRight: 45 }}>
																	<FormControlLabel
																		control={
																			<Checkbox
																				color="primary"
																				onChange={() => handleCheckUnlimited(org.orgId, chosenIntegration.feedId, newPolicies)}
																				checked={
																					newPolicies[org.orgId].type === "always" ?
																						newPolicies[org.orgId].alwaysShared.unlimited
																						:
																						newPolicies[org.orgId].eventSharingOnly.unlimited
																				}
																			/>
																		}
																		label={<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.unlimited" />}
																		style={dir == "rtl" ? { marginRight: -11, marginLeft: 16 } : {}}
																	/>
																</div>
																<div style={{ display: "flex", alignItems: "baseline" }}>
																	<DatePicker
																		className="cb-font-b6"
																		fullWidth={false}
																		handleChange={(date) => {
																			handleStartDateChange(date, org.orgId, chosenIntegration.feedId, newPolicies, updateNewPolicies, updateErrorState);
																		}}
																		options={{
																			error: errorState.startDatePickerError ? true : false,
																			helperText: errorState.startDatePickerError
																		}}
																		InputProps={{
																			disableUnderline: true,
																			style: dir == "rtl" ? {
																				border: "1px solid #8b8d8f",
																				backgroundColor: "#393d41",
																				paddingRight: 10
																			} : {
																				border: "1px solid #8b8d8f",
																				backgroundColor: "#393d41",
																				paddingLeft: 10
																			},
																			inputProps: {
																				style: {
																					height: 15,
																					width: 135
																				}
																			}
																		}}
																		value={
																			newPolicies[org.orgId].type === "always" ?
																				newPolicies[org.orgId].alwaysShared.startDate :
																				newPolicies[org.orgId].eventSharingOnly.startDate
																		}
																		disabled={
																			newPolicies[org.orgId].type === "always" ?
																				newPolicies[org.orgId].alwaysShared.unlimited
																				:
																				newPolicies[org.orgId].eventSharingOnly.unlimited
																		}
																		locale={locale}
																	/>
																	<p
																		className="cb-font-b2"
																		style={{ display: "inline-block", marginRight: 15, marginLeft: 15 }}
																	>
																		<Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.to" />
																	</p>
																	<DatePicker
																		className="cb-font-b6"
																		fullWidth={false}
																		handleChange={(date) => {
																			handleEndDateChange(date, org.orgId, chosenIntegration.feedId, newPolicies, updateNewPolicies, updateErrorState);
																		}}
																		options={{
																			error: errorState.endDatePickerError ? true : false,
																			helperText: errorState.endDatePickerError
																		}}
																		InputProps={{
																			disableUnderline: true,

																			style: dir == "rtl" ? {
																				border: "1px solid #8b8d8f",
																				backgroundColor: "#393d41",
																				paddingRight: 10
																			} : {
																				border: "1px solid #8b8d8f",
																				backgroundColor: "#393d41",
																				paddingLeft: 10
																			},
																			inputProps: {
																				style: {
																					height: 15,
																					width: 135
																				}
																			}
																		}}
																		value={
																			newPolicies[org.orgId].type === "always" ?
																				newPolicies[org.orgId].alwaysShared.endDate :
																				newPolicies[org.orgId].eventSharingOnly.endDate
																		}
																		disabled={
																			newPolicies[org.orgId].type === "always" ?
																				newPolicies[org.orgId].alwaysShared.unlimited
																				:
																				newPolicies[org.orgId].eventSharingOnly.unlimited
																		}
																		locale={locale}
																	/>
																</div>
															</div>
															{(org._ecosystem ? chosenIntegration.externalEcoPermissionOptions : chosenIntegration.permissionOptions)
																&& (org._ecosystem ? chosenIntegration.externalEcoPermissionOptions : chosenIntegration.permissionOptions).length > 0 && (
																<Fragment>
																	<div style={dir == "rtl" ? { marginTop: 35, textAlign: "right" } : { marginTop: 35 }} className="cb-font-b2"><Translate value="mainContent.manageOrganization.orgSettings.manageFeedSharing.radioLabel.allowedPerm" /></div>
																	<div style={{ display: "flex", alignItems: "baseline" }}>
																		{(org._ecosystem ? chosenIntegration.externalEcoPermissionOptions : chosenIntegration.permissionOptions).map(permission => {
																			const includePermission = newPolicies[org.orgId].allowedPermissions && newPolicies[org.orgId].allowedPermissions.includes(permission);
																			return (
																				<FormControlLabel
																					key={`sharedIntPermissions-${permission}`}
																					style={{ flex: "0 0 170px" }}
																					control={
																						<Checkbox
																							checked={includePermission}
																							color="primary"
																							onChange={(e, checked) => {
																								handleAllowedPermissionsUpdate(permission, checked, org.orgId, chosenIntegration.feedId, newPolicies);
																							}}
																						/>
																					}
																					label={permission.charAt(0).toUpperCase() + permission.slice(1) == "Manage" ? getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.manage") : permission.charAt(0).toUpperCase() + permission.slice(1)}
																				/>
																			);
																		})}
																	</div>
																</Fragment>
															)}
														</Fragment>
													)
													}

												</div>
											</Fragment>
										)}
									</ListItem>
									{
										index !== ecosystem.length - 1 ?
											<Divider style={{ position: "absolute", left: -40, right: -40 }} /> : null
									}
								</Fragment>
							);
						})
					}
				</List>
			</Container>
		</EditPageTemplate>
	);
};

export default memo(FeedSharingPolicies);