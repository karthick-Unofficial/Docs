import React, { memo } from "react";
import PropTypes from "prop-types";
import { SearchSelectField } from "orion-components/CBComponents";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { userCamerasSelector } from "orion-components/Dock/Cameras/selectors";

import { addToWall, addToGroup } from "./emptySlotActions";

const propTypes = {
	gridHeight: PropTypes.number,
	groupId: PropTypes.string,
	index: PropTypes.string.isRequired,
	readOnly: PropTypes.bool
};

const defaultProps = {
	group: null,
	gridHeight: null,
	readOnly: false
};

const EmptySlot = ({ groupId, gridHeight, index, readOnly }) => {
	const data = useSelector((state) => userCamerasSelector(state));
	const Cameras = useSelector((state) => state.cameraWall.cameras);
	const { user } = useSelector((state) => state.session);
	const filteredCameras = {};
	Object.values(data).forEach((camera) => {
		if (!Object.values(Cameras).includes(camera.id)) {
			filteredCameras[camera.id] = {
				label: camera.entityData.properties.name,
				searchString: camera.entityData.properties.name
			};
		}
	});
	const cameras = filteredCameras;
	const dir = useSelector((state) => getDir(state));
	const canManage =
		user.profile.applications &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app") &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions.includes("manage");
	const dispatch = useDispatch();

	const styles = {
		empty: {
			border: readOnly ? "none" : "2px dashed #41454a",
			padding: "0px 36px",
			height: gridHeight,
			width: "100%",
			display: "flex",
			alignItems: "center"
		}
	};
	const handleSelect = (id) => {
		if (!groupId) {
			dispatch(addToWall(id, index));
		} else {
			dispatch(addToGroup(groupId, index, id));
		}
	};
	const placeholderTxt = getTranslation("cameraWall.cameraSlot.emptySlot.placeholder");
	const noResultTxt = getTranslation("cameraWall.cameraSlot.emptySlot.noResult");

	return (
		<div style={styles.empty}>
			{!readOnly && canManage && (
				<SearchSelectField
					closeOnSelect={true}
					id={index}
					items={cameras}
					handleSelect={handleSelect}
					placeholder={placeholderTxt}
					dir={dir}
					noResultString={noResultTxt}
				/>
			)}
		</div>
	);
};

EmptySlot.propTypes = propTypes;
EmptySlot.defaultProps = defaultProps;

export default memo(EmptySlot);
