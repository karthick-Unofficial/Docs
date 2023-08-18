import React, { useState } from "react";

// Material UI
import FlatButton from "material-ui/FlatButton";
import AutoComplete from "material-ui/AutoComplete";

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

	const handleUpdateInput = searchText => {
		setCameraSearch(searchText);
	};

	const handleNewRequest = (chosenRequest, index) => {
		setCameraSearch("");
		const cameraId = userCameras[index].id;
		dispatch(addToDock(
			cameraId,
			cameraPosition,
			dockedCameras
		));
	};

	const handleToggleNearestCameraMode = () => {
		dispatch(setFindNearestMode(cameraPosition));
	};

	const searchableCameras = userCameras.map(item => {
		return item.entityData.properties.name;
	});

	const controlStyles = {
		addCamera: {
			backgroundColor: "#41454A",
			borderRadius: "5px",
			marginTop: "15%"
		},
		searchCamera: {
			backgroundColor: "#2C2B2D"
		}
	};

	return (
		<div>
			<div
				className="camera-dock-controls"
				style={cameraView ? { paddingBottom: "15%" } : {}}
			>
				{cameraView && (
					<FlatButton
						style={controlStyles.addCamera}
						// If find nearest mode is active, and the position matches, style button correctly
						label={
							findNearestMode[cameraPosition] &&
								findNearestPosition === cameraPosition
								? getTranslation("global.dock.cameras.dockedControls.selectNearestCam")
								: getTranslation("global.dock.cameras.dockedControls.mapLocation")
						}
						primary={
							findNearestMode[cameraPosition] &&
							findNearestPosition === cameraPosition
						}
						labelStyle={{ fontSize: "10px" }}
						onClick={handleToggleNearestCameraMode}
						icon={<MapMarkerRadiusIcon style={dir == "rtl" ? { marginLeft: 0, marginRight: 12 } : {}} />}
					/>
				)}
				{cameraView && <p> <Translate value="global.dock.cameras.dockedControls.or" /> </p>}
				<AutoComplete
					className="search-for-camera"
					textFieldStyle={controlStyles.searchCamera}
					hintText={getTranslation("global.dock.cameras.dockedControls.searchForCam")}
					searchText={cameraSearch}
					onUpdateInput={handleUpdateInput}
					onNewRequest={handleNewRequest}
					dataSource={searchableCameras}
					filter={AutoComplete.caseInsensitiveFilter}
					openOnFocus={true}
					maxSearchResults={5}
				/>
			</div>
		</div>
	);
};

export default DockedControls;
