import { connect } from "react-redux";
import FovLayer from "./FovLayer";

const mapStateToProps = state => {
	return {
		fovAgents: state.tabletopSession ? state.tabletopSession.fovAgents : null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null
	};
};

const FovLayerContainer = connect(
	mapStateToProps
)(FovLayer);

export default FovLayerContainer;
