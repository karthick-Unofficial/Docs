import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadAgentProfile } from "../../tabletopSessionActions";
import EventText from "./EventText";
import { exerciseSettingsSelector } from "../../selectors";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		simTimePrecision: exerciseSettings.simTimePrecision
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ loadAgentProfile }, dispatch);
};

const EventTextContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventText);

export default EventTextContainer;
