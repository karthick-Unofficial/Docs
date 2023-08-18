import React, { Fragment, useState, memo } from "react";
// router
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { routes as r } from "../../../../routes";
// material ui
import {
	Button,
	Checkbox,
	Container,
	Divider,
	FormControlLabel,
	Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText
} from "@mui/material";
//components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
import { SelectField } from "orion-components/CBComponents";
import UserAvatar from "orion-components/UserAvatar";
import NewUserDialog from "./NewUser/NewUserDialog";
// utilities
import { dynamicSort } from "../../../../utility";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./manageUserActions";
import { getDir } from "orion-components/i18n/Config/selector";

const handleRoleSelect = (role, userId, updateUserPermissions, dispatch) => {
	const update = {
		"roleId": role.id,
		"role": role.title
	};

	dispatch(updateUserPermissions(update, userId));
};

const handleAdminToggle = (userId, updateUserPermissions, adminValue, dispatch) => {
	const update = {
		"admin": adminValue
	};

	dispatch(updateUserPermissions(update, userId));
};

const handleActiveToggle = (id, updateUserActive, activeValue, dispatch) => {
	const update = { disabled: activeValue };
	dispatch(updateUserActive(id, update));
};

const ManageUsers = () => {
	const dispatch = useDispatch();

	const {
		createNewUser,
		updateUserActive,
		updateUserPermissions
	} = actionCreators;

	const org = useSelector(state => state.globalData.orgs[state.session.user.profile.orgId]);
	const users = useSelector(state => Object.keys(state.globalData.users));
	const orgMembers = useSelector(state => org ? users.map((key) => state.globalData.users[key]).filter((user) => user.orgId === org.orgId) : undefined);
	const members = orgMembers;
	const user = useSelector(state => state.session.user);
	const dir = useSelector(state => getDir(state));

	const navigate = useNavigate();

	const handleUserClick = (id) => {
		navigate(r.USER_BY_ID.replace(":id", id));
	};

	const [hideDisabled, toggleHideDisabled] = useState(false);
	const [newUserOpen, toggleNewUserCreation] = useState(false);
	const filteredMembers = members ? members.filter(member => {
		return hideDisabled ? !member.disabled : true;
	}) : [];
	const sortedOrgRoles = org ? org.roles.sort(dynamicSort("title")).map(role => {
		return { ...role, name: role.title };
	}) : [];

	const styles = {
		listItemAvatar: {
			cursor: "pointer"
		},
		listItemText: {
			flex: "0 0 165px",
			cursor: "pointer",
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemCheckBox: {
			flex: "0 0 100px"
		},
		listItem: {
			paddingLeft: 0,
			paddingRigh: 0,
			marginTop: 14,
			marginBottom: 14
		},
		addUserContainer: {
			display: "flex",
			justifyContent: "space-between",
			margin: "24px 0px",
			...(dir === "rtl" ? { paddingLeft: 0 } : { paddingRight: 0 }),
		},
		headerDesc: {
			...(dir == "rtl" ? { marginLeft: 6 } : { marginRight: 6 })
		}
	};

	return org ? (
		<EditPageTemplate
			title={getTranslation("mainContent.manageOrganization.orgSettings.title")}
			subTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.titleText")}
			dir={dir}
		>
			<ArticleContainer
				headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.formTitle")}
				headerDescription={
					<div style={{ display: "flex" }}>
						<p style={styles.headerDesc} className="b2-bright-gray"><Translate value="mainContent.manageOrganization.orgSettings.manageUsers.formTitleText" /></p>
						<Link style={{ color: "#4eb5f3" }} component={RouterLink} to={r.MANAGE_USER_ROLES}>
							<Translate value="mainContent.manageOrganization.orgSettings.manageUsers.formTitleLink" />
						</Link>
					</div>
				}
				editing={true}
			>
				<Container style={styles.addUserContainer}>
					<Button variant="contained"
						onClick={() => toggleNewUserCreation(true)}
						style={{ color: "#FFF" }}>
						<Translate value="mainContent.manageOrganization.orgSettings.manageUsers.addUserBtn" />
					</Button>
					<FormControlLabel
						control={
							<Checkbox
								checked={hideDisabled}
								onChange={() => toggleHideDisabled(!hideDisabled)}
								color="primary"
							/>
						}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.hideUsers")}
					/>
				</Container>
				<Divider style={{ position: "absolute", left: 0, right: 0 }} />
				<List>
					{filteredMembers.map((member, index) => {
						return (
							<Fragment key={`members-${index}`}>
								<ListItem style={styles.listItem}>
									<ListItemAvatar style={styles.listItemAvatar} onClick={() => handleUserClick(member.id)}>
										<UserAvatar user={member} size={36} />
									</ListItemAvatar>
									<ListItemText style={styles.listItemText} onClick={() => handleUserClick(member.id)}>
										{member.name}
									</ListItemText>
									<FormControlLabel
										style={styles.listItemCheckBox}
										disabled={member.id === user.profile.id}
										control={
											<Checkbox
												checked={member.admin}
												onChange={() => handleAdminToggle(member.id, updateUserPermissions, !member.admin, dispatch)}
												color="primary"
											/>
										}
										label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.admin")}
									/>
									<FormControlLabel
										style={styles.listItemCheckBox}
										disabled={member.id === user.profile.id}
										control={
											<Checkbox
												checked={!member.disabled}
												onChange={() => handleActiveToggle(member.id, updateUserActive, !member.disabled, dispatch)}
												color="primary"
											/>
										}
										label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.active")}
									/>
									<SelectField
										id={`${member.id}-role-selection`}
										label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.userRoleLabel")}
										handleChange={(e) => {
											const role = org.roles.find(orgRole => orgRole.id === e.target.value);
											handleRoleSelect(role, member.id, updateUserPermissions, dispatch);
										}}
										value={member.roleId}
										items={sortedOrgRoles}
										dir={dir}
									/>
								</ListItem>
								{index !== filteredMembers.length - 1 && (
									<Divider style={{ width: 639 }} />
								)}
							</Fragment>
						);
					})}
				</List>
				<NewUserDialog
					open={newUserOpen}
					orgRoles={sortedOrgRoles}
					abortAction={() => toggleNewUserCreation(!newUserOpen)}
					confirmAction={() => toggleNewUserCreation(!newUserOpen)}
					orgId={org.orgId}
					onSubmit={createNewUser}
					dir={dir}
					dispatch={dispatch}
				/>
			</ArticleContainer>
		</EditPageTemplate>
	) : (
		null
	);
};

export default memo(ManageUsers);