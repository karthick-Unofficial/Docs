import React, { Fragment, useEffect, useState, memo } from "react";
//components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
import { SelectField, Dialog } from "orion-components/CBComponents";
// material-ui
import {
	Avatar,
	Button,
	Checkbox,
	Container,
	Divider,
	FormControlLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Switch,
	TextField
} from "@mui/material";
// utilities
import { dynamicSort, getIntegrationIcon } from "../../../../utility";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./manageUserRolesActions";
import { getDir } from "orion-components/i18n/Config/selector";

// const disabledStyles = {
// 	margin: "4px 0",
// 	top: "1px",
// 	height: "60px",
// 	lineHeight: "22px",
// 	opacity: "0.5",
// 	paddingLeft: 0
// };


const checkIfUsersHaveRole = (roleId, users) => {
	return users.some(user => user.roleId === roleId);
};
const handleOrgRoleAppToggle = (orgId, role, roleApps, app, adding, updateRole, updateOrgRoleApps, dispatch) => {
	const newRoleApps = {};
	const updatedRole = { ...role };
	if (adding) {
		// it's possible a key value pair for the application doesn't exist yet so we have to create one
		newRoleApps[app.appId] = {
			appId: app.appId,
			config: {
				canView: true,
				role: "viewer"
			},
			permissions: roleApps[app.appId] && roleApps[app.appId].permissions ? roleApps[app.appId].permissions : []
		};
	} else {
		newRoleApps[app.appId] = {
			...roleApps[app.appId],
			config: {
				canView: false,
				role: "viewer"
			}
		};
	}
	updatedRole.applications = Object.values(newRoleApps);
	updatedRole.integrations = [];
	dispatch(updateRole(updatedRole.id, { ...updatedRole, orgId }));
};

const handlePermissionArrayChange = (permissions, option, removing) => {
	const newPermissionArray = [...permissions];
	if (removing) {
		const index = newPermissionArray.indexOf(option);
		newPermissionArray.splice(index, 1);
	} else {
		newPermissionArray.push(option);
	}
	return newPermissionArray;
};

const handleOrgRoleIntToggle = (orgId, role, roleInts, int, adding, updateRole, updateOrgRoleIntegrations, dispatch) => {
	const newRoleInts = {};
	const updatedRole = { ...role };
	if (adding) {
		// it's possible a key value pair for the integration doesn't exist yet so we have to create one
		newRoleInts[int.feedId] = {
			intId: int.feedId,
			feedOwnerOrg: int.feedOwnerOrg,
			orgIntId: int.id,
			config: {
				canView: true,
				role: "viewer"
			},
			permissions: roleInts[int.feedId] && roleInts[int.feedId].permissions ? roleInts[int.feedId].permissions : []
		};
	} else {
		newRoleInts[int.feedId] = {
			...roleInts[int.feedId],
			config: {
				canView: false,
				role: "viewer"
			}
		};
	}
	updatedRole.integrations = Object.values(newRoleInts);
	updatedRole.applications = [];
	dispatch(updateRole(updatedRole.id, { ...updatedRole, orgId }));
};

const handlePermissionUpdates = (orgId, role, roleAppsIntegrations, appIntId, option, adding, updateRole, int, dispatch) => {
	const newRoleAppsIntegrations = {};
	const newRole = { ...role };
	if (adding) {
		newRoleAppsIntegrations[appIntId] = {
			...roleAppsIntegrations[appIntId],
			permissions: [...(roleAppsIntegrations[appIntId] && roleAppsIntegrations[appIntId].permissions ? roleAppsIntegrations[appIntId].permissions : []), option]
		};
	} else {
		newRoleAppsIntegrations[appIntId] = {
			...roleAppsIntegrations[appIntId],
			permissions: handlePermissionArrayChange((roleAppsIntegrations[appIntId].permissions), option, true)
		};
	}
	newRole[int ? "integrations" : "applications"] = Object.values(newRoleAppsIntegrations);
	newRole[int ? "applications" : "integrations"] = [];
	dispatch(updateRole(newRole.id, { ...newRole, orgId }));
};



