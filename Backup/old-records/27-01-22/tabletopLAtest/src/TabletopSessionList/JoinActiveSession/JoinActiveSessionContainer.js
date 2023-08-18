import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import JoinActiveSession from "./JoinActiveSession";

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const JoinActiveSessionContainer = connect(
	null,
	mapDispatchToProps
)(JoinActiveSession);

export default JoinActiveSessionContainer;
