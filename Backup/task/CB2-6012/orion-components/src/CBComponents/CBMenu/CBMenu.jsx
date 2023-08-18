import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Translate } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";
import { useSelector } from "react-redux";

const CBMenu = ({ menuItems, customStyles }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const dir = useSelector((state) => getDir(state));

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
		},
		menuItem: {
			width: "204px",
			height: "44px"
		},
		menuList: {
			padding: 0
		},
		...customStyles
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
				PaperProps={{
					sx: {
						"& ul": styles.menuList
					}
				}}
			>
				{menuItems.map((menuItem, index) =>
					menuItem.showMenuItem ? (
						<MenuItem
							key={index}
							disabled={menuItem.disabled}
							onClick={() => {
								menuItem.onClick();
								handleMenuClose();
							}}
							style={styles.menuItem}
							sx={{
								"&:hover": { backgroundColor: "#2D2E2F" },
								backgroundColor: "#41454B",
								fontSize: "14px"
							}}
						>
							<Translate value={menuItem.label} />
						</MenuItem>
					) : null
				)}
			</Menu>
		</>
	);
};

CBMenu.propTypes = {
	menuItems: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			onClick: PropTypes.func.isRequired,
			disabled: PropTypes.bool.isRequired,
			showMenuItem: PropTypes.bool.isRequired
		})
	).isRequired
};

export default CBMenu;
