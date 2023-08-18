import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./createEventActions";
import CreateEvent from "./CreateEvent";

const mapStateToProps = (state, ownProps) => {
	return {
		timeFormatPreference: state.appState.global.timeFormat
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const CreateEventContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateEvent);

export default CreateEventContainer;