import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadAgentProfile, loadFacilityProfile, getFloorPlans } from "../../tabletopSessionActions";
import { facilitiesSelector, exerciseSettingsSelector } from "../../selectors";
import LayerSources from "./LayerSources";

const mapStateToProps = (state) => {
	const facilities = facilitiesSelector(state);
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		simulationData: state.tabletopSession ? state.tabletopSession.simulationData : null,
		facilities,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		simTimePrecision: exerciseSettings.simTimePrecision
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators( { loadAgentProfile, loadFacilityProfile, getFloorPlans }, dispatch);
}

const LayerSourcesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LayerSources);

export default LayerSourcesContainer;
