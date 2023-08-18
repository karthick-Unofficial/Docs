import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { persistMapFloorplanControlState } from "../../tabletopSessionActions";
import { mapLayerSettingsSelector, mapFloorPlanSettingsSelector, facilitiesSelector } from "../../selectors";
import MapFloorPlan from "./MapFloorPlan";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const mapFloorPlanSettings = mapFloorPlanSettingsSelector(state);
	const facilities = facilitiesSelector(state);
	const mapRef = state.tabletopSession && state.tabletopSession.mapRefs ? state.tabletopSession.mapRefs.find(mapRef => mapRef.floorPlanId == null) : null;

	return {
		mapLayerSettings,
		mapFloorPlanSettings,
		map: mapRef ? mapRef.mapRef : null,
		facilities,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ updatePersistedState, persistMapFloorplanControlState }, dispatch);
};

const MapFloorPlanContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapFloorPlan);

export default MapFloorPlanContainer;
