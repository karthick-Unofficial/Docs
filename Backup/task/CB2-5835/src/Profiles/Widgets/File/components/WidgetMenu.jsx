import React, { useEffect, useState } from "react";
import { FormControlLabel, IconButton, Menu, MenuItem, Radio, RadioGroup, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { useDispatch } from "react-redux";
import { setWidgetState } from "orion-components/SharedActions/commonActions";
import PhoenixDropzone from "./PhoenixDropzone";
import { useRef } from "react";
import { Translate, getTranslation } from "orion-components/i18n";

const WidgetMenu = ({
	dir,
	targetEntityId,
	targetEntityType,
	attachAction,
	widgetState,
	widgetName,
	hasAccess,
	defaultImageView
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialog, setDialog] = useState("");
	const [imageDisplayType, setImageDisplayType] = useState("thumbnail");
	const dropzoneRef = useRef(null);

	useEffect(() => {
		setImageDisplayType(defaultImageView);
	}, [defaultImageView]);

	const dispatch = useDispatch();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const saveWidgetSettings = () => {
		const updatedWidgetState = widgetState;
		updatedWidgetState.defaultImageView = imageDisplayType;
		dispatch(setWidgetState(widgetName, updatedWidgetState));
		setDialog("");
	};

	const handleDialogClose = () => {
		setDialog("");
	};

	const styles = {
		iconButton: {
			height: 45,
			...(dir === "rtl" && { marginRight: "10px" }),
			...(dir === "ltr" && { marginLeft: "10px" })
		},
		header: {
			color: "#FFFFF",
			fontFamily: "Roboto",
			fontSize: 14
		},
		note: {
			color: "#fff",
			fontFamily: "Roboto",
			marginTop: "8px",
			opacity: "0.69"
		},
		imageDisplayHeader: {
			color: "#fff",
			fontFamily: "Roboto",
			marginTop: "29px",
			opacity: "0.69"
		}
	};

	return (
		<>
			<div style={styles.iconButton}>
				<IconButton onClick={handleClick} style={{ color: "#FFF", width: "auto", padding: 0, height: "100%" }}>
					<MoreHorizIcon />
				</IconButton>
			</div>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				sx={{ marginTop: "-2%" }}
			>
				<MenuItem
					onClick={() => {
						setDialog("widgetMenuProximity");
						handleMenuClose();
					}}
					sx={{
						"&:hover": { backgroundColor: "#2D2E2F" },
						backgroundColor: "#41454B",
						fontSize: "14px"
					}}
				>
					<Translate value={"global.profiles.widgets.shared.widgetMenu.title"} />
				</MenuItem>
				{hasAccess && (
					<MenuItem
						onClick={() => {
							if (dropzoneRef.current) {
								dropzoneRef.current.onOpenClick();
							}
							handleMenuClose();
						}}
						sx={{
							"&:hover": { backgroundColor: "#2D2E2F" },
							backgroundColor: "#41454B",
							fontSize: "14px"
						}}
					>
						<Translate value={"global.profiles.widgets.shared.widgetMenu.upload"} />
					</MenuItem>
				)}
			</Menu>

			<CBDialog
				open={dialog === "widgetMenuProximity"}
				confirm={{
					label: getTranslation("global.profiles.widgets.shared.widgetMenu.ok"),
					action: saveWidgetSettings,
					style: { color: "#5594B9" }
				}}
				abort={{
					label: getTranslation("global.profiles.widgets.shared.widgetMenu.cancel"),
					action: handleDialogClose,
					style: "#B4B9BF"
				}}
				dir={dir}
				paperPropStyles={{
					width: "607px",
					padding: "1.5% 0.75%"
				}}
			>
				<div>
					<Typography fontSize="16px" style={styles.header}>
						<Translate
							value={"global.profiles.widgets.shared.widgetMenu.header"}
							count={getTranslation("global.profiles.widgets.files.title")}
						/>
					</Typography>

					<Typography fontSize="11px" style={styles.note}>
						<Translate value={"global.profiles.widgets.shared.widgetMenu.note"} />
					</Typography>
					<div style={{ marginBottom: "100px" }}>
						<Typography fontSize="11px" style={styles.imageDisplayHeader}>
							<Translate value={"global.profiles.widgets.shared.widgetMenu.displayText"} />
						</Typography>
						<RadioGroup
							row
							name="imageDisplayType"
							onChange={(e) => setImageDisplayType(e.target.value)}
							style={{ display: "flex", flexWrap: "wrap" }}
							value={imageDisplayType}
						>
							<FormControlLabel
								className="rulesRadio"
								value="thumbnail"
								control={<Radio />}
								label={getTranslation("global.profiles.widgets.shared.widgetMenu.thumbnails")}
								sx={{
									minWidth: "150px",
									color: "#fff",
									fontSize: 11,
									opacity: imageDisplayType === "thumbnail" ? 1 : 0.69
								}}
								disableTypography={true}
							/>
							<FormControlLabel
								className="rulesRadio"
								value="slideshow"
								control={<Radio />}
								label={getTranslation("global.profiles.widgets.shared.widgetMenu.slideShow")}
								sx={{
									minWidth: "150px",
									color: "#fff",
									fontSize: 11,
									opacity: imageDisplayType === "slideshow" ? 1 : 0.69
								}}
								disableTypography={true}
							/>
						</RadioGroup>
					</div>
				</div>
			</CBDialog>
			<div style={{ display: "none" }}>
				<PhoenixDropzone
					ref={dropzoneRef}
					targetEntityId={targetEntityId}
					targetEntityType={targetEntityType}
					attachAction={attachAction}
				/>
			</div>
		</>
	);
};

export default WidgetMenu;
