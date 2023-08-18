import React, { Fragment, memo, useCallback, useState } from "react";
// import PropTypes from "prop-types";
import { Fab, Popover, MenuItem, ListItemText } from "@mui/material";
import { Ruler } from "mdi-material-ui";
import { getTranslation } from "orion-components/i18n";

const UnitSelect = ({ landUnitSystem, handleSelect, dir }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleOpen = e => {
		setAnchorEl(e.target);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = useCallback(value => {
		handleSelect(value);
		handleClose();
	});
	return (
		<Fragment>
			<Fab onClick={handleOpen} color="primary">
				<Ruler style={{ color: "#FFF" }} />
			</Fab>
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
			>
				<MenuItem onClick={() => handleClick("nautical-miles")}>
					<ListItemText primary={getTranslation("global.map.tools.unitSelect.nauticalMiles")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
				</MenuItem>
				{landUnitSystem === "metric" ? (
					<MenuItem onClick={() => handleClick("kilometers")}>
						<ListItemText primary={getTranslation("global.map.tools.unitSelect.kilometers")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
					</MenuItem>
				) : (
					<MenuItem onClick={() => handleClick("miles")}>
						<ListItemText primary={getTranslation("global.map.tools.unitSelect.miles")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
					</MenuItem>
				)}
			</Popover>
		</Fragment>
	);
};

export default memo(UnitSelect);
