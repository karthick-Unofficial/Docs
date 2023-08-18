import { connect } from "react-redux";
import AudioTraceGenerator from "./AudioTraceGenerator";

const mapStateToProps = state => {
	return {
		sessionSettings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.settings : null,
		playStatus: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation 
			&& state.tabletopSession.session.currentSimulation.playStatus
			? state.tabletopSession.session.currentSimulation.playStatus.status : "paused",
		newEvents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.newEvents : null
	};
};

const AudioTraceGeneratorContainer = connect(
	mapStateToProps
)(AudioTraceGenerator);

export default AudioTraceGeneratorContainer;
