import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setLocalState } from "../../../appActions";
import { clearComponentMessage } from "../../tabletopSessionActions";
import * as actionCreators from "./dockActions";
import { dockStateSelector } from "./selectors";
import Dock from "./Dock";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = ( state, ownProps ) => {
	const dockState = dockStateSelector(state);
	let widgetLocalState = null;
	if (state.localState) {
		if (ownProps.dockDirection === "left") {
			if (dockState.leftDock.currentWidget) {
				widgetLocalState = state.localState["widget_" + dockState.leftDock.currentWidget];
			}
		} else if (ownProps.dockDirection === "right") {
			if (dockState.rightDock.currentWidget) {
				widgetLocalState = state.localState["widget_" + dockState.rightDock.currentWidget];
			}
		}
	}
	return {
		dockState,
		modificationsActive: state.tabletopSession.session.modificationsActive,
		componentMessage: state.componentMessage.message && state.componentMessage.message.recipient === "dock" ?
			state.componentMessage.message : null,
		widgetLocalState,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( {...actionCreators, setLocalState, clearComponentMessage}, dispatch);
};

const DockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Dock);

export default DockContainer;
