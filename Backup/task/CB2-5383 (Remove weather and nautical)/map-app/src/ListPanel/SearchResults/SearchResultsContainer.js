import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./searchResultsActions.js";
import SearchResults from "./SearchResults";
import { feedEntitiesSelector, userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const jsonata = require("jsonata");

const mapStateToProps = state => {
	const profileIconTemplates = {};
	const entities = feedEntitiesSelector(state);
	Object.values(userFeedsSelector(state)).forEach(feed => {
		profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
	});
	return {
		entities,
		profileIconTemplates,
		selectedEntity: selectedEntityState(state),
		dir: getDir(state)
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const SearchResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResults);

export default SearchResultsContainer;
