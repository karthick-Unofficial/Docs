// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as actionCreators from "./actions.js";
// import AlertLayer from "./AlertLayer";
// import { priorityNotificationSelector } from "orion-components/GlobalData/Selectors";
// const mapStateToProps = (state, props) => {
// 	let alerts = {};
// 	if (props.alerts) {
// 		alerts = props.alerts;
// 	} else {
// 		alerts = priorityNotificationSelector(state);
// 	}

// 	return { alerts };
// };

// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators(actionCreators, dispatch);
// };

// const AlertLayerContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(AlertLayer);

// export default AlertLayerContainer;
