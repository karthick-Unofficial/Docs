import { connect } from "react-redux";
import UserBanner from "./UserBanner";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		userInfo: state.tabletopSession ? state.tabletopSession.userInfo : null,
		userProfile: state.session ? state.session.user.profile : null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		userMappings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.userMappings : null,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		dir: getDir(state)
	};
};

const UserBannerContainer = connect(
	mapStateToProps
)(UserBanner);

export default UserBannerContainer;
