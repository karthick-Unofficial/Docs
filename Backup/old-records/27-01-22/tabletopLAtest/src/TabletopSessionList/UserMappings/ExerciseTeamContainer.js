import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import ExerciseTeam from "./ExerciseTeam";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ExerciseTeamContainer = connect(
	null,
	mapStateToProps,
	mapDispatchToProps
)(ExerciseTeam);

export default ExerciseTeamContainer;
