// import { connect } from "react-redux";
// import {CameraWidget} from "../../Widgets";
// import { selectedContextSelector } from "../../../ContextPanel/Selectors";
// import { getDir } from "orion-components/i18n/Config/selector";
// import _ from "lodash";

// const mapStateToProps = state => {
// 	const context = selectedContextSelector(state);
// 	const { floorPlan } = state;
// 	const { selectedFloor } = floorPlan || {};
	
// 	return {
// 		useCameraGeometry: true,
// 		cameras: _.uniqBy([...(context.floorPlanCameras || []), ...(context.camerasInRange || []) ], "id"),
// 		key: selectedFloor ? `${selectedFloor.id}-cameras`: "",
// 		geometry: selectedFloor ? selectedFloor.geometry : {},
// 		dir: getDir(state)
// 	};
// };

// const CameraWidgetContainer = connect(
// 	mapStateToProps
// )(CameraWidget);

// export default CameraWidgetContainer;