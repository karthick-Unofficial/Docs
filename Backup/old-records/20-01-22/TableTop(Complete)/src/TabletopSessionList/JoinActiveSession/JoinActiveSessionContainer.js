import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import JoinActiveSession from "./JoinActiveSession";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const JoinActiveSessionContainer = connect(
	null,
	mapStateToProps,
	mapDispatchToProps
)(JoinActiveSession);

export default JoinActiveSessionContainer;
