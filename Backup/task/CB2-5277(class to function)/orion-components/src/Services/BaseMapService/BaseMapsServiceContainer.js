import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions.js";
import BaseMapservice from "./BaseMapsService";


const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BaseMapserviceContainer = connect(
	null,
	mapDispatchToProps
)(BaseMapservice);

export default BaseMapserviceContainer;
