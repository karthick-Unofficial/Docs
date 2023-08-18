import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions.js";
import ApplicationProfileService from "./ApplicationProfileService";


const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ApplicationProfileServiceContainer = connect(
	null,
	mapDispatchToProps
)(ApplicationProfileService);

export default ApplicationProfileServiceContainer;
