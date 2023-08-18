import React, { useEffect, useState } from "react";
import { attachmentService } from "client-app-core";
import { Dialog, FileLink } from "orion-components/CBComponents";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import _ from "lodash";
import { getTranslation } from "orion-components/i18n";

const RowEdit = ({
	row,
	list,
	handleCloseDialog,
	dialogRef,
	dialog,
	dir
}) => {
	const [attachments, setAttachments] = useState([]);
	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	useEffect(() => {
		if (row) {
			attachmentService.subscribeByTarget(list.id, (err, response) => {
				if (err) console.log(err);
				if (response) {
					switch (response.type) {
						case "initial":
						case "add":
							setAttachments([...attachments, response.new_val]);
							break;
						case "remove":
							setAttachments(_.filter(
								attachments,
								attachment => attachment.fileId !== response.old_val.fileId));
							break;
						default:
							break;
					}
				}
			});
		}
	}, []);

	const handleClose = () => {
		handleCloseDialog(dialogRef);
	};

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
				action: handleClose
			}}
			title={getTranslation("global.sharedComponents.attachmentDialog.title")}
			dir={dir}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				<div style={{ paddingTop: 24 }}>
					{_.map(rowAttachments, attachment => (
						<FileLink
							key={attachment.fileId}
							attachment={attachment}
							//handleDeleteFile={handleDeleteFile}-- no definition
							canEdit={false}
							dir={dir}
						/>
					))}
				</div>
			</div>
		</Dialog>
	) : null;

};

export default RowEdit;