const manageRoleSelection = (role, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations, members, updateChangeUserRoleList) => {
	if (role) {
		selectOrgRole(role);
		if (role.applications) {
			updateOrgRoleApps(role.applications.reduce((obj, item) => {
				return {
					...obj,
					[item["appId"]]: item
				};
			}, {}));
		} else {
			updateOrgRoleApps([]);
		}
		if (role.integrations) {
			updateOrgRoleIntegrations(role.integrations.reduce((obj, item) => {
				return {
					...obj,
					[item["intId"]]: item
				};
			}, {}));
		} else {
			updateOrgRoleIntegrations([]);
		}
		if (members) {
			const roleList = {};
			members.forEach(member => {
				roleList[member.id] = { original: member.roleId === role.id ? true : false, value: member.roleId === role.id ? true : false };
			});
			updateChangeUserRoleList(roleList);
		} else {
			updateChangeUserRoleList({});
		}
	}
};
const ManageUserRoles = () => {
	const dispatch = useDispatch();

	const {
		createNewRole,
		deleteRole,
		updateRole,
		openDialog,
		closeDialog,
		updateUserRole
	} = actionCreators;

	const org = useSelector(state => state.globalData.orgs[state.session.user.profile.orgId]);
	const users = useSelector(state => Object.keys(state.globalData.users));
	const orgMembers = useSelector(state => org ? users.map((key) => state.globalData.users[key]).filter((user) => user.orgId === org.orgId) : undefined);
	const members = orgMembers;
	const user = useSelector(state => state.session.user);
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const orgRoles = org ? org.roles : [];
	const orgId = org ? org.orgId : "";
	const dir = useSelector(state => getDir(state));

	const [newRoleDescription, updateNewRoleDescription] = useState("");
	const [searchValue, updateSearchValue] = useState("");
	const [orgRole, selectOrgRole] = useState(null);
	const [orgRoleApps, updateOrgRoleApps] = useState({});
	const [orgRoleIntegrations, updateOrgRoleIntegrations] = useState({});
	const [changeUserRoleList, updateChangeUserRoleList] = useState({});

	useEffect(() => {
		if (user && orgId && !orgRole) {
			const initialRole = orgRoles.length > 0 ? orgRoles.find(role => role.roleId === user.profile.orgRole.roleId) : null;
			manageRoleSelection(initialRole, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations, members, updateChangeUserRoleList);
		}
		if (orgRoles.length && orgRole) {
			const updatedOrgRole = orgRoles.find(updatedRole => updatedRole.id === orgRole.id);
			if (!_.isEqual(updatedOrgRole, orgRole)) {
				manageRoleSelection(updatedOrgRole, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations, members, updateChangeUserRoleList);
			}
		}
	}, [user, orgId, orgRole, orgRoles, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations]);
	const sortedOrgRoles = org ? org.roles.sort(dynamicSort("title")).map(role => {
		return { ...role, name: role.title };
	}) : [];
	const filteredMembers = members ?
		members
			.filter(user => user.name.toLowerCase().includes(searchValue ? searchValue.toLowerCase() : searchValue))
			.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
		: [];

	// Styles for ListItem
	const styles = {
		listItem: {
			margin: "4px 0",
			top: "0px",
			height: "60px",
			lineHeight: "22px",
			...(dir === "rtl" ? { paddingRight: 0 } : { paddingLeft: 0 })
		},
		container: {
			display: "flex",
			justifyContent: "space-between",
			margin: "24px 0px",
			alignItems: "center",
			...(dir === "rtl" ? { paddingRight: 0 } : { paddingLeft: 0 })
		},
		iconStyles: {
			backgroundSize: "contain",
			...(dir === "rtl" ? { marginLeft: 24, } : { marginRight: 24 }),
			top: "-10px",
			left: "-4px",
			height: "34px",
			width: "34px"
		},
		listItemSecondaryAction: {
			...(dir === "rtl" ? { right: "unset", left: 16 } : {})
		},
		membersListItemSecondary: {
			...(dir === "rtl" ? { right: "unset", left: 8 } : { right: -8 })
		},
		inputLabelProps: {
			left: "unset",
			...(dir === "rtl" ? { transformOrigin: "top right" } : { transformOrigin: "top left" })
		},
		alignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	const listStyles = {
		listItemText: {
			flex: "0 0 170px",
			...(dir === "rtl" ? { textAlign: "right" } : {})
		},
		listItemCheckBox: {
			flex: "0 0 170px"
		},
		listItem: {
			...(dir === "rtl" ? { paddingRight: 0, textAlign: "right" } : { paddingLeft: 0 }),
			marginTop: 14,
			marginBottom: 14
		},
		formControlLabel: {
			...(dir === "rtl" ? { marginRight: 0, marginLeft: 16, flex: "0 0 170px", textAlign: "right" } : { flex: "0 0 170px" })
		}
	};

	return org && orgRole ? (
		<Fragment>
			<EditPageTemplate
				title={getTranslation("mainContent.manageOrganization.orgSettings.title")}
				subTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.title")}
				dir={dir}
			>
				<ArticleContainer headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.formTitle")} headerDescription={""} editing={true} >
					<Container style={styles.container}>
						<div style={{ width: "50%" }}>
							<SelectField
								id={"orgRole-selection"}
								label={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.roleLabel")}
								handleChange={(e) => {
									const selectedRole = org.roles.find(orgRole => orgRole.id === e.target.value);
									manageRoleSelection(selectedRole, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations, members, updateChangeUserRoleList);
								}}
								value={orgRole.id}
								items={sortedOrgRoles}
								dir={dir}
							/>
							<div style={{
								display: "flex",
								justifyContent: "space-between"
							}}>
								<Button onClick={() => dispatch(openDialog("applyToUsers"))} disableTouchRipple={true} style={{ paddingLeft: 0, textTransform: "none", backgroundColor: "transparent" }} color="primary">
									<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.applyToUsers" />
								</Button>
								{user.profile.admin && !orgRole.initialRole && (
									<Button onClick={() => dispatch(openDialog("deleteRole"))} disableTouchRipple={true} style={{ paddingRight: 0, textTransform: "none", backgroundColor: "transparent" }} color="primary">
										<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.deleteRole" />
									</Button>
								)}
							</div>
						</div>
						<Button style={{ height: 45 }} onClick={() => dispatch(openDialog("createRole"))} variant="contained" color="primary">
							<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.addnewBtn" />
						</Button>
					</Container>
					{orgRole && <Fragment>
						<section style={{ marginTop: 15 }}>
							<h3>
								<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.appsTitle" />
							</h3>
							<List style={{ marginTop: 15, marginBottom: 15 }}>
								{org.applications
									.sort((a, b) => {
										if (a.name < b.name) return -1;
										if (a.name > b.name) return 1;
										return 0;
									})
									.map((app, index) => {
										const correspondingRoleApp = orgRoleApps[app.appId];
										const appIconSrc = `/_fileDownload?bucketName=app-icons&fileName=app.${app.appId.replace(/-app/g, "")}.png`;
										const permissionOptions = app.permissionOptions.map((option, index) => {
											const includesOption = correspondingRoleApp && correspondingRoleApp.permissions && correspondingRoleApp.permissions.includes(option);
											return (
												<FormControlLabel
													key={`appOptions-${index}`}
													style={listStyles.listItemText}
													control={
														<Checkbox
															checked={includesOption ? true : false}
															disabled={correspondingRoleApp && correspondingRoleApp.config && correspondingRoleApp.config.canView ? false : true}
															color="primary"
															onChange={(e, checked) => {
																updateOrgRoleApps(prevState => {
																	return {
																		...prevState,
																		[app.appId]: {
																			...prevState[app.appId],
																			permissions: handlePermissionArrayChange((prevState[app.appId].permissions), option, !checked)
																		}
																	};
																});
																handlePermissionUpdates(org.orgId, orgRole, orgRoleApps, app.appId, option, checked, updateRole, null, dispatch);
															}}
														/>
													}
													label={option.charAt(0).toUpperCase() + option.slice(1)}
												/>
											);
										});
										return (
											<div className="list-item-wrapper" key={app.name}>
												<ListItem
													style={styles.listItem}>
													<ListItemIcon>
														<span
															style={{ ...styles.iconStyles, ...{ backgroundImage: `url(${appIconSrc})` } }}
															className={"widget-icon"}
														/>
													</ListItemIcon>
													<ListItemText
														style={listStyles.listItemText}
														primary={app.name}
													/>
													{permissionOptions}
													<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
														<Switch
															checked={correspondingRoleApp && correspondingRoleApp.config && correspondingRoleApp.config.canView ? true : false}
															color="primary"
															onChange={(e, checked) => {
																handleOrgRoleAppToggle(org.orgId, orgRole, orgRoleApps, app, checked, updateRole, updateOrgRoleApps, dispatch);
															}
															}
														/>
													</ListItemSecondaryAction>
												</ListItem>
												{index !== org.applications.length - 1 ?
													<Divider style={{ position: "absolute", left: 0, right: -39 }} /> : null
												}
											</div>
										);
									})}
							</List>
						</section>
						<section>
							<h3>
								<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.feedsTitle" />
							</h3>
							<List style={{ marginTop: 15, marginBottom: 15 }}>
								{org.integrations
									.sort((a, b) => {
										if (a.name < b.name) return -1;
										if (a.name > b.name) return 1;
										return 0;
									}).map((int, index) => {
										const icon = getIntegrationIcon(int.feedIcon);
										const correspondingRoleIntegration = orgRoleIntegrations[int.feedId];

										// -- use policy allowedPermissions if a shared feed
										const options = int.feedOwnerOrg !== org.orgId ?
											(int.policy.allowedPermissions ? int.policy.allowedPermissions : []) :
											(int.permissionOptions ? int.permissionOptions : []);

										const permissionOptions = options.map(option => {
											const includesOption = correspondingRoleIntegration && correspondingRoleIntegration.permissions && correspondingRoleIntegration.permissions.includes(option);
											return (
												<FormControlLabel
													key={`intPermissions-${option}`}
													style={listStyles.formControlLabel}
													control={
														<Checkbox
															checked={includesOption ? true : false}
															disabled={correspondingRoleIntegration && correspondingRoleIntegration.config && correspondingRoleIntegration.config.canView ? false : true}
															color="primary"
															onChange={(e, checked) => {
																updateOrgRoleIntegrations(prevState => {
																	return {
																		...prevState,
																		[int.feedId]: {
																			...prevState[int.feedId],
																			permissions: handlePermissionArrayChange((prevState[int.feedId].permissions), option, !checked)
																		}
																	};
																});
																handlePermissionUpdates(org.orgId, orgRole, orgRoleIntegrations, int.feedId, option, checked, updateRole, true, dispatch);
															}}
														/>
													}
													label={option.charAt(0).toUpperCase() + option.slice(1)}
												/>
											);
										});
										return (
											<Fragment key={`${int.feedId}-${index}`}>
												<ListItem
													style={styles.listItem}>
													<ListItemIcon>
														{icon ? icon : <Avatar
															style={{ width: 34, height: 34 }}
															color="white"
														>
															{int.name ? int.name[0] : ""}
														</Avatar>}
													</ListItemIcon>
													<ListItemText
														primary={int.name}
														style={styles.alignRight}
													/>
													{permissionOptions}
													<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
														<Switch
															checked={correspondingRoleIntegration && correspondingRoleIntegration.config && correspondingRoleIntegration.config.canView ? true : false}
															color="primary"
															onChange={(e, checked) => {
																handleOrgRoleIntToggle(org.orgId, orgRole, orgRoleIntegrations, int, checked, updateRole, updateOrgRoleIntegrations, dispatch);
															}}
														/>
													</ListItemSecondaryAction>
												</ListItem>
												{index !== org.integrations.length - 1 ?
													<Divider style={{ position: "absolute", left: 0, right: -39 }} /> : null
												}
											</Fragment>
										);
									})}
							</List>
						</section>
					</Fragment>
					}
				</ArticleContainer>
			</EditPageTemplate>
			<Dialog
				open={dialog === "deleteRole"}
				title={<h3><Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.deleteRole" /></h3>}
				paperPropStyles={{
					backgroundColor: "#41454a",
					padding: 15,
					width: 355,
					height: 250,
					minHeight: 250,
					borderRadius: 0
				}}
				abort={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.cancelBtn"),
					action: () => {
						dispatch(closeDialog("deleteRole"));
					}
				}}
				confirm={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.deleteBtn"),
					disabled: checkIfUsersHaveRole(orgRole.id, members),
					action: () => {
						dispatch(deleteRole(selectOrgRole, updateChangeUserRoleList, orgRole.id, org.orgId));
					}
				}}
			>
				<p className="b1-white">
					<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.confirmText" />:
				</p>
				<p style={{ marginTop: 10, marginBottom: 10 }} className="b1-white">
					{orgRole.title}
				</p>
				<p className="b2-bright-gray">
					<Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.note" />
				</p>
			</Dialog>
			<Dialog
				open={dialog === "createRole"}
				title={<h3><Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.title" /></h3>}
				paperPropStyles={{
					backgroundColor: "#41454a",
					padding: 15,
					width: 355,
					height: 230,
					borderRadius: 0
				}}
				abort={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.cancelBtn"),
					action: () => {
						dispatch(closeDialog("createRole"));
						updateNewRoleDescription("");
					}
				}}
				confirm={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.addBtn"),
					disabled: !newRoleDescription,
					action: () => {
						dispatch(createNewRole({
							orgId,
							"roleId": newRoleDescription.toLowerCase().replace(/\s/g, "_"),
							"title": newRoleDescription
						}, updateNewRoleDescription));
					}
				}}
			>
				<TextField
					variant="standard"
					style={{
						width: "100%"
					}}
					label={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.roleDesc")}
					onChange={(e) => {
						updateNewRoleDescription(e.target.value);
					}}
					value={newRoleDescription}
					autoFocus={true}
					InputLabelProps={{
						style: styles.inputLabelProps
					}}
				/>
			</Dialog>
			<Dialog
				open={dialog === "applyToUsers"}
				title={<h3><Translate value="mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.applyRole" /></h3>}
				paperPropStyles={{
					backgroundColor: "#41454a",
					padding: 15,
					borderRadius: 0,
					width: 455
				}}
				abort={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.cancelBtn"),
					action: () => {
						dispatch(closeDialog("applyToUsers"));
					}
				}}
				confirm={{
					label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.addBtn"),
					disabled: !Object.values(changeUserRoleList).some(obj => obj.original !== obj.value),
					action: () => {
						Object.keys(changeUserRoleList).forEach(userId => {
							if (changeUserRoleList[userId].original !== changeUserRoleList[userId].value)
								dispatch(updateUserRole(userId, changeUserRoleList[userId].value ? orgRole.id : `${org.orgId}_org_user`));
						});
						dispatch(closeDialog("applyToUsers"));
					}
				}}
			>
				<div>
					<SelectField
						formControlProps={{
							style: {
								marginTop: 0
							}
						}}
						id={"orgRole-selection"}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.selectRole")}
						handleChange={(e) => {
							updateChangeUserRoleList({});
							const selectedRole = org.roles.find(orgRole => orgRole.id === e.target.value);
							manageRoleSelection(selectedRole, selectOrgRole, updateOrgRoleApps, updateOrgRoleIntegrations, members, updateChangeUserRoleList);
						}}
						value={orgRole.id}
						items={sortedOrgRoles}
						dir={dir}
					/>
					<TextField
						variant="standard"
						value={searchValue}
						style={{
							width: "100%",
							marginTop: 50,
							marginBottom: 10
						}}
						placeholder={getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.dialog.search")}
						InputProps={{
							disableUnderline: true,
							style: {
								border: "1px solid #8b8d8f",
								padding: 10,
								backgroundColor: "#393d41"
							},
							inputProps: {
								style: {
									height: 0
								}
							}
						}}
						onChange={(e) => {
							updateSearchValue(e.target.value);
						}}
					/>
					<List>
						<Fragment>
							{filteredMembers.map((user, index) => {
								return (
									<Fragment key={`members-${index}`}>
										<ListItem style={listStyles.listItem}>
											<ListItemText style={listStyles.listItemText}>
												{user.name}
											</ListItemText>
											<ListItemSecondaryAction style={styles.membersListItemSecondary}>
												<Switch
													checked={changeUserRoleList[user.id] ? changeUserRoleList[user.id].value : false}
													color="primary"
													onChange={(e, checked) => {
														updateChangeUserRoleList(prevState => {
															return {
																...prevState,
																[user.id]: {
																	...changeUserRoleList[user.id],
																	value: checked
																}
															};
														});
													}}
												/>
											</ListItemSecondaryAction>
										</ListItem>
									</Fragment>
								);
							})}
						</Fragment>
					</List>
				</div>
			</Dialog>
		</Fragment>
	) : (
		<div></div>
	);
};

export default memo(ManageUserRoles);