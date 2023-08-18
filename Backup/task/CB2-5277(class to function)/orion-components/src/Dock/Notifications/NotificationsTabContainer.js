import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NotificationsTab from "./NotificationsTab";
import * as actions from "./actions";

const mapStateToProps = state => {
	const { expandedAlert } = state.appState.dock.dockData;
	return {
		userId: state.session.identity.userId,
		expandedAlert
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actions, dispatch);
};

const NotificationsTabContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NotificationsTab);

export default NotificationsTabContainer;
