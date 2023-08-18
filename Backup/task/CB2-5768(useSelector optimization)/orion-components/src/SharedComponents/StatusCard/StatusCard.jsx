import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { statusBoardService } from "client-app-core";
import moment from "moment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Share } from "@mui/icons-material";
import StatusCardDialog from "./StatusCardDialog/StatusCardDialog";
import ShareStatusCardDialog from "./ShareStatusCardDialog/ShareStatusCardDialog";
import Selector from "./StatusControls/Selector";
import Slides from "./StatusControls/Slides";
import Text from "./StatusControls/Text";
import { Translate, getTranslation } from "orion-components/i18n";
import SvgIcon from "@mui/material/SvgIcon";
import { mdiDotsHorizontal, mdiPencil } from "@mdi/js";
import { List, ListItem, ListItemText, Popover } from "@mui/material";

const propTypes = {
	card: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	setEditingMode: PropTypes.func.isRequired,
	disableControls: PropTypes.bool.isRequired,
	disableMenu: PropTypes.bool,
	userCanEdit: PropTypes.bool.isRequired,
	userCanShare: PropTypes.bool.isRequired,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const StatusCard = ({ card, setEditingMode, disableControls, disableMenu, userCanEdit, userCanShare, dir, locale }) => {
	const { name } = card;
	const [editMode, setEditMode] = useState(false);
	const [shareMode, setShareMode] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [forceUpdate, setForceUpdate] = useState(false);

	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const toggleEditMode = () => {
		if (setEditingMode) setEditingMode(!editMode);
		setEditMode(!editMode);
		setAnchorEl(null);
	};

	const toggleShareMode = () => {
		setShareMode(!shareMode);
		setAnchorEl(null);
	};

	const updateSelected = (dataIndex) => {
		return (selectedIndex) => {
			statusBoardService.updateSelectedIndex(card.id, dataIndex, selectedIndex, (err) => {
				if (err) {
					console.log("Error", err);
				}
				setForceUpdate(!forceUpdate);
			});
		};
	};

	const styles = {
		container: {
			height: "100%",
			backgroundColor: "rgb(73, 77, 83)",
			position: "relative",
			borderRadius: 7
		},
		topBar: {
			cursor: "grab",
			backgroundColor: "rgb(65, 69, 74)",
			display: "flex",
			alignItems: "center",
			position: "relative",
			padding: "4px",
			height: "55px"
		},
		headerDiv: {
			width: "100%",
			wordBreak: "break-all",
			height: "100%"
		},
		header: {
			color: "white",
			textAlign: "center",
			verticalAlign: "middle",
			fontSize: "16px",
			overflow: "hidden"
		},
		contentArea: {
			height: "100%",
			position: "relative",
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			padding: "10px 0"
		},
		updatedText: {
			color: "#B5B9BE",
			lineHeight: "1.5",
			fontSize: 12,
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		},
		bottomBar: {
			backgroundColor: "#494D53",
			display: "flex",
			height: "36px",
			alignItems: "center",
			justifyContent: "space-between",
			width: "100%",
			padding: "0 25px",
			marginTop: "5px"
		},
		iconButton: {
			...(dir === "rtl" && { padding: "6px", marginLeft: "15px" }),
			...(dir === "ltr" && { padding: "6px", marginRight: "15px" }),
			color: "#fff"
		},
		typography: {
			color: "#B5B9BE",
			fontSize: 12,
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		},
		statusCardTitle: {
			width: "calc(100% - 110px)",
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" })
		},
		textAlignRight: {
			margin: "0 20px",
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	const getControlComponent = (type, statusControl, index, dir) => {
		switch (type) {
			case "selector":
				return (
					<Selector
						key={`${card.id}-${index}`}
						control={statusControl}
						updateSelected={updateSelected(index)}
						dir={dir}
					/>
				);
			case "slides":
				return (
					<Slides
						key={`${card.id}-${index}`}
						control={statusControl}
						updateSelected={updateSelected(index)}
						disableControls={disableControls || !userCanEdit}
						dir={dir}
						forceUpdate={forceUpdate}
					/>
				);
			case "text":
				return <Text key={`${card.id}-${index}`} control={statusControl} dir={dir} id={card.id} />;
			default:
				break;
		}
	};
	moment.relativeTimeThreshold("h", 24);

	const handleExpandMenu = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handlePopoverClick = (e) => {
		// -- stop propagation outside the popover
		e.stopPropagation();
	};

	return (
		<div className="status-card-container" style={styles.container}>
			<section style={styles.contentArea}>
				<div style={styles.statusCardTitle}>
					<div className="status-card-header-div" style={styles.headerDiv}>
						<p style={styles.header}>{name}</p>
					</div>
				</div>
				{!disableControls && !disableMenu ? (
					<IconButton
						className="status-card-button card-button-share"
						style={styles.iconButton}
						onClick={handleExpandMenu}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
					>
						<SvgIcon style={styles.controlButtons}>
							<path d={mdiDotsHorizontal} />
						</SvgIcon>
					</IconButton>
				) : (
					<div style={{ width: "42px" }} />
				)}

				{card.data.map((statusControl, idx) => {
					const Component = getControlComponent(statusControl.type, statusControl, idx, dir);
					return Component;
				})}
				{
					<div style={styles.bottomBar}>
						{disableControls ? (
							<Typography variant="body1" style={styles.typography}>
								<Translate
									value="global.sharedComponents.statusCard.main.sharedFrom"
									count={card.ownerOrgName}
								/>
							</Typography>
						) : (
							<div></div>
						)}
						{card.lastUpdatedBy ? (
							<p style={styles.updatedText}>
								<Translate
									value="global.sharedComponents.statusCard.main.changed"
									count={moment(card.lastUpdateDate).locale(locale).fromNow()}
								/>
								<Translate
									value="global.sharedComponents.statusCard.main.by"
									count={card.lastUpdatedBy}
								/>
							</p>
						) : null}
					</div>
				}
			</section>
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				onClose={handleCloseMenu}
				onClick={handlePopoverClick}
				style={{ borderRadius: "0" }}
			>
				<List style={{ background: "#4A4D52" }}>
					<Fragment>
						{userCanEdit && !disableControls && (
							<ListItem
								button
								style={{
									paddingTop: 8,
									paddingBottom: 8,
									paddingLeft: 16,
									paddingRight: 16
								}}
								onClick={toggleEditMode}
							>
								<SvgIcon style={styles.controlButtons}>
									<path d={mdiPencil} />
								</SvgIcon>
								<ListItemText
									primary={getTranslation("global.sharedComponents.statusCard.main.editCard")}
									style={styles.textAlignRight}
								/>
							</ListItem>
						)}
						{!disableControls && userCanShare && (
							<ListItem
								button
								style={{
									paddingTop: 8,
									paddingBottom: 8,
									paddingLeft: 16,
									paddingRight: 16
								}}
								onClick={toggleShareMode}
							>
								<Share
									style={{
										color: card.sharedWith.length ? "#4eb5f3" : "#fff"
									}}
								/>
								<ListItemText
									primary={getTranslation("global.sharedComponents.statusCard.main.share")}
									style={styles.textAlignRight}
								/>
							</ListItem>
						)}
					</Fragment>
				</List>
			</Popover>
			<StatusCardDialog open={editMode} closeDialog={toggleEditMode} card={card} dir={dir} />
			<ShareStatusCardDialog
				open={shareMode}
				closeDialog={toggleShareMode}
				cardId={card.id}
				sharedWith={card.sharedWith}
			/>
		</div>
	);
};

StatusCard.propTypes = propTypes;
export default StatusCard;
