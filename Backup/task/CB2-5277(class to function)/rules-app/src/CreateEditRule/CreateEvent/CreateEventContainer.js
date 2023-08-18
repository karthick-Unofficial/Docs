import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./createEventActions";
import CreateEvent from "./CreateEvent";
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

const CreateEventContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateEvent);

export default CreateEventContainer;