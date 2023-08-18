// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as actionCreators from "./berthScheduleActions";
// import BerthSchedule from "./BerthSchedule.jsx";
// import { orderedGroupSelector, getScheduledPending } from "../selectors";

// const mapStateToProps = state => {
// 	const { offset } = getScheduledPending(state);
// 	return {
// 		berthGroups: orderedGroupSelector(state),
// 		offset
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators(actionCreators, dispatch);
// };

// const BerthScheduleContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(BerthSchedule);

// export default BerthScheduleContainer;
