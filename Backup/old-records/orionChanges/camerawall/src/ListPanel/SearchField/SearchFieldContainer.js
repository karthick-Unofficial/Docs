import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./searchFieldActions";
import SearchField from "./SearchField";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { stagedItem } = state.cameraWall;
	return { stagedItem, dir: getDir(state)};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SearchFieldContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchField);

export default SearchFieldContainer;
