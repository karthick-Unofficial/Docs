import React, { memo, useState, useEffect } from "react";

import { List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, CircularProgress, Divider, Switch } from "@material-ui/core";

import ErrorIcon from "../../../shared/components/ErrorIcon";

import ArticleContainer from "../../../shared/components/ArticleContainer";

import { getSafely } from "../../../utility";
import {getTranslation} from "orion-components/i18n/I18nContainer";

// Styles for ListItem
const styles = {
	margin: "4px 0",
	top: "0px",
	height: "60px",
	lineHeight: "22px",
	paddingLeft: 0
};

const disabledStyles = {
	margin: "4px 0",
	top: "1px",
	height: "60px",
	lineHeight: "22px",
	opacity: "0.5",
	paddingLeft: 0
};

const iconStyles = {
	backgroundSize: "contain",
	marginRight: 24,
	top: "-10px",
	left: "-4px",
	height: "34px",
	width: "34px"
};

const toggleStyles = {
	position: "absolute",
	top: "auto",
	width: "auto",
	right: "1rem"
};

const defaultProps = {
	addApplication: () => {},
	appsSaveState: {},
	canAssignApplications: false,
	ecoApplications: [],
	fullHeight: false,
	isMyUser: true,
	overloaded: false,
	user: {},
	removeApplication:() => {},
	resetSaveState: () => {}
};

const handleSubmit = (e, values, userId, checked, appName, appId, addApplication, removeApplication, updateValues) => {
	const newValues = { ...values };

	if (checked) {
		const config = { role: "viewer", canView: true };
		addApplication(userId, appId, config);
	} else {
		removeApplication(userId, appId);
	}

	newValues[appName] = checked;

	updateValues(newValues);
};

const UserApps = ({
	addApplication,
	appsSaveState,
	canAssignApplications,
	ecoApplications,
	fullHeight,
	isMyUser,
	overloaded,
	user,
	removeApplication,
	resetSaveState
}) => {
	const [values, updateValues] = useState({});
	useEffect(() => {
		resetSaveState();
	}, []);
	useEffect(() => {
		const toggleValues = {};
		if (ecoApplications) {
			ecoApplications.forEach(app => {
				toggleValues[app.name] = false;
			});
		}

		if (user && user.applications) {
			user.applications.forEach(app => {
				toggleValues[app.name] = getSafely(() => app.config.canView);
			});
		}

		if (Object.keys(toggleValues).length) {
			updateValues(toggleValues);
		}
	}, [user, ecoApplications, updateValues]);

	// Get the apps the user canView
	const userApps = canAssignApplications ? ecoApplications : user.applications.filter(app => {
		return getSafely(() => app.config.canView);
	});

	const saveStatus =
		appsSaveState === "saving" ? (
			<CircularProgress color="29B6F6" size={26} />
		) : appsSaveState === "done" ? (
			<i className="material-icons saved-message">check</i>
		) : appsSaveState === "failed" ? (
			<ErrorIcon />
		) : (
			""
		);

	return (
		<ArticleContainer 
			headerTitle={getTranslation("mainContent.accountSettings.userApps.title")}
			headerDescription={getTranslation("mainContent.accountSettings.userApps.titleText")}
		>
			<List style={{ marginTop: 10 }}>
				{userApps
					.sort((a, b) => {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					})
					.map((app, index) => {
						return (
							<div className="list-item-wrapper" key={app.name}>
								<ListItem
									style={
										canAssignApplications ? values[app.name] ? styles : disabledStyles : 
											userApps.indexOf(app) > -1 ? styles : disabledStyles
									}>
									<ListItemIcon>
										<span
											style={iconStyles}
											className={
												"widget-icon app-icon-" + app.appId.toLowerCase()
											}
										/>
									</ListItemIcon>
									<ListItemText
										primary={app.name}
									/>
									{canAssignApplications && (
										<ListItemSecondaryAction>
											<Switch
												checked={values[app.name] ? true : false}
												color="primary"
												onChange={(e, checked) =>
													handleSubmit(e, values, user.id, checked, app.name, app.appId, addApplication, removeApplication, updateValues)
												}
											/>
										</ListItemSecondaryAction>
									)}
								</ListItem>
								{index !== userApps.length - 1 ?
									<Divider style={{ width: "103%" }} /> : null
								}
							</div>
						);
					})}
			</List>
		</ArticleContainer>
	);
};

UserApps.defaultProps = defaultProps;
export default memo(UserApps);