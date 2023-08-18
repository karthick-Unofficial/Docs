import React, { Fragment, memo, useState, useEffect } from "react";

import { Avatar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, CircularProgress, Divider, Switch } from "@mui/material";

import ErrorIcon from "../../../shared/components/ErrorIcon";

import ArticleContainer from "../../../shared/components/ArticleContainer";

import { getIntegrationIcon } from "../../../utility";

// lodash
import _ from "lodash";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./userIntegrationsActions";

const styles = {
	margin: "4px 0",
	top: "0px",
	height: "60px",
	lineHeight: "20px",
	paddingLeft: 0
};

const disabledStyles = {
	margin: "4px 0",
	top: "1px",
	height: "60px",
	lineHeight: "20px",
	opacity: ".5",
	paddingLeft: 0
};

const handleSubmit = (e, user, ecoIntegrations, values, checked, intName, intId, orgIntId, updateIntegration, updateValues, dispatch) => {
	const integration = ecoIntegrations.find(
		int => int.feedId === intId
	);
	// Update checked state of int
	// On refresh or props will be initially toggled based on user permission
	values[orgIntId] = checked;
	updateValues(values);

	if (checked) {
		integration.config = { role: "viewer", canView: true };
		dispatch(updateIntegration(
			user.id,
			intId,
			integration.config,
			orgIntId
		));
	} else {
		integration.config = { role: "viewer", canView: false };
		dispatch(updateIntegration(
			user.id,
			intId,
			integration.config,
			orgIntId
		));
	}
};

const UserIntegrations = ({
	isMyUser
}) => {
	const dispatch = useDispatch();
	const { resetSaveState, updateIntegration } = actionCreators;

	const userId = useSelector(state => state.session.user.profile.id);
	const user = useSelector(state =>
		state.appState.viewing.selectedEntity.type === "user"
			? state.globalData.users[state.appState.viewing.selectedEntity.id]
			: null);
	// Any admin can edit the integrations of any user
	const canAssignIntegrations = useSelector(state => state.session.user.profile.admin);
	const orgs = useSelector(state => _.keyBy(state.globalData.orgs, "orgId"));
	const ecoIntegrations = useSelector(state => state.globalData.integrations);
	const integrationsSaveState = useSelector(state => state.appState.saveStates.integrationsSaveState);

	const [values, updateValues] = useState({});
	useEffect(() => {
		dispatch(resetSaveState());
	}, []);
	useEffect(() => {
		const toggleValues = {};
		if (ecoIntegrations) {
			ecoIntegrations.forEach(int => {
				toggleValues[int.orgIntId] = false;
			});
		}

		if (user && user.integrations) {
			user.integrations.forEach(int => {
				toggleValues[int.orgIntId] = int.config.canView;
			});
		}

		if (Object.keys(toggleValues).length) {
			if (user && user.integrations && ecoIntegrations && ecoIntegrations.length) {
				const ints = _.unionBy(ecoIntegrations, user.integrations, "orgIntId");

				// This allows feeds to be toggled the first time, even though initial admin does not have
				// an object with config for that feed yet
				_.each(ints, int => {
					if (_.some(user.integrations, { orgIntId: int.orgIntId })) {
						// If user already has an object for that feed, set to config.canView
						const config = _.find(ecoIntegrations, {
							orgIntId: int.orgIntId
						}).config.canView;

						toggleValues[int.orgIntId] = !_.isEmpty(config)
							? config
							: toggleValues[int.orgIntId];
					}
					// Else it will be remain as it was set locally
				});
			}
			updateValues(toggleValues);
		}
	}, [user, ecoIntegrations, updateValues]);

	const saveStatus =
		integrationsSaveState === "saving" ? (
			<CircularProgress color="29B6F6" size={26} />
		) : integrationsSaveState === "done" ? (
			<i className="material-icons saved-message">check</i>
		) : integrationsSaveState === "failed" ? (
			<ErrorIcon />
		) : (
			""
		);
	const integrations = canAssignIntegrations ? ecoIntegrations : user.integrations;
	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.accountSettings.userIntegrations.title")}
			headerDescription={getTranslation("mainContent.accountSettings.userIntegrations.titleText")}
		>
			<List>
				{integrations
					.filter(int => {
						return canAssignIntegrations ? true : int.config.canView;
					})
					.sort((a, b) => {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					})
					.filter(int => {
						// Org's shape feed is always available
						if (int.entityType === "shapes") {
							return int.feedOwnerOrg === user.orgId ? false : true;
						} else {
							return true;
						}
					})
					.map((int, index) => {
						const icon = getIntegrationIcon(int.feedIcon);
						return (
							<Fragment key={int.orgIntId}>
								<ListItem
									style={
										canAssignIntegrations ? values[int.orgIntId]
											? styles
											: disabledStyles : styles
									}>
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
										secondary={int.feedOwnerOrg !== user.orgId
											? `Shared from ${orgs[int.feedOwnerOrg].name}`
											: ""}
									/>
									{canAssignIntegrations && (
										<ListItemSecondaryAction>
											<Switch
												checked={values[int.orgIntId] ? true : false}
												color="primary"
												onChange={(e, checked) =>
													handleSubmit(e,
														user,
														ecoIntegrations,
														values,
														checked,
														int.name,
														int.feedId,
														int.orgIntId,
														updateIntegration,
														updateValues,
														dispatch)
												}
											/>
										</ListItemSecondaryAction>
									)}
								</ListItem>
								{index !== user.integrations.length - 1 ?
									<Divider style={{ width: "103%" }} /> : null
								}
							</Fragment>
						);
					})}
			</List>
		</ArticleContainer>
	);
};

export default memo(UserIntegrations);