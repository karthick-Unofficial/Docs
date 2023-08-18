import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
	Fab,
	Popover,
	MenuItem,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import { Add, Place, Layers, Timeline } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	handleSelect: PropTypes.func.isRequired
};

const ShapeSelect = ({
	handleSelect,
	dir
}) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSelectEvent = mode => {
		handleSelect({ type: "drawing", mode });
		handleMenuClose();
	};

	const open = !!anchorEl;

	return (
		<Fragment>
			<Fab
				onClick={open ? handleMenuClose : handleMenuOpen}
				color="primary"
			>
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
					<ListItemIcon>
						<Place />
					</ListItemIcon>
					<ListItemText primary={getTranslation("global.map.tools.shapeSelect.point")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
				</MenuItem>
				<MenuItem onClick={() => handleSelectEvent("draw_polygon")}>
					<ListItemIcon>
						<Layers />
					</ListItemIcon>
					<ListItemText primary={getTranslation("global.map.tools.shapeSelect.polygon")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
				</MenuItem>
				<MenuItem onClick={() => handleSelectEvent("draw_line_string")}>
					<ListItemIcon>
						<Timeline />
					</ListItemIcon>
					<ListItemText primary={getTranslation("global.map.tools.shapeSelect.line")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
				</MenuItem>
			</Popover>
		</Fragment>
	);
};

ShapeSelect.propTypes = propTypes;

export default ShapeSelect;
