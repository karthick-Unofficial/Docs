import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions.js";
import HealthService from "./HealthService";


const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const HealthServiceContainer = connect(
	null,
	mapDispatchToProps
)(HealthService);

export default HealthServiceContainer;
