import React, { useEffect, memo } from "react";
import { attachmentService } from "client-app-core";
import { FileLink } from "orion-components/CBComponents";
import Expand from "@mui/icons-material/ZoomOutMap";
import { Typography, IconButton, SvgIcon } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import { getWidgetState, getSelectedContextData } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import PropTypes from "prop-types";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { attachFilesToAccessPoint } from "orion-components/SharedActions/accessPointProfileActions";
import { attachFilesToCamera } from "orion-components/SharedActions/cameraProfileActions";
import { attachFilesToEntity } from "orion-components/SharedActions/entityProfileActions";
import { attachFilesToFacility } from "orion-components/SharedActions/facilityProfileActions";
import { attachFilesToEvent } from "orion-components/SharedActions/eventProfileActions";
import WidgetMenu from "./components/WidgetMenu";
import { getGlobalWidgetState } from "../Selectors";
import ImageSlider from "./components/ImageSlider";
import { mdiViewCarouselOutline } from "@mdi/js";
import { mdiViewList } from "@mdi/js";
import { imageAttachmentsSelector, otherAttachmentsSelector } from "../Selectors/FileWidgetSelectors";
import { useState } from "react";
import CustomFilesDropContainer from "./components/CustomFilesDropContainer";

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

const widgetName = "fileWidget";

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
	expanded,
	widgetsExpandable
}) => {
	const enabled = useSelector((state) => isAlertProfile || expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const { entityType } = entity || { entityType: "" };
	const isPrimary = useSelector((state) => entity && contextId === contextPanelState(state).selectedContext.primary);
	const attachments = useSelector((state) => getSelectedContextData(state)(contextId, "attachments"));
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const imageAttachments = useSelector((state) => imageAttachmentsSelector(state, contextId));
	const otherAttachments = useSelector((state) => otherAttachmentsSelector(state, contextId));

	const [defaultImageView, setDefaultImageView] = useState(widgetState?.defaultImageView || "slideshow");

	const dispatch = useDispatch();
	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "ltr" && { paddingRight: 0 }),
			...(dir === "rtl" && { paddingLeft: 0 })
		},
		svgIconCarousel: {
			...(dir === "ltr" && { marginLeft: "24px", marginRight: "12px" }),
			...(dir === "rtl" && { marginRight: "24px", marginLeft: "12px" })
		}
	};

	const attachFiles = getDropZoneAction(entityType);

	useEffect(() => {
		return () => {
			if (!isPrimary && unsubscribeFromFeed)
				dispatch(unsubscribeFromFeed(contextId, "attachments", subscriberRef));
		};
	}, []);

	const handleExpand = () => {
		dispatch(selectWidget("Files"));
	};

	const handleDeleteFile = (id) => {
		attachmentService.removeAttachment(contextId, entityType, id, (err, result) => {
			if (err) console.log(err, result);
		});
	};

	const renderSlideShow = () => {
		if (imageAttachments.length === 0 && otherAttachments.length === 0) {
			return (
				<Typography style={{ padding: 12, color: "#fff" }} align="center" variant="caption" component="p">
					<Translate value="global.profiles.widgets.files.noAssocFiles" />
				</Typography>
			);
		}
		if (defaultImageView === "slideshow") {
			return (
				<>
					{imageAttachments.length > 0 && (
						<ImageSlider
							attachments={imageAttachments}
							canEdit={!readOnly && canDelete}
							handleDeleteFile={handleDeleteFile}
							entityType={entityType}
							dir={dir}
							expandedView={expanded}
						/>
					)}

					{otherAttachments !== undefined && otherAttachments.length > 0 && (
						<div className="widget-content ep-files">
							{otherAttachments.map((attachment, index) => (
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
					)}
				</>
			);
		}
		return null;
	};

	const renderViewLists = () => {
		if (defaultImageView === "thumbnail") {
			return (
				<>
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
										displayAsList={true}
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
				</>
			);
		}
	};

	return !enabled || selected ? (
		<div />
	) : (
		<section className={`collapsed widget-wrapper`} style={{ position: "relative" }}>
			<CustomFilesDropContainer
				getDropZoneAction={getDropZoneAction}
				contextId={contextId}
				entityType={entityType}
			/>
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.files.title" />
					</div>
					<SvgIcon
						style={{
							width: "24px",
							height: "24px",
							color: defaultImageView === "slideshow" ? "#F8F9F9" : "#828283",
							cursor: "pointer",
							...styles.svgIconCarousel
						}}
						onClick={() => {
							setDefaultImageView("slideshow");
						}}
					>
						<path d={mdiViewCarouselOutline} />
					</SvgIcon>

					<SvgIcon
						style={{
							width: "24px",
							height: "24px",
							color: defaultImageView === "thumbnail" ? "#F8F9F9" : "#828283",
							cursor: "pointer"
						}}
						onClick={() => {
							setDefaultImageView("thumbnail");
						}}
					>
						<path d={mdiViewList} />
					</SvgIcon>

					<div className="widget-header-buttons">
						{widgetsExpandable && !expanded ? (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						) : null}
						<WidgetMenu
							widgetName={widgetName}
							widgetState={widgetState}
							dir={dir}
							targetEntityId={contextId}
							targetEntityType={entityType}
							attachAction={attachFiles}
							hasAccess={hasAccess}
							defaultImageView={widgetState?.defaultImageView || "slideshow"}
						/>
					</div>
				</div>
			)}

			{defaultImageView === "slideshow" ? renderSlideShow() : renderViewLists()}
		</section>
	);
};

FileWidget.propTypes = propTypes;

export default memo(FileWidget, (prevProps, nextProps) => isEqual(prevProps, nextProps));
