import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions.js";
import SystemNotificationService from "./SystemNotificationService";

const mapStateToProps = state => {
	return {
		userId: state.session.user.profile.id
	};
};


const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SystemNotificationServiceContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SystemNotificationService);

export default SystemNotificationServiceContainer;
