import { getDir } from "orion-components/i18n/Config/selector";
import { connect } from "react-redux";
import SessionLoadProgress from "./SessionLoadProgress";


const mapStateToProps = state => {
	return {
		sessionToLoad: state.tabletopSessions ? state.tabletopSessions.sessionToLoad : null,
		dir: getDir(state)
	};
};

const SessionLoadProgressContainer = connect(
	mapStateToProps
)(SessionLoadProgress);

export default SessionLoadProgressContainer;
