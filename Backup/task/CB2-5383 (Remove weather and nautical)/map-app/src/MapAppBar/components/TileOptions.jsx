import React, { useState, useRef, useEffect } from "react";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";

// Added for popover menu hack: (CB2-904)
import Menu from "material-ui/Menu";

const TileOptions = (props) => {
	const {
		baseMaps,
		setMapStyle,
		mapName,
		mapLabel,
		dir
	} = props;
	const [open, setOpen] = useState(false);
	const [BaseMapState, setBaseMapState] = useState([]);
	const [thumbNail, setThumbNail] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);

	const dropdownref = useRef();

	const _toggleOpen = () => {
		setOpen(!open);
		//setAnchorEl(dropdownref.current.open());
		//dropdownref.current.open();
	};


	const _handleRequestClose = () => {
		setOpen(false);
		setAnchorEl(null);
	};

	useEffect(() => {
		if (baseMaps.length > 0) {
			const selectedThumbnail = baseMaps.filter((element) => element.name === mapName)[0];
			setBaseMapState(baseMaps);
			setThumbNail(selectedThumbnail.thumbnail);
		}
	}, [props]);

	const SetUpMapStyle = style => {
		setMapStyle({ mapStyle: style });
		setOpen(false);
	};

	const allOptions = BaseMapState.map((tileLayer, index) => {
		// Return all but the currently selected layer
		return (
			tileLayer.name !== mapName && (
				<div
					className={"map-sample-square hilite"}
					onClick={() => {
						SetUpMapStyle(tileLayer.name);
					}}
					key={index}
				>
					<div className="thumb" style={{ backgroundImage: `url(${tileLayer.thumbnail})` }} />
					<div className={dir == "rtl" ? "labelRTL" : "label"}>{tileLayer.label}</div>
				</div>
			)
		);
	});

	const getLabel = BaseMapState.map(value => {
		if (value.name === mapLabel) {
			return value.label;
		}
	});

	return (
		<div className="baseMapSelectorWrapper" ref={dropdownref}>
			<div className="mapTileOptions drop">
				<div
					className={"map-sample-square"}
					onClick={() => _toggleOpen()}
				>
					<div className="thumb" style={{ backgroundImage: `url(${thumbNail})` }} />
					<div className={dir == "rtl" ? "labelRTL" : "label"}>{getLabel}</div>
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
				className={dir == "rtl" ? "baseMapSelectionRTL" : "baseMapSelection"}
				onRequestClose={() => _handleRequestClose()}
			>
				<Menu style={{ width: "242px" }}>
					<div className="mapTileOptions">{allOptions}</div>
				</Menu>
			</Popover>
		</div>
	);

};

export default TileOptions;
