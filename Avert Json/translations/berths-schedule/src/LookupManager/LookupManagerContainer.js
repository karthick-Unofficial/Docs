import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./lookupManagerActions";
import LookupManager from "./LookupManager.jsx";
const mapStateToProps = state => {
	const { management, clientConfig } = state;
	const { open, type } = management;
	const { imoRequired, mmsiRequired } = clientConfig;
	const user = state.session.user.profile;
	return { 
		open, 
		type, 
		imoRequired: Boolean(imoRequired),
		mmsiRequired: Boolean(mmsiRequired),
		user
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const LookupManagerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LookupManager);

export default LookupManagerContainer;
