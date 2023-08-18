import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import CreateSession from "./CreateSession";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		baseSimulations: state.tabletopSessions ? state.tabletopSessions.baseSimulations : null,
		sessionToLoad: state.tabletopSessions ? state.tabletopSessions.sessionToLoad : null,
		developmentMode: state.clientConfig.developmentMode,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CreateSessionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateSession);

export default CreateSessionContainer;
