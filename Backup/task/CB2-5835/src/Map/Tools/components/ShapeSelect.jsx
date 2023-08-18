import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Fab, Popover, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Add, Place, Layers, Timeline } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	handleSelect: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const ShapeSelect = ({ handleSelect, dir }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const dispatch = useDispatch();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSelectEvent = (mode) => {
		dispatch(handleSelect({ type: "drawing", mode }));
		handleMenuClose();
	};

	const open = !!anchorEl;
	const styles = {
		listItemAlign: {
			...(dir == "rtl" && { textAlign: "right" }),
			margin: "4px 0"
		},
		listItemIcon: {
			minWidth: "56px!important"
		}
	};

	return (
		<Fragment>
			<Fab onClick={open ? handleMenuClose : handleMenuOpen} color="primary">
				<Add style={{ color: "#FFF" }} />
			</Fab>
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
			>
				<MenuItem onClick={() => handleSelectEvent("draw_point")}>
					<ListItemIcon sx={styles.listItemIcon}>
						<Place />
					</ListItemIcon>
					<ListItemText
						primary={getTranslation("global.map.tools.shapeSelect.point")}
						style={styles.listItemAlign}
					/>
				</MenuItem>
				<MenuItem onClick={() => handleSelectEvent("draw_polygon")}>
					<ListItemIcon sx={styles.listItemIcon}>
						<Layers />
					</ListItemIcon>
					<ListItemText
						primary={getTranslation("global.map.tools.shapeSelect.polygon")}
						style={styles.listItemAlign}
					/>
				</MenuItem>
				<MenuItem onClick={() => handleSelectEvent("draw_line_string")}>
					<ListItemIcon sx={styles.listItemIcon}>
						<Timeline />
					</ListItemIcon>
					<ListItemText
						primary={getTranslation("global.map.tools.shapeSelect.line")}
						style={styles.listItemAlign}
					/>
				</MenuItem>
			</Popover>
		</Fragment>
	);
};

ShapeSelect.propTypes = propTypes;

export default ShapeSelect;
