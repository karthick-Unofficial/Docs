import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Translate } from "orion-components/i18n";

const WidgetMenu = ({ dir, canAddRule, addRule }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const styles = {
		iconButton: {
			height: 45,
			...(dir === "rtl" && { marginRight: "10px" }),
			...(dir === "ltr" && { marginLeft: "10px" })
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
				{canAddRule && (
					<MenuItem
						onClick={() => {
							addRule();
							handleMenuClose();
						}}
						sx={{
							"&:hover": { backgroundColor: "#2D2E2F" },
							backgroundColor: "#41454B",
							fontSize: "14px"
						}}
					>
						<Translate value={"global.profiles.widgets.shared.widgetMenu.addRule"} />
					</MenuItem>
				)}
			</Menu>
		</>
	);
};

export default WidgetMenu;
