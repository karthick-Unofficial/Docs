import React, { useState, useEffect } from "react";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";

// Added for popover menu hack: (CB2-904)
import Menu from "material-ui/Menu";

const TileOptions = ({
	dir,
	baseMaps,
	mapName,
	mapLabel,
	setMapStyle
}) => {

	const [open, setOpen] = useState(false);
	const [layer, setLayer] = useState(null);
	const [label, setLable] = useState(null);
	const [BaseMaps, setBaseMaps] = useState([]);
	const [thumbNail, setThumbNail] = useState("");

	const [anchorEl, setAnchorEl] = useState(null);


	useEffect(() => {
		if (baseMaps.length > 0) {
			const selectedThumbnail = baseMaps.filter((element) => element.name === mapName)[0];
			setBaseMaps(baseMaps);
			setLayer(mapName);
			setLable(mapLabel);
			setThumbNail(selectedThumbnail.thumbnail);
		}
	}, [baseMaps, mapName]);

	const toggleOpen = () => {
		setOpen(!open);
	};

	const handleRequestClose = () => {
		setOpen(false);
		setAnchorEl(null);
	};

	const SetMapStyle = style => {
		setMapStyle({ mapStyle: style });
		setOpen(false);
	};

	const allOptions = BaseMaps.map((tileLayer, index) => {
		// Return all but the currently selected layer
		return (
			tileLayer.name !== layer && (
				<div
					className={"map-sample-square hilite"}
					onClick={() => {
						SetMapStyle(tileLayer.name);
					}}
					key={index}
				>
					<div className="thumb" style={{ backgroundImage: `url(${tileLayer.thumbnail})` }} />
					<div className={dir === "rtl" ? "labelRTL" : "label"}>{tileLayer.label}</div>
				</div>
			)
		);
	});
	return (
		<div className="map-selector-wrapper">
			<div className="map-tile-options drop">
				<div
					className={"map-sample-square"}
					onClick={() => toggleOpen()}
				>
					<div className="thumb" style={{ backgroundImage: `url(${thumbNail})` }} />

					<div className={dir === "rtl" ? "labelRTL" : "label"}>{label}</div>
					<div className="dropper">
						<i className="material-icons">keyboard_arrow_down</i>
					</div>
				</div>
			</div>
			<Popover
				style={{
					backgroundColor: "transparent"
				}}
				open={open}
				animation={PopoverAnimationVertical}
				anchorEl={anchorEl}
				className={dir === "rtl" ? "map-selectionRTL" : "map-selection"}
				onRequestClose={() => handleRequestClose()}
			>
				<Menu style={{ width: "242px" }}>
					<div className="map-tile-options">{allOptions}</div>
				</Menu>
			</Popover>
		</div>
	);
};

export default TileOptions;