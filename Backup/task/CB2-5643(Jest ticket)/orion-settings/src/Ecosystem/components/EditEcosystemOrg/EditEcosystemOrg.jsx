import React, { Fragment, memo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { assignApp, updateOrgSharingConnections } from "./editEcosystemOrgActions";
import { getLastName } from "../../../utility";

// components
import EditPageTemplate from "../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../shared/components/ArticleContainer";
import UserAvatar from "orion-components/UserAvatar";
// material ui
import {
	Divider,
	IconButton,
	List,
	Link,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	Switch
} from "@mui/material";
import { Email, PlusCircle, MinusCircle } from "mdi-material-ui";
import { Translate, getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";

const updateConnections = (upDown, orgId, connections, setConnections, dispatch) => {
	const update = upDown === "down"
		? connections - 1
		: connections + 1;

	setConnections(update);
	dispatch(updateOrgSharingConnections(orgId, update));
};

const handleAppToggle = (ecoApp, orgId, orgApps, dispatch) => {
	// This needs further work
	const app = {
		...ecoApp,
		active: !orgApps.includes(ecoApp.appId)
	};
	dispatch(assignApp(orgId, app));
};
const EditEcosystemOrg = () => {

	const dispatch = useDispatch();
	const { orgId } = useParams();

	const org = useSelector((state) => state.globalData.orgs[orgId]);
	const ecoApps = useSelector((state) => state.globalData.apps);
	const allUsers = useSelector((state) => state.globalData.users);

	const orgApplicationsById = org && org.applications ? org.applications.map(app => app.appId) : [];
	// Get all admins in the ecosystem that aren't disabled and alphabetize
	const users = Object.keys(allUsers);
	const orgAdmins = users
		.map(key => allUsers[key])
		.filter(user => {
			return user.admin === true && user.disabled !== true && user.orgId === orgId;
		})
		.sort((a, b) => {
			if (
				getLastName(a.name.toUpperCase()) > getLastName(b.name.toUpperCase())
			) {
				return 1;
			} else if (
				getLastName(a.name.toUpperCase()) < getLastName(b.name.toUpperCase())
			) {
				return -1;
			} else {
				return 0;
			}
		});
	const dir = useSelector(state => getDir(state));


	const [connections, setConnections] = useState(0);
	useEffect(() => {
		if (org && org.maxSharingConnections) {
			setConnections(org.maxSharingConnections);
		}
	}, [org]);
	const { sharingConnections } = org || { sharingConnections: [] };
	const orgActiveConnections = sharingConnections
		? sharingConnections.filter(conn => {
			return conn.sourceOrg === org.orgId;
		}).length
		: 0;

	const styles = {
		listItemText: {
			flex: "0 0 170px"
		},
		listItem: {
			textAlign: "unset",
			...(dir === "rtl" ? { paddingRight: 5 } : { paddingLeft: 5 }),
			marginBottom: 6,
			marginTop: 18
		},
		iconStyles: {
			backgroundSize: "contain",
			...(dir === "rtl" ? { marginLeft: 24 } : { marginRight: 24 }),
			top: "-10px",
			left: "-4px",
			height: "34px",
			width: "34px"
		},
		emailIcon: {
			color: "white",
			...(dir === "rtl" ? { marginLeft: 5 } : { marginRight: 5 })
		},
		listItemSecondaryAction: {
			...(dir == "rtl" ? { right: "unset", left: 16 } : {})
		}
	};

	const sharingConnectionsSection = (
		<section>
			<p className="b1-white" style={{ paddingLeft: 4, marginBottom: 8 }}><Translate value="mainContent.manageEcosystem.editEcosystem.sharingConn" /></p>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<IconButton
					onClick={() => updateConnections("up", org.orgId, connections, setConnections, dispatch)}
					style={{ marginRight: 3, padding: "4px", color: "white" }}
				>
					<PlusCircle />
				</IconButton>
				<IconButton
					onClick={() => updateConnections("down", org.orgId, connections, setConnections, dispatch)}
					disabled={sharingConnections ? (connections === 0 || connections === sharingConnections.length) : true}
					style={{ marginRight: 18, padding: "4px", color: "white" }}
				>
					<MinusCircle />
				</IconButton>
				<p className="b2-bright-gray" style={{ textAlign: "center", marginRight: "5px" }}>{orgActiveConnections} <Translate value="mainContent.manageEcosystem.editEcosystem.used" /> / {connections || 0} <Translate value="mainContent.manageEcosystem.editEcosystem.total" /></p>
			</div>
		</section>

	);
	const filteredApps = ecoApps.filter(app => app.appId !== "settings-app")
		.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	return (
		org ?
			<EditPageTemplate
				title={getTranslation("mainContent.manageEcosystem.title")}
				subTitle={getTranslation("mainContent.manageEcosystem.editEcosystem.titleText")}
				dir={dir}
			>
				<ArticleContainer
					headerTitle={org.name}
					headerDescription={""}
					editing={true}
					headerOptionalSection={sharingConnectionsSection}
				>
					<Divider style={{ position: "absolute", left: 24, right: 24, top: 120 }} />
					<section style={{ marginTop: 63 }}>
						<h3>
							<Translate value="mainContent.manageEcosystem.editEcosystem.appsTitle" />
						</h3>
						<List style={{ marginBottom: 15 }}>
							{filteredApps.map((app, index) => {
								return (
									<div className="list-item-wrapper" key={app.name}>
										<ListItem
											style={styles.listItem}>
											<ListItemIcon>
												<span
													style={styles.iconStyles}
													className={
														"widget-icon app-icon-" + app.appId.toLowerCase()
													}
												/>
											</ListItemIcon>
											<ListItemText
												primary={app.name}
											/>
											<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
												<Switch
													checked={orgApplicationsById.includes(app.appId)}
													color="primary"
													onChange={() =>
														handleAppToggle(app, org.orgId, orgApplicationsById, dispatch)
													}
												/>
											</ListItemSecondaryAction>
										</ListItem>
										{index !== filteredApps.length - 1 ?
											<Divider style={{ position: "absolute", left: 0, right: 0 }} /> : null
										}
									</div>
								);
							})}
						</List>
					</section>
					<Divider style={{ position: "absolute", left: 24, right: 24 }} />
					<section style={{ marginTop: 63 }}>
						<h3>
							<Translate value="mainContent.manageEcosystem.editEcosystem.orgAdminTitle" />
						</h3>
						<List>
							{orgAdmins.map((admin, index) => {
								return (
									<Fragment key={`members-${index}`}>
										<ListItem style={{ ...styles.listItem, justifyContent: "space-between", marginTop: 6 }}>
											<ListItemAvatar>
												<UserAvatar user={admin} size={36} />
											</ListItemAvatar>
											<ListItemText style={styles.listItemText}>
												{admin.name}
											</ListItemText>
											<ListItemText style={styles.listItemText}>
												{admin.contact.officePhone || admin.contact.cellPhone}
											</ListItemText>
											<div style={{ display: "flex", alignItems: "center" }}>
												<Email style={styles.emailIcon} />
												<Link className="b1-blue" style={{ color: "#4eb5f3" }} href={`mailto:${admin.email}`}>
													<Translate value="mainContent.manageEcosystem.editEcosystem.email" />
												</Link>
											</div>
										</ListItem>
										{
											index !== orgAdmins.length - 1 && (
												<Divider />
											)
										}
									</Fragment>
								);
							})}
						</List>
					</section>
				</ArticleContainer>
			</EditPageTemplate>
			:
			<div></div>
	);
};

export default memo(EditEcosystemOrg);