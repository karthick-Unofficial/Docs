import React, { Component } from "react";
import { attachmentService } from "client-app-core";
import { Dialog, FileLink } from "orion-components/CBComponents";
import { withWidth } from "@material-ui/core";
import _ from "lodash";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class RowEdit extends Component {
	constructor(props) {
		super(props);
		this.state = { attachments: [] };
	}

	componentDidMount() {
		const { row, list } = this.props;

		if (row) {
			attachmentService.subscribeByTarget(list.id, (err, response) => {
				if (err) console.log(err);
				if (response) {
					switch (response.type) {
						case "initial":
						case "add":
							this.setState({
								attachments: [...this.state.attachments, response.new_val]
							});
							break;
						case "remove":
							this.setState({
								attachments: _.filter(
									this.state.attachments,
									attachment => attachment.fileId !== response.old_val.fileId
								)
							});
							break;
						default:
							break;
					}
				}
			});
		}
	}

	handleClose = () => {
		const { handleCloseDialog, dialogRef } = this.props;
		handleCloseDialog(dialogRef);
	};

	render() {
		const { dialog, width, dialogRef, row, dir } = this.props;
		const { attachments } = this.state;

		const rowAttachments = _.filter(attachments, attachment =>
			_.includes(row.attachments, attachment.fileId)
		);

		// Prevent Edit and Add dialog from rendering simultaneously
		return dialog === dialogRef ? (
			<Dialog
				key="attachment-dialog"
				open={dialog === dialogRef}
				confirm={{
					label: getTranslation("global.sharedComponents.attachmentDialog.close"),
					action: this.handleClose
				}}
				title={getTranslation("global.sharedComponents.attachmentDialog.title")}
				dir={dir}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<div style={{ paddingTop: 24 }}>
						{_.map(rowAttachments, attachment => (
							<FileLink
								key={attachment.fileId}
								attachment={attachment}
								handleDeleteFile={this.handleDeleteFile}
								canEdit={false}
								dir={dir}
							/>
						))}
					</div>
				</div>
			</Dialog>
		) : null;
	}
}

export default withWidth()(RowEdit);
