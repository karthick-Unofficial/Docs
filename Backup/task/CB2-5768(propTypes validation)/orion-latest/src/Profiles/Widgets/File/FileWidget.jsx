import React, { useEffect, memo } from "react";
import { attachmentService } from "client-app-core";
import PhoenixDropzone from "./components/PhoenixDropzone";
import { FileLink } from "orion-components/CBComponents";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import { Typography, IconButton } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import {
	getWidgetState,
	isWidgetLaunchableAndExpandable,
	getSelectedContextData
} from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import PropTypes from "prop-types";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { attachFilesToAccessPoint } from "orion-components/SharedActions/accessPointProfileActions";
import { attachFilesToCamera } from "orion-components/SharedActions/cameraProfileActions";
import { attachFilesToEntity } from "orion-components/SharedActions/entityProfileActions";
import { attachFilesToFacility } from "orion-components/SharedActions/facilityProfileActions";
import { attachFilesToEvent } from "orion-components/SharedActions/eventProfileActions";

const getDropZoneAction = (entityType) => {
	switch (entityType) {
		case "accessPoint":
			return attachFilesToAccessPoint;
		case "camera":
			return attachFilesToCamera;
		case "track":
		case "shapes":
			return attachFilesToEntity;
		case "facility":
			return attachFilesToFacility;
		case "event":
			return attachFilesToEvent;
		default:
			return null;
	}
};

const propTypes = {
	id: PropTypes.string,
	readOnly: PropTypes.bool,
	contextId: PropTypes.string,
	subscriberRef: PropTypes.any,
	entityType: PropTypes.string,
	hasAccess: PropTypes.bool,
	canDelete: PropTypes.bool,
	isAlertProfile: PropTypes.bool,
	selected: PropTypes.bool,
	expanded: PropTypes.bool,
	selectWidget: PropTypes.func
};

const FileWidget = ({
	id,
	contextId,
	subscriberRef,
	selectWidget,
	hasAccess,
	canDelete,
	selected,
	readOnly,
	isAlertProfile,
	expanded
}) => {
	const enabled = useSelector((state) => isAlertProfile || expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const { entityType } = entity || { entityType: "" };
	const isPrimary = useSelector((state) => entity && contextId === contextPanelState(state).selectedContext.primary);
	const attachments = useSelector((state) => getSelectedContextData(state)(contextId, "attachments"));

	const dispatch = useDispatch();
	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "ltr" && { paddingRight: 0 }),
			...(dir === "rtl" && { paddingLeft: 0 })
		}
	};

	const attachFiles = getDropZoneAction(entityType);
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable, widgetsLaunchable } = launchableAndExpandable;

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
		} else if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/files`);
		} else if (entityType === "facility") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		}
	};

	const handleDeleteFile = (id) => {
		attachmentService.removeAttachment(contextId, entityType, id, (err, result) => {
			if (err) console.log(err, result);
		});
	};

	return !enabled || selected ? (
		<div />
	) : (
		<section className={`collapsed widget-wrapper`}>
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.files.title" />
					</div>
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
						{widgetsExpandable && !expanded ? (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						) : null}
						{widgetsLaunchable ? (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleLaunch}>
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
							if (!a.mimeType.includes("image") && b.mimeType.includes("image")) {
								return 1;
							} else {
								return -1;
							}
						})
						.sort((a, b) => {
							if (a.createdDate < b.createdDate) {
								return 1;
							} else {
								return -1;
							}
						})
						.map((attachment, index) => (
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
				<Typography style={{ padding: 12, color: "#fff" }} align="center" variant="caption" component="p">
					<Translate value="global.profiles.widgets.files.noAssocFiles" />
				</Typography>
			)}
		</section>
	);
};

FileWidget.propTypes = propTypes;

export default memo(FileWidget, (prevProps, nextProps) => isEqual(prevProps, nextProps));
