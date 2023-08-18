import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadSimulation, deleteSimulation, markSimulationAsFailed } from "../../tabletopSessionActions";
import { enableModifications } from "../../Widgets/Modifications/modificationActions";
import { raiseError } from "../../../appActions";
import SimulationTree from "./SimulationTree";
import { exerciseSettingsSelector } from "../../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		userInfo: state.tabletopSession ? state.tabletopSession.userInfo : null,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null,
		currentSimulation: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.currentSimulation : null,
		simulations: state.tabletopSession ? state.tabletopSession.simulations : null,
		modificationsActive: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		readOnlySession: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.settings ? state.tabletopSession.session.settings.readOnly : false,
		simulationMode: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.simulationMode : "simulation",
		simTimePrecision: exerciseSettings.simTimePrecision,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		loadSimulation,
		deleteSimulation,
		markSimulationAsFailed,
		enableModifications,
		raiseError
	}, dispatch);
};

const SimulationTreeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulationTree);

export default SimulationTreeContainer;
