import React, { Component } from "react";
import { organizationService } from "client-app-core";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Switch
} from "@material-ui/core";
import { Dialog } from "../../../CBComponents/index";

import _ from "lodash";
import isEqual from "react-fast-compare";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class EventShareDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sharedWith: this.props.event.sharedWith,
			orgs: []
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
		);
	}

	componentDidMount() {
		const { user } = this.props;
		organizationService.getAllOrgsForSharing((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			const orgs = _.filter(response.result, org => (org.orgId !== user.orgId));
			this.setState({ orgs });
		});
	}

	handleClosePublishDialog = () => {
		const { closeDialog } = this.props;
		closeDialog("eventPublishDialog");
	};

	handleCloseShareDialog = () => {
		const { closeDialog, event } = this.props;
		closeDialog("eventShareDialog");
		const sharedWith = event.sharedWith;
		this.setState({ sharedWith });
	};

	handleConfirmShare = () => {
		const { closeDialog, event, shareEvent } = this.props;
		const { sharedWith } = this.state;

		shareEvent(event.id, sharedWith);
		closeDialog("eventShareDialog");
	};

	// Move to next dialog after first is confirmed
	handleConfirmPublish = id => {
		const { publishEvent, openDialog } = this.props;
		// Publish to org
		publishEvent(id);
		this.handleClosePublishDialog();
	};

	handleShareToggle = orgId => {
		const { sharedWith } = this.state;

		sharedWith.includes(orgId)
			? this.setState({
				sharedWith: sharedWith.filter(org => {
					return org !== orgId;
				})
			  })
			: this.setState({
				sharedWith: [...sharedWith, orgId]
			  });
	};

	render() {
		const { event, dialog, dir } = this.props;
		const { orgs, sharedWith } = this.state;
		const sharePromptText = event.isTemplate ? getTranslation("global.profiles.eventProfile.eventShareDialog.sharePromptTemplate") : getTranslation("global.profiles.eventProfile.eventShareDialog.sharePromptEvent");

		return (
			<React.Fragment>
				{/* Share to user's org */}
				<Dialog
					open={dialog === "eventPublishDialog"}
					confirm={{
						label: getTranslation("global.profiles.eventProfile.eventShareDialog.confirm"),
						action: () => this.handleConfirmPublish(event.id)
					}}
					abort={{ label: getTranslation("global.profiles.eventProfile.eventShareDialog.cancel"), action: this.handleClosePublishDialog }}
					title={sharePromptText}
					dir={dir}
				/>
				{/* Share to ecosystem orgs */}
				<Dialog
					open={dialog === "eventShareDialog"}
					confirm={{
						label: getTranslation("global.profiles.eventProfile.eventShareDialog.confirm"),
						action: this.handleConfirmShare,
						disabled: orgs.length < 1
					}}
					abort={{ label: getTranslation("global.profiles.eventProfile.eventShareDialog.cancel"), action: this.handleCloseShareDialog }}
					title={
						orgs.length >= 1
							? getTranslation("global.profiles.eventProfile.eventShareDialog.shareTitle", event.name)
							: getTranslation("global.profiles.eventProfile.eventShareDialog.noOrganizations")
					}
					dir={dir}
				>
					<List>
						{orgs.map(org => {
							return (
								<ListItem key={org.orgId}>
									<ListItemText
										primary={org.name}
										primaryTypographyProps={{ noWrap: true }}
										style={dir == "rtl" ? {textAlign: "right"} : {}}
									/>
									<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}}>
										<Switch
											color="primary"
											checked={sharedWith.includes(org.orgId)}
											onChange={() => this.handleShareToggle(org.orgId)}
										/>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Dialog>
			</React.Fragment>
		);
	}
}

export default EventShareDialog;
