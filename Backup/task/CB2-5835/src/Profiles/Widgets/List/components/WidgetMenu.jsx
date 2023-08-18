import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { useDispatch } from "react-redux";
import { setWidgetState } from "orion-components/SharedActions/commonActions";
import { Translate, getTranslation } from "orion-components/i18n";

const checkboxStyle = {
	"&.Mui-checked": {
		position: "relative",
		"&:after": {
			content: '""',
			left: 13,
			top: 13,
			height: 15,
			width: 15,
			position: "absolute",
			backgroundColor: "#fff",
			zIndex: -1
		}
	}
};

const WidgetMenu = ({ dir, collapsed, widgetState, widgetName, listAccessAndEventsManage, openListDialog }) => {
	const expandedState = widgetState?.autoExpand && !collapsed;
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialog, setDialog] = useState("");
	const [autoExpand, setAutoExpand] = useState(expandedState);

	const dispatch = useDispatch();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const toggleAutoExpand = () => {
		setAutoExpand(!autoExpand);
	};

	const saveWidgetSettings = () => {
		const updatedWidgetState = widgetState;
		updatedWidgetState.autoExpand = autoExpand;
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
			fontFamily: "Roboto"
		},
		note: {
			color: "#fff",
			fontFamily: "Roboto",
			marginTop: "8px",
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
				{listAccessAndEventsManage && (
					<MenuItem
						onClick={() => {
							openListDialog();
							handleMenuClose();
						}}
						sx={{
							"&:hover": { backgroundColor: "#2D2E2F" },
							backgroundColor: "#41454B",
							fontSize: "14px"
						}}
					>
						<Translate value={"global.profiles.widgets.list.main.addList"} />
					</MenuItem>
				)}

				<MenuItem
					onClick={() => {
						setDialog("widgetMenuList");
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
			</Menu>

			<CBDialog
				open={dialog === "widgetMenuList"}
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
							count={getTranslation("global.profiles.widgets.list.main.eventLists")}
						/>
					</Typography>

					<Typography fontSize="11px" style={styles.note}>
						<Translate value={"global.profiles.widgets.shared.widgetMenu.note"} />
					</Typography>
					<FormControlLabel
						className="themedCheckBox"
						control={
							<Checkbox
								style={{
									transform: "scale(1.1)"
								}}
								checked={autoExpand}
								onChange={toggleAutoExpand}
								name="autoExpand"
								sx={checkboxStyle}
							/>
						}
						label={getTranslation("global.profiles.widgets.shared.widgetMenu.autoExpand")}
						sx={{ color: "#FFFFF", marginTop: "6.5%", marginBottom: "4%" }}
					/>
				</div>
			</CBDialog>
		</>
	);
};

export default WidgetMenu;
