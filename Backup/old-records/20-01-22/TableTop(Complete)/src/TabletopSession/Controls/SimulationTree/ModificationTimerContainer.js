import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ModificationTimer from "./ModificationTimer";
import { setModificationsData } from "../../Widgets/Modifications/modificationActions";
import { exerciseSettingsSelector } from "../../selectors";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		userInfo: state.tabletopSession ? state.tabletopSession.userInfo : null,
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null,
		modificationsData: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsData : null,
		modificationsActive: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null, exerciseSettings,
		modifyTimerDuration: exerciseSettings.modifyTimerDuration,
		userMappings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.userMappings : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		setModificationsData
	}, dispatch);
};

const ModificationTimerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ModificationTimer);

export default ModificationTimerContainer;