import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openPanel, closePanel } from "orion-components/GlobalDock";
import { sendComponentMessage, clearComponentMessage } from "../../../appActions";
import DockWrapper from "./DockWrapper";

const mapStateToProps = state => {
	return {
		modificationsActive: state.tabletopSession.session.modificationsActive,
		componentMessage: state.componentMessage.message && state.componentMessage.message.recipient === "dock" ?
			state.componentMessage.message : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( {openPanel, closePanel, sendComponentMessage, clearComponentMessage}, dispatch);
};

const DockWrapperContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DockWrapper);

export default DockWrapperContainer;
