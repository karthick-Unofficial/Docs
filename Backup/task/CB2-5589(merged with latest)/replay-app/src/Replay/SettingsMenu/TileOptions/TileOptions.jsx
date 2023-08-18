import React, { useState, useCallback, memo, useEffect } from "react";
import { Button, Menu, Typography } from "@mui/material";
import TileOption from "./components/TileOption";
import { ExpandMore } from "@mui/icons-material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { setMapStyle } from "./tileOptionsActions";

const TileOptions = () => {
	const dispatch = useDispatch();

	const mapSettings = useSelector((state) => state.appState.persisted.mapSettings);
	const baseMaps = useSelector((state) => state.baseMaps);
	const selected = mapSettings && mapSettings.mapStyle ? mapSettings.mapStyle : "satellite";
	const dir = useSelector((state) => getDir(state));

	const [anchorEl, setAnchorEl] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [label, setLabel] = useState("");

	useEffect(() => {
		const thumb = baseMaps.filter((map) => map.name === selected)[0];
		setThumbnail(thumb.thumbnail);
		setLabel(thumb.label);
	}, [selected, baseMaps]);

	const handleSelect = useCallback(
		(style) => {
			dispatch(setMapStyle(style));
			handleClose();
		},
		[setMapStyle]
	);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};
	return (
		<div>
			<Typography style={{ paddingBottom: 16 }} variant="h6">
				<Translate value="replay.settingsMenu.TileOptions.base" />
			</Typography>
			<div style={{ position: "relative", backgroundColor: "#111" }}>
				<TileOption option={selected} label={label} thumbnail={thumbnail} dir={dir} />
				<Button
					onClick={handleOpen}
					style={{
						minWidth: 0,
						padding: 0,
						position: "absolute",
						right: 0,
						top: 0,
						width: "auto",
						height: "100%",
						backgroundColor: "#2f2f2f",
						borderRadius: 0,
						color: "#B5B9BE"
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
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				MenuListProps={{ style: { padding: 0, width: 268 } }}
			>
				{baseMaps
					.filter((option) => option.name !== selected)
					.map((option) => (
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

export default memo(TileOptions);
