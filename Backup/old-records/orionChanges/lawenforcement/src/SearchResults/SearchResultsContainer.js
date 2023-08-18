import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./searchResultsActions";
import SearchResults from "./SearchResults.jsx";

const mapStateToProps = state => {
	return { groups: state.results };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SearchResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResults);

export default SearchResultsContainer;
