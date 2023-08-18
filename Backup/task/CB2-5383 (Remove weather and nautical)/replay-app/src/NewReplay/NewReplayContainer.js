import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newReplayActions";
import NewReplay from "./NewReplay.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { locale } = state.i18n;
	return {
		locale,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewReplay);

export default NewReplayContainer;
