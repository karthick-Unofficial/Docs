import { connect } from "react-redux";
import ActiveFloorPlans from "./ActiveFloorPlans";
import {
	persistedState
} from "orion-components/AppState/Selectors";
import { layerSourcesSelector } from "orion-components/GlobalData/Selectors";
import {
	mapSettingsSelector
} from "orion-components/AppState/Selectors";
import _ from "lodash";

const mapStateToProps = (state, props) => {
	const { selectedFloors } = persistedState(state);
	const feedData = layerSourcesSelector(state, props);
	const settings = mapSettingsSelector(state);
	const filteredFps = {};
	if (feedData && selectedFloors) {
		Object.keys(feedData).forEach(facilityId => {
			if (selectedFloors[facilityId] && selectedFloors[facilityId].id) {
				filteredFps[facilityId] = selectedFloors[facilityId];
			}
		});
	}
	return { selectedFloors: Object.keys(filteredFps).length ? filteredFps : null, settings };
};

const ActiveFloorPlansContainer = connect(mapStateToProps)(ActiveFloorPlans);

export default ActiveFloorPlansContainer;
