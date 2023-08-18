import React, { useEffect, useState, Fragment, memo } from "react";
// router
import { Link as RouterLink } from "react-router-dom";
import { routes as r } from "../../routes";

// material-ui
import {
	List,
	ListItem,
	Divider,
	ListItemText
} from "@mui/material";

//components
import UserAvatar from "orion-components/UserAvatar";
import ArticleContainer from "../../shared/components/ArticleContainer";
import { Translate, getTranslation } from "orion-components/i18n";

const formatDate = (date) => {
	const newDate = new Date(date);
	return newDate.getMonth() + 1 + "/" + newDate.getDate() + "/" + newDate.getFullYear();
};
const Profile = ({
	user,
	org,
	isMyUser,
	canEditThisUser,
	dir
}) => {
	const [userProps, setUserProps] = useState([]);
	useEffect(() => {
		if (user && org) {
			setUserProps([
				{
					primary: user.name,
					label: getTranslation("mainContent.accountSettings.profile.name")
				},
				{
					primary: user.email,
					label: getTranslation("mainContent.accountSettings.profile.email")
				},
				{
					primary: user.contact.officePhone,
					label: getTranslation("mainContent.accountSettings.profile.officePhone")
				},
				{
					primary: user.contact.cellPhone,
					label: getTranslation("mainContent.accountSettings.profile.cellPhone")
				},
				{
					primary: org.name,
					label: getTranslation("mainContent.accountSettings.profile.organization")
				},
				{
					primary: org.roles.find(role => role.id === user.roleId) ? org.roles.find(role => role.id === user.roleId).title : "PROBLEM LOADING USER'S ROLE",
					label: getTranslation("mainContent.accountSettings.profile.userRole")
				},
				{
					primary: "***************",
					label: getTranslation("mainContent.accountSettings.profile.password"),
					secondary: user.passwordChangedDate ? getTranslation("mainContent.accountSettings.profile.lastChanged", formatDate(user.passwordChangedDate)) : ""
				}
			]);
		}
	}, [user, org, userProps]);

	const styles = {
		leftText: {
			flex: "0 0 156px",
			alignItems: "center",
			marginRight: 24,
			paddingTop: 4,
			paddingLeft: 24
		},
		middleText: {
			flex: "1 1 328px",
			marginRight: 24
		},
		listItem: {
			paddingTop: 15,
			paddingBottom: 16,
			...(dir === "rtl" ? {
				paddingLeft: 24,
				paddingRight: 0,
				textAlign: "right"
			} : {
				paddingLeft: 0,
				paddingRight: 24
			})
		},
		rightToLeft: {
			...(dir === "rtl" ? {
				paddingTop: 15,
				paddingBottom: 16,
				paddingLeft: 24,
				paddingRight: 0,
				textAlign: "right"
			} : { paddingLeft: 0 })
		},
		editBtn: {
			marginTop: 30,
			...(dir === "rtl" ? { width: 130, paddingLeft: 0, paddingRight: 24 } : { width: 114, paddingLeft: 24, paddingRight: 0 }),
			color: "#4eb5f3",
			paddingLeft: 0,
			paddingRight: 24
		}
	};

	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.accountSettings.profile.title")}
			headerDescription={getTranslation("mainContent.accountSettings.profile.profileText")}
			dir={dir}
		>
			<List>
				<ListItem style={styles.listItem}>
					<ListItemText
						className="b1-white"
						style={styles.leftText}
						primary={getTranslation("mainContent.accountSettings.profile.photo")}
					/>
					<ListItemText
						style={styles.middleText}
						className="b1-white"
						primary={getTranslation("mainContent.accountSettings.profile.photoText")}
					/>
					<UserAvatar size={60} user={user} />
				</ListItem>

				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				{userProps.map((prop, index) => {
					return (
						<Fragment key={`userProfileListItemFragment-${index}`}>
							<ListItem
								key={`userProfileListItem-${index}`}
								style={styles.rightToLeft}
							>
								<ListItemText
									className="b1-white"
									style={styles.leftText}
									primary={prop.label}
								/>
								<ListItemText
									primaryTypographyProps={{
										className: "b1-white"
									}}
									secondaryTypographyProps={{
										className: "b1-light-gray"
									}}
									style={styles.middleText}
									primary={prop.primary}
									secondary={prop.secondary}
								/>
							</ListItem>
							{index !== userProps.length - 1 && (
								<Divider style={{ position: "absolute", left: 24, right: 24 }} />
							)
							}
						</Fragment>
					);
				})}
			</List>
			{canEditThisUser && <Fragment>
				<Divider style={{ position: "absolute", left: 24, right: 24 }} />
				<ListItem button className="b1-blue" component={RouterLink}
					to={isMyUser ? r.EDIT_MY_PROFILE : r.EDIT_USER_BY_ID.replace(":id", user.id)}
					style={styles.editBtn}>
					<Translate value="mainContent.accountSettings.profile.editProfile" />
				</ListItem>
			</Fragment>}
		</ArticleContainer>
	);
};

export default memo(Profile);