import React, { useState } from "react";

// Material UI
import { Button, Autocomplete, TextField } from "@mui/material";
// Material UI Icons
import MapMarkerRadiusIcon from "mdi-react/MapMarkerRadiusIcon";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const DockedControls = ({
	userCameras,
	addToDock,
	cameraPosition,
	dockedCameras,
	setFindNearestMode,
	cameraView,
	findNearestMode,
	findNearestPosition,
	dir
}) => {
	const dispatch = useDispatch();

	const [cameraSearch, setCameraSearch] = useState("");

	const handleUpdateInput = (event, camera) => {
		setCameraSearch(camera.entityData.properties.name);
		dispatch(addToDock(camera.id, cameraPosition, dockedCameras));
	};

	const handleToggleNearestCameraMode = () => {
		dispatch(setFindNearestMode(cameraPosition));
	};

	const searchableCameras = userCameras.map((item) => {
		return item;
	});

	const controlStyles = {
		addCamera: {
			backgroundColor: "#41454A",
			borderRadius: "5px",
			marginTop: "15%",
			fontSize: "10px",
			fontWeight: "bold",
			padding: "6px 0",
			...(findNearestMode[cameraPosition] && findNearestPosition === cameraPosition ? {} : { color: "#fff" })
		},
		searchCamera: {
			backgroundColor: "#2C2B2D"
		},
		dockedControls: {
			fontWeight: "bold",
			...(dir === "rtl" ? { paddingLeft: 16, paddingRight: 8 } : { paddingLeft: 8, paddingRight: 16 })
		},
		mapMarkerRadiusIcon: {
			...(dir === "ltr" && { marginLeft: 12, marginRight: 0 }),
			...(dir === "rtl" && { marginRight: 12, marginLeft: 0 })
		}
	};

	return (
		<div>
			<div className="camera-dock-controls" style={cameraView ? { paddingBottom: "15%" } : {}}>
				{cameraView && (
					<Button
						style={controlStyles.addCamera}
						primary={findNearestMode[cameraPosition] && findNearestPosition === cameraPosition}
						onClick={handleToggleNearestCameraMode}
					>
						<MapMarkerRadiusIcon style={controlStyles.mapMarkerRadiusIcon} />
						<span style={controlStyles.dockedControls}>
							{findNearestMode[cameraPosition] && findNearestPosition === cameraPosition
								? getTranslation("global.dock.cameras.dockedControls.selectNearestCam")
								: getTranslation("global.dock.cameras.dockedControls.mapLocation")}
						</span>
					</Button>
				)}
				{cameraView && (
					<p style={{ color: "#fff" }}>
						{" "}
						<Translate value="global.dock.cameras.dockedControls.or" />{" "}
					</p>
				)}
				<div style={{ width: 256 }}>
					<Autocomplete
						freeSolo
						id="free-solo"
						className="search-for-camera"
						renderInput={(params) => (
							<TextField
								{...params}
								variant="standard"
								placeholder={getTranslation("global.dock.cameras.dockedControls.searchForCam")}
							/>
						)}
						options={searchableCameras}
						getOptionLabel={(option) => {
							if (Object.keys(option).length === 0) {
								return "";
							} else {
								return option.entityData.properties.name;
							}
						}}
						openOnFocus={true}
						onChange={handleUpdateInput}
						value={cameraSearch}
						disableClearable
					/>
				</div>
			</div>
		</div>
	);
};

export default DockedControls;
