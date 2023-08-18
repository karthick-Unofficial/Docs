import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import { librarySessionsSelector } from "../selectors";
import SessionLibrary from "./SessionLibrary";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	// -- don't do anything until globalData is populated
	if (Object.keys(state.globalData.users).length === 0) {
		return null;
	}

	const users = state.globalData.users;
	
	const librarySessions = librarySessionsSelector(state);
	return {
		librarySessions,
		users,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SessionLibraryContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SessionLibrary);

export default SessionLibraryContainer;
