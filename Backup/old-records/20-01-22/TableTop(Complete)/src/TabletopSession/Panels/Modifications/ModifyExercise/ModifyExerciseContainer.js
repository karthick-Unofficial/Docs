import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../modificationActions";
import {
	clearComponentMessage,
	closeModificationPanel,
	setModificationExclusiveModeOn,
	setModificationExclusiveModeOff
} from "../../../tabletopSessionActions";
import { raiseError } from "../../../../appActions";
import ModifyExercise from "./ModifyExercise";
import { exerciseSettingsSelector } from "../../../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const isController = state.tabletopSession.session.controller === state.session.user.profile.id;
	const simId = state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation
		&& state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : 0;

	const exerciseSettings = exerciseSettingsSelector(state);

	return {
		isController: isController,
		userInfo: state.tabletopSession && state.tabletopSession.userInfo ? state.tabletopSession.userInfo : null,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		simId: simId,
		simulations: state.tabletopSession ? state.tabletopSession.simulations : null,
		simTime: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation
			&& state.tabletopSession.session.currentSimulation.playStatus ? state.tabletopSession.session.currentSimulation.playStatus.simTime : 0,
		baseSimName: state.tabletopSession.session.baseSimName,
		users: state.globalData.users,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		agentGroups: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.agentGroups : null,
		simulationData: state.tabletopSession && state.tabletopSession.simulationData,
		modificationsConfig: state.clientConfig ? state.clientConfig.modificationsConfig : null,
		modifications: state.tabletopSession.modifications,
		pencilsDownData: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsData : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		simTimePrecision: exerciseSettings.simTimePrecision,
		externalMessage: state.componentMessage.message && state.componentMessage.message.recipient === "panel_modifyExercise" ?
			state.componentMessage.message.data : null,
		dir: getDir(state)

	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		...actionCreators,
		clearComponentMessage,
		closeModificationPanel,
		setModificationExclusiveModeOn,
		setModificationExclusiveModeOff,
		raiseError
	}, dispatch);
};

const ModifyExerciseContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ModifyExercise);

export default ModifyExerciseContainer;
