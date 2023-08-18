import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../tabletopSessionListActions";
import {setController} from "../../TabletopSession/tabletopSessionActions";
import UserMappings from "./UserMappings";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = state => {
	const users = state.globalData.users;
	
	return {
		sessionToLoad: state.tabletopSessions ? state.tabletopSessions.sessionToLoad : null,
		users,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({...actionCreators, setController}, dispatch);
};

const UserMappingsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserMappings);

export default UserMappingsContainer;
