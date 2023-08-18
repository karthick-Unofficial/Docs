import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { facilitiesSelector } from "../../selectors";
import { setLocalAppState } from "orion-components/AppState/Persisted/actions";
import { clearComponentMessage } from "../../tabletopSessionActions";
import Facilities from "./Facilities";

const mapStateToProps = state => {
	const facilities = facilitiesSelector(state);

	return {
		facilities,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		externalMessage: state.componentMessage.message && state.componentMessage.message.recipient === "panel_facilities" ?
			state.componentMessage.message.data : null,
		localState: state.appState.persisted.panel_facilities
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({clearComponentMessage, setLocalAppState}, dispatch);
};

const FacilitiesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Facilities);

export default FacilitiesContainer;
