import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./alarmActions";
import Alarm from "./Alarm";

const mapStateToProps = (state, ownProps) => {
	return {
		timeFormatPreference: state.appState.global.timeFormat
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const AlarmContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Alarm);

export default AlarmContainer;