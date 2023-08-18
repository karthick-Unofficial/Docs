import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import PlayersSelection from "./PlayersSelection";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		dir: getDir(state)
	};
};


const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const PlayersSelectionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PlayersSelection);

export default PlayersSelectionContainer;
