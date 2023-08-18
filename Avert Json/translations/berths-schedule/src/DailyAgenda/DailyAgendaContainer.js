import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./dailyAgendaActions";
import DailyAgenda from "./DailyAgenda.jsx";
import { getVesselAssignmentsInPort, getDailyAgendaAssignments } from "../selectors";

const mapStateToProps = state => {
	const { date, berths } = state;
	const vesselAssignmentsInPort = getVesselAssignmentsInPort(state);
	const dailyAssignments = getDailyAgendaAssignments(state);
	return {
		date,
		vesselAssignmentsInPort,
		dailyAssignments,
		berths
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const DailyAgendaContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DailyAgenda);

export default DailyAgendaContainer;
