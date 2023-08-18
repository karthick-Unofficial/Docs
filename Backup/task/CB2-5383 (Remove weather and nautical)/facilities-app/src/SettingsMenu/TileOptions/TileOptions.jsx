import React, { useState, useCallback, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Menu, Typography } from "@material-ui/core";
import TileOption from "./components/TileOption";
import { ExpandMore } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";


const propTypes = {
	setMapStyle: PropTypes.func.isRequired,
	selected: PropTypes.string,
	baseMaps: PropTypes.array.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	selected: "satellite"
};


const TileOptions = ({ setMapStyle, selected, baseMaps, dir }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [label, setLabel] = useState("");

	useEffect(() => {
		const thumb = baseMaps.filter(map => map.name === selected)[0];
		setThumbnail(thumb.thumbnail);
		setLabel(thumb.label);
	}, [selected, baseMaps]);

	const handleSelect = useCallback(
		style => {
			setMapStyle(style);
			handleClose();
		},
		[setMapStyle]
	);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleOpen = e => {
		setAnchorEl(e.currentTarget);
	};
	return (
		<div>
			<Typography style={{ paddingBottom: 16 }} variant="h6">
				<Translate value="settingsMenu.tileOptions.baseMap" />
			</Typography>
			<div style={{ position: "relative", backgroundColor: "#111" }}>
				<TileOption option={selected} label={label} thumbnail={thumbnail} dir={dir}/>
				<Button
					onClick={handleOpen}
					style={dir == "rtl" ? {
						minWidth: 0,
						padding: 0,
						position: "absolute",
						left: 0,
						top: 0,
						width: "auto",
						height: "100%",
						backgroundColor: "#2f2f2f",
						borderRadius: 0
					} : {
						minWidth: 0,
						padding: 0,
						position: "absolute",
						right: 0,
						top: 0,
						width: "auto",
						height: "100%",
						backgroundColor: "#2f2f2f",
						borderRadius: 0
					}}
				>
					<ExpandMore style={{ width: "auto" }} />
				</Button>
			</div>
			<Menu
				id="tile-options"
				getContentAnchorEl={null}
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: (dir == "rtl" ? "left" : "right")
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: (dir == "rtl" ? "left" : "right")
				}}
				MenuListProps={{ style: { padding: 0, width: 268 } }}
			>
				{baseMaps.filter(option => option.name !== selected).map(option => (
					<TileOption
						key={option.id}
						option={option.name}
						label={option.label}
						handleSelect={handleSelect}
						thumbnail={option.thumbnail}
						dir={dir}
					/>
				))}
			</Menu>
		</div>
	);
};

TileOptions.propTypes = propTypes;
TileOptions.defaultProps = defaultProps;

export default memo(TileOptions);
