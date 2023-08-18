import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import UserMapping from "./UserMapping";

const mapStateToProps = state => {
	return {
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		userMappings: state.tabletopSession && state.tabletopSession.session.userMappings ? state.tabletopSession.session.userMappings : [],
		userInfo: state.tabletopSession && state.tabletopSession.userInfo? state.tabletopSession.userInfo: null,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		users: state.globalData.users,
		//sessionToLoad: state.tabletopSessions ? state.tabletopSessions.sessionToLoad : null,
		facilitator: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.facilitator : null, 
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null
	};
};


const UserMappingContainer = connect(
	mapStateToProps
)(UserMapping);

export default UserMappingContainer;