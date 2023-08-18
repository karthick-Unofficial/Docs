import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./dockActions";
import GlobalDock from "./GlobalDock";

const mapStateToProps = ( state, ownProps ) => {
	return {
		globalDockState: state.appState && state.appState.persisted && state.appState.persisted.globalDockState
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( {...actionCreators}, dispatch);
};

const GlobalDockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GlobalDock);

export default GlobalDockContainer;
