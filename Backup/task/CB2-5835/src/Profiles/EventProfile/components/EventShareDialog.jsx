import React, { memo, useEffect, useState } from "react";
import { organizationService } from "client-app-core";
import { List, ListItem, ListItemText, ListItemSecondaryAction, Switch } from "@mui/material";
import { Dialog } from "../../../CBComponents/index";

import filter from "lodash/filter";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";

const EventShareDialog = ({ event, user, closeDialog, shareEvent, publishEvent, dir }) => {
	const dispatch = useDispatch();
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");

	const [sharedWith, setSharedWith] = useState(event.sharedWith);
	const [orgs, setOrgs] = useState([]);

	useEffect(() => {
		organizationService.getAllOrgsForSharing((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			const orgs = filter(response.result, (org) => org.orgId !== user.orgId);
			setOrgs(orgs);
		});
	}, []);

	const handleClosePublishDialog = () => {
		dispatch(closeDialog("eventPublishDialog"));
	};

	const handleCloseShareDialog = () => {
		dispatch(closeDialog("eventShareDialog"));
		const sharedWith = event.sharedWith;
		setSharedWith(sharedWith);
	};

	const handleConfirmShare = () => {
		dispatch(shareEvent(event.id, sharedWith));
		dispatch(closeDialog("eventShareDialog"));
	};

	// Move to next dialog after first is confirmed
	const handleConfirmPublish = (id) => {
		// Publish to org
		dispatch(publishEvent(id));
		handleClosePublishDialog();
	};

	const handleShareToggle = (orgId) => {
		sharedWith.includes(orgId)
			? setSharedWith(
				sharedWith.filter((org) => {
					return org !== orgId;
				})
			)
			: setSharedWith([...sharedWith, orgId]);
	};

	const sharePromptText = event.isTemplate
		? getTranslation("global.profiles.eventProfile.eventShareDialog.sharePromptTemplate")
		: getTranslation("global.profiles.eventProfile.eventShareDialog.sharePromptEvent");

	return (
		<React.Fragment>
			{/* Share to user's org */}
			<Dialog
				open={dialog === "eventPublishDialog"}
				confirm={{
					label: getTranslation("global.profiles.eventProfile.eventShareDialog.confirm"),
					action: () => handleConfirmPublish(event.id)
				}}
				abort={{
					label: getTranslation("global.profiles.eventProfile.eventShareDialog.cancel"),
					action: handleClosePublishDialog
				}}
				title={sharePromptText}
				dir={dir}
			/>
			{/* Share to ecosystem orgs */}
			<Dialog
				open={dialog === "eventShareDialog"}
				confirm={{
					label: getTranslation("global.profiles.eventProfile.eventShareDialog.confirm"),
					action: handleConfirmShare,
					disabled: orgs.length < 1
				}}
				abort={{
					label: getTranslation("global.profiles.eventProfile.eventShareDialog.cancel"),
					action: handleCloseShareDialog
				}}
				title={
					orgs.length >= 1
						? getTranslation("global.profiles.eventProfile.eventShareDialog.shareTitle", event.name)
						: getTranslation("global.profiles.eventProfile.eventShareDialog.noOrganizations")
				}
				dir={dir}
			>
				<List>
					{orgs.map((org) => {
						return (
							<ListItem key={org.orgId}>
								<ListItemText
									primary={org.name}
									primaryTypographyProps={{ noWrap: true }}
									style={dir == "rtl" ? { textAlign: "right" } : {}}
								/>
								<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
									<Switch
										color="primary"
										checked={sharedWith.includes(org.orgId)}
										onChange={() => handleShareToggle(org.orgId)}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>
			</Dialog>
		</React.Fragment>
	);
};

export default memo(EventShareDialog);
