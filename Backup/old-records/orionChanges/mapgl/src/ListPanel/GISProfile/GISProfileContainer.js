import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./gisProfileActions.js";
import { GISProfile } from "orion-components/Profiles";
import { mapState } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const context = selectedContextSelector(state);
	const user = state.session.user.profile;
	const mapStatus = mapState(state);
	return {
		context,
		user,
		mapVisible: mapStatus.visible,
		timeFormatPreference: state.appState.global.timeFormat,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const GISProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GISProfile);

export default GISProfileContainer;
