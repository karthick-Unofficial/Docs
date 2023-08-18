import React, { useEffect, memo } from "react";
import { attachmentService } from "client-app-core";
import PhoenixDropzone from "./components/PhoenixDropzone";
import { FileLink } from "orion-components/CBComponents";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import { Typography, IconButton } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import isEqual from "lodash/isEqual";

const FileWidget = ({
	contextId,
	unsubscribeFromFeed,
	subscriberRef,
	isPrimary,
	selectWidget,
	entityType,
	attachments,
	attachFiles,
	hasAccess,
	canDelete,
	enabled,
	order,
	selected,
	widgetsExpandable,
	widgetsLaunchable,
	readOnly,
	isAlertProfile,
	dir
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			if (!isPrimary && unsubscribeFromFeed)
				dispatch(unsubscribeFromFeed(contextId, "attachments", subscriberRef));
		};
	}, []);

	const handleExpand = () => {
		dispatch(selectWidget("Files"));
	};

	const handleLaunch = () => {

		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/files`);
		}
		else if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/files`);
		}
		else if (entityType === "facility") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		}
	};

	const handleDeleteFile = id => {
		attachmentService.removeAttachment(
			contextId,
			entityType,
			id,
			(err, result) => {
				if (err) console.log(err);
			}
		);
	};

	return !enabled || selected ? (
		<div />
	) : (
		<section
			className={`collapsed ${"index-" + order} widget-wrapper`}
		>
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.files.title" /></div>
					{hasAccess && (
						<div className="widget-option-button">
							<PhoenixDropzone
								targetEntityId={contextId}
								targetEntityType={entityType}
								attachAction={attachFiles}
							/>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						) : null}
						{widgetsLaunchable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleLaunch}
								>
									<LaunchIcon />
								</IconButton>
							</div>
						) : null}
					</div>
				</div>
			)}

			{attachments !== undefined && attachments.length > 0 ? (
				<div className="widget-content ep-files">
					{attachments
						.sort((a, b) => {
							if (
								(!a.mimeType.includes("image") &&
									b.mimeType.includes("image"))
							) {
								return 1;
							} else {
								return -1;
							}
						}).sort((a, b) => {
							if (a.createdDate < b.createdDate) {
								return 1;
							} else {
								return -1;
							}
						}).map((attachment, index) => (
							<FileLink
								key={index}
								attachment={attachment}
								canEdit={!readOnly && canDelete}
								handleDeleteFile={handleDeleteFile}
								entityType={entityType}
								dir={dir}
							/>
						))}
				</div>
			) : (
				<Typography
					style={{ padding: 12, color: "#fff" }}
					align="center"
					variant="caption"
					component="p"
				>
					<Translate value="global.profiles.widgets.files.noAssocFiles" />
				</Typography>
			)}
		</section>
	);
};


export default memo(FileWidget, (prevProps, nextProps) => isEqual(prevProps, nextProps));