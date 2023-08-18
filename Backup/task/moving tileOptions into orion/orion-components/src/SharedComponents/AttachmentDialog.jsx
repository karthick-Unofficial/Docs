import React, { useEffect, useState, useRef } from "react";
import { attachmentService } from "client-app-core";
import { Dialog, FileLink } from "orion-components/CBComponents";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { getTranslation } from "orion-components/i18n";
import filter from "lodash/filter";
import includes from "lodash/includes";
import map from "lodash/map";

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
	const attachmentRef = useRef([]);

	useEffect(() => {
		if (row) {
			attachmentService.subscribeByTarget(list.id, (err, response) => {
				if (err) console.log(err);
				if (response) {
					switch (response.type) {
						case "initial":
						case "add":
							attachmentRef.current = [...attachmentRef.current, response.new_val];
							setAttachments([...attachments, response.new_val]);
							break;
						case "remove":
							attachmentRef.current = filter(
								attachmentRef.current,
								attachment => attachment.fileId !== response.old_val.fileId);
							setAttachments(filter(
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

	const rowAttachments = filter(attachmentRef.current, attachment =>
		includes(row.attachments, attachment.fileId)
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
					{map(rowAttachments, attachment => (
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
