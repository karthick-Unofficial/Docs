import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { setController, setSimulationMode, setSessionSetting } from "../../tabletopSessionActions";
import { exerciseSettingsSelector } from "../../selectors";
import ExerciseSettings from "./ExerciseSettings";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		user: state.session.user.profile,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		exerciseSettings,
		sessionSettings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.settings : null,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		facilitator: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.facilitator : null, 
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null,
		simulationMode: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.simulationMode: "simulation",
		modificationsActive: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		users: state.globalData.users,
		userMappings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.userMappings : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ 
		updatePersistedState,
		setController,
		setSimulationMode,
		setSessionSetting 
	}, dispatch);
};

const ExerciseSettingsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ExerciseSettings);

export default ExerciseSettingsContainer;