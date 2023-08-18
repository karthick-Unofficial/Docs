import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./emptySlotActions";
import EmptySlot from "./EmptySlot";
import { userCamerasSelector } from "orion-components/Dock/Cameras/selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const data = userCamerasSelector(state);
	const { cameras } = state.cameraWall;
	const { user } = state.session;
	const filteredCameras = {};
	Object.values(data).forEach(camera => {
		if (!Object.values(cameras).includes(camera.id)) {
			filteredCameras[camera.id] = {
				label: camera.entityData.properties.name,
				searchString: camera.entityData.properties.name
			};
		}
	});
	const canManage = user.profile.applications
		&& user.profile.applications.find(app => app.appId === "camera-wall-app")
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions.includes("manage");
	return { cameras: filteredCameras, canManage, dir: getDir(state)};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EmptySlotContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EmptySlot);

export default EmptySlotContainer;
