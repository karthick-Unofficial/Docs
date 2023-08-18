import { connect } from "react-redux";
import WavCam from "./WavCam";
import * as actionCreators from "./wavCamActions";
import { bindActionCreators } from "redux";
import { wavCamFOVItems, getContext } from "./selectors";
import { v4 as uuidv4 } from "uuid";
import { userCamerasSelector } from "../Cameras/selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	const userCameras = userCamerasSelector(state);
	const wavCams = userCameras.filter((cam) => {
		return cam.entityData.properties.features && cam.entityData.properties.features.includes("ribbon");
	})
		.map((cam) => {
			return { 
				id: cam.id, 
				name: cam.entityData.properties.name,
				instanceId: uuidv4(),
				config: cam.connection 
			};
		});

	const wavCamPersistedState = state.appState.persisted ? state.appState.persisted.wavcam_pano : { wavCamMetadata: {} };
	let selectedWavCam = null;
	let fovItems, context = null;
	if(wavCams.length > 0) {
		selectedWavCam = wavCamPersistedState && wavCamPersistedState.selectedWavCam ? 
			wavCams.find((c) => c.id === wavCamPersistedState.selectedWavCam) :
			wavCams[0];
		fovItems = selectedWavCam ? wavCamFOVItems(selectedWavCam.id)(state) : [];
		context = selectedWavCam ? getContext(selectedWavCam.id)(state) : null;
	}
	return {
		context: context,
		open: state.appState.dock.dockData.WavCam,
		showWavCamLabels: state.appState.dock.dockData.showWavCamLabels,
		fovItems,
		wavCams: wavCams,
		selectedWavCam: selectedWavCam,
		wavCamPersistedState: wavCamPersistedState,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const WavCamContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(WavCam);

export default WavCamContainer;