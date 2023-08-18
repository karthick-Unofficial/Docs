import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadAgentProfile, openEventsWidget, createCommunication } from "../../tabletopSessionActions";
import  Notifications from "./Notifications";

const mapStateToProps = state => {
	return {
		userId: state.session.identity.userId,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		newCommunication: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.newCommunication  : null,
		commsToSend: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.commsToSend  : null,
		users: state.globalData.users
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ 
		loadAgentProfile,
		openEventsWidget,
		createCommunication
	}, dispatch);
};

const NotificationsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications);

export default NotificationsContainer;