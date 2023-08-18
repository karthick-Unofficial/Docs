import { connect } from "react-redux";
import AppMenu from "./AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		user: state.session.user.profile,
		org: state.session.organization.profile,
		emailConfig: state.clientConfig.supportEmail,
		dir: getDir(state)
	};
};

const AppMenuContainer = connect(
	mapStateToProps,
	null
)(AppMenu);

export default AppMenuContainer;
