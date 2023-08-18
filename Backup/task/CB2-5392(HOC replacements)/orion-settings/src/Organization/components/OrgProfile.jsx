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
} from "@material-ui/core";

//components
import ArticleContainer from "../../shared/components/ArticleContainer";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

const styles = {
	leftText: {
		flex: "0 0 156px",
		alignItems: "center",
		marginRight: 24,
		paddingTop: 4
	},
	middleText: {
		flex: "1 1 328px",
		marginRight: 24
	},
	rightToLeft: {
		paddingTop: 15,
		paddingBottom: 16,
		paddingLeft: 40,
		paddingRight: 0,
		textAlign: "right"
	},
	editBtnRTL: {
		marginTop: 30,
		width: 130,
		paddingRight: 24,
		paddingLeft: 0,
		color: "#4eb5f3"
	}
};
const OrgProfile = ({
	isAdmin,
	isMyOrg,
	org,
	dir
}) => {
	const [orgProps, setOrgProps] = useState([]);
	const [orgIcon, setOrgIcon] = useState(
		<div className="org-icon">
			<span>{"O"}</span>
		</div>
	);
	useEffect(() => {
		if (org) {
			setOrgProps([
				{
					primary: org.name,
					label: getTranslation("mainContent.manageOrganization.orgProfile.organization")
				},
				{
					primary: org.description,
					label: getTranslation("mainContent.manageOrganization.orgProfile.description")
				}
			]);
			let orgName = org.name;
			orgName = orgName.startsWith("The ")
				? orgName.slice(4, orgName.length)
				: orgName;
			if (org.profileImage) {
				const imageURL = "/_download?handle=" + org.profileImage;
				setOrgIcon(
					<div
						className="org-icon org-profile-image"
						style={{ backgroundImage: "url(" + imageURL + ")" }}
					>
						<img src={`url(" + ${imageURL} + ")`} alt="profileImage" style={{ visibility: "hidden" }} />
					</div>
				);
			} else {
				setOrgIcon(
					<div className="org-icon">
						<span>{orgName ? orgName[0] : "O"}</span>
					</div>
				);
			}
		}
	}, [org, setOrgProps]);

	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.manageOrganization.orgProfile.title")}
			headerDescription={getTranslation("mainContent.manageOrganization.orgProfile.titleText")}
			dir={dir}
		>
			<List style={{marginLeft: 24}}>
				<ListItem style={dir == "rtl" ? styles.rightToLeft : {
					paddingTop: 15,
					paddingBottom: 16,
					paddingLeft: 0,
					paddingRight: 40
				}}>
					<ListItemText
						style={styles.leftText}
						primary={getTranslation("mainContent.manageOrganization.orgProfile.photo")}
					/>
					<ListItemText
						style={styles.middleText}
						primary={getTranslation("mainContent.manageOrganization.orgProfile.photoText")}
					/>
					{orgIcon}
				</ListItem>
				<Divider style={{ position: "absolute", left: 0, right: 24 }} />
				{orgProps.map((prop, index) => {
					return (
						<Fragment key={`orgProfileListItemFragment-${index}`}>
							<ListItem style={dir == "rtl" ? {textAlign: "right", paddingRight: 0, marginTop: 5, marginBottom: 5} : {paddingLeft: 0, marginTop: 5, marginBottom: 5}} key={`orgProfileListItem-${index}`}>
								<ListItemText
									style={styles.leftText}
									primary={prop.label}
								/>
								<ListItemText
									style={styles.middleText}
									primary={prop.primary}
									secondary={prop.secondary}
								/>
							</ListItem>
							{index !== orgProps.length - 1 ?
								<Divider style={{ position: "absolute", left: 0, right: 24 }}/> : null
							}
						</Fragment>
					);
				})}
				{(isAdmin && isMyOrg) && (
					<Fragment>
						<Divider style={{ position: "absolute", left: 0, right: 24 }} />
						<ListItem className="b1-blue" button component={RouterLink} to={r.EDIT_MY_ORGANIZATION} style={dir == "rtl" ? styles.editBtnRTL : {
							marginTop: 30,
							width: 114,
							paddingRight: 0,
							paddingLeft: 0,
							color: "#4eb5f3"
						}}>
							<Translate value="mainContent.accountSettings.profile.editProfile"/>
						</ListItem>
					</Fragment>
				)}
			</List>
		</ArticleContainer>
	);
};

export default memo(OrgProfile);