import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	Button,
	Dialog,
	DialogContent,
	DialogActions
} from "@material-ui/core";

import { Cancel, Clear } from "@material-ui/icons";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { attachmentService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	attachment: PropTypes.object.isRequired,
	handleDeleteFile: PropTypes.func,
	canEdit: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	handleDeleteFile: () => { },
	canEdit: false
};

const styles = {
	video: {
		width: "100%"
	},
	imageViewDiv: {
		position: "relative"
	},
	deleteImageButton: {
		position: "absolute",
		top: 0,
		right: 0,
		zIndex: 50,
		color: "rgba(255,255,255,0.7)"
	},
	deleteImageButtonRTL: {
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 50,
		color: "rgba(255,255,255,0.7)"
	},
	defaultImageButton: {
		position: "absolute",
		color: "rgba(255,255,255,0.7)"
	},
	image: {
		width: "100%",
		cursor: "pointer"
	},
	fileListItem: {
		backgroundColor: "#494D53",
		borderRadius: 5
	}
};

const FileLink = ({ attachment, canEdit, handleDeleteFile, entityType, dir }) => {
	const [expanded, setExpanded] = useState(false);
	const [stageDelete, setStageDelete] = useState(false);
	const [fileExt, setFileExt] = useState();
	const [isImage, setIsImage] = useState(false);
	const [isVideo, setIsVideo] = useState(false);
	const [mediaSrc, setMediaSrc] = useState();

	useEffect(() => {
		const { mimeType, handle, source } = attachment;
		setFileExt(mimeType ? mimeType.substring(mimeType.indexOf("/") + 1) : "");
		const newIsImage = mimeType.includes("image");
		const newIsVideo = mimeType.includes("video");
		setIsImage(newIsImage);
		setIsVideo(newIsVideo);
		const isExternal = source != null && source == "external";
		if (newIsImage || newIsVideo) {
			if (!isExternal) {
				setMediaSrc(`/_download?handle=${handle}`);
			}
			else {
				setMediaSrc(handle);
			}
		}

		return () => {
			setExpanded(false);
			setStageDelete(false);
		};
	}, [attachment]);

	const setDefault = () => {
		const { fileId, targetId } = attachment;
		attachmentService.updateFile(fileId, targetId);
	};

	const handleStageDelete = e => {
		if (e) {
			e.preventDefault();
		}
		setStageDelete(!stageDelete);
	};

	const handleDelete = () => {
		const { fileId } = attachment;
		handleDeleteFile(fileId);
		handleStageDelete();
	};

	const videoPlayer = () => {
		return (
			<video muted autoPlay loop style={styles.video}>
				<source src={mediaSrc} type={attachment.mimeType} />
			</video>
		);
	};

	const imageView = () => {
		return (
			<div style={styles.imageViewDiv}>
				{canEdit && (
					<React.Fragment>
						<IconButton style={dir && dir == "rtl" ? styles.deleteImageButtonRTL : styles.deleteImageButton} onClick={handleStageDelete}>
							<Cancel />
						</IconButton>
						{!attachment.defaultImage && (entityType === "track" || entityType === "shapes") && (
							<IconButton style={styles.defaultImageButton} onClick={setDefault}>
								<CheckCircleIcon />
							</IconButton>
						)}
						{attachment.defaultImage && (entityType === "track" || entityType === "shapes") && (
							<IconButton disabled className="defaultImg">
								<CheckCircleIcon />
							</IconButton>
						)}
					</React.Fragment>
				)}
				<img alt={attachment.filename} style={styles.image} src={mediaSrc} onClick={() => setExpanded(true)} />
			</div>
		);
	};

	const fileView = () => {
		return (
			<ListItem
				button={true}
				component="button"
				dense={true}
				key={attachment.fileId}
				href={`/_download?handle=${attachment.handle}`}
				download={attachment.filename}
				style={{ ...styles.fileListItem, paddingRight: canEdit ? 0 : 16 }}
			>
				<ListItemIcon style={{ marginRight: 0 }}>
					<div className={`${fileExt} generic-fallback fileicon`} />
				</ListItemIcon>
				<ListItemText style={{ paddingLeft: 0 }} primary={attachment.filename} />
				{canEdit && Boolean(handleDeleteFile) && (
					<ListItemIcon>
						<IconButton style={{ padding: 0 }} onClick={e => handleStageDelete(e)}>
							<Cancel />
						</IconButton>
					</ListItemIcon>
				)}
			</ListItem>
		);
	};

	return (
		<Fragment>
			{attachment &&
				<div style={{ marginBottom: 12 }}>
					{isVideo ? videoPlayer() :
						isImage ? imageView() :
							fileView()}
				</div>
			}
			<Dialog open={expanded} maxWidth="lg">
				<DialogActions>
					<IconButton onClick={() => setExpanded(false)}>
						<Clear />
					</IconButton>
				</DialogActions>
				<DialogContent style={{ overflow: "hidden" }}>
					<img
						alt={attachment.filename}
						src={mediaSrc}
						style={{ maxHeight: "80vh" }}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						fullWidth
						color="primary"
						href={mediaSrc}
						download={attachment.filename}
					>
						<Translate value="global.CBComponents.CBFileLink.downloadImg"/>
					</Button>
				</DialogActions>
			</Dialog>
			<CBDialog
				open={stageDelete}
				title={getTranslation("global.CBComponents.CBFileLink.dialog.title")}
				textContent={getTranslation("global.CBComponents.CBFileLink.dialog.textContent")}
				confirm={{ label: getTranslation("global.CBComponents.CBFileLink.dialog.delete"), action: handleDelete }}
				abort={{ label: getTranslation("global.CBComponents.CBFileLink.dialog.cancel"), action: handleStageDelete }}
			/>
		</Fragment>
	);
};

FileLink.propTypes = propTypes;
FileLink.defaultProps = defaultProps;

export default FileLink;
