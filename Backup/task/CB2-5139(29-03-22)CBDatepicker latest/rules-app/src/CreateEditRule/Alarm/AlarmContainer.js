import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./alarmActions";
import Alarm from "./Alarm";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	return {
		timeFormatPreference: state.appState.global.timeFormat,
		dir: getDir(state)
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