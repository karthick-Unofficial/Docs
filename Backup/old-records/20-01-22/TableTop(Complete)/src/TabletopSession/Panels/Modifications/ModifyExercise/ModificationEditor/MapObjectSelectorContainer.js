import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../modificationActions";
import MapObjectSelector from "./MapObjectSelector";
import { facilitiesSelector } from "../../../../selectors";
//import { getFacilityFloorPlans } from "../../../../tabletopSessionActions";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = state => {
	const facilities = facilitiesSelector(state);
	return {
		map: state.tabletopSession && state.tabletopSession.mapRefs ? state.tabletopSession.mapRefs.find(mapRef => mapRef.floorPlanId == null).mapRef : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		facilities: facilities,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents: null,
		simulationData: state.tabletopSession && state.tabletopSession.simulationData,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapObjectSelectorContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{withRef: true}
)(MapObjectSelector);

export default MapObjectSelectorContainer;
